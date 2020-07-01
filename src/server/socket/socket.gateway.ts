import { config } from 'dotenv'
import { Socket } from 'socket.io'
import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets'
import { RedisClient, createClient, ClientOpts } from 'redis'
import { ChatGroupInvite } from '../../entities'
import {
  SocketEventsFromClient,
  SocketEventsFromServer,
} from '../../socket-events'
import { Notification } from '../../entities'

config()

@WebSocketGateway()
export default class EventGateway
  implements OnGatewayConnection, OnGatewayDisconnect {
  private userIdToSocketIdMap: Record<string, string | undefined>
  private subscriberCountByNotificationChannel: Record<string, number>
  private redisSubscriber: RedisClient
  private redisPublisher: RedisClient

  constructor() {
    const options: ClientOpts = {
      host: process.env.REDIS_SERVICE_SERVICE_HOST,
      port: Number(process.env.REDIS_SERVICE_SERVICE_PORT),
      password: process.env.REDIS_PASSWORD,
    }
    this.redisSubscriber = createClient(options)
    this.redisPublisher = createClient(options)
    this.userIdToSocketIdMap = {}
    this.subscriberCountByNotificationChannel = {}
  }

  handleConnection(socket: Socket) {
    console.log(`socket ${socket.id} has been connected`)
    const { loggedInUserId } = socket.handshake.query
    this.userIdToSocketIdMap[loggedInUserId] = socket.id
    if (typeof loggedInUserId === 'string') {
      this.redisSubscriber.subscribe(`notifications${loggedInUserId[0]}`)
      if (
        this.subscriberCountByNotificationChannel[loggedInUserId[0]] ===
        undefined
      ) {
        this.subscriberCountByNotificationChannel[loggedInUserId[0]] = 1
      } else {
        ++this.subscriberCountByNotificationChannel[loggedInUserId[0]]
      }
      this.redisSubscriber.on('message', (_, message) => {
        const { userIdEmitTarget, data, event } = JSON.parse(message)
        const socketId = this.userIdToSocketIdMap[userIdEmitTarget]
        if (typeof socketId === 'string') {
          socket.to(socketId).emit(event, data)
        }
      })
    }
  }

  handleDisconnect(socket: Socket) {
    console.log(`socket ${socket.id} has disconnected`)
    const { loggedInUserId } = socket.handshake.query
    this.userIdToSocketIdMap[loggedInUserId] = undefined
    --this.subscriberCountByNotificationChannel[loggedInUserId[0]]
    if (this.subscriberCountByNotificationChannel[loggedInUserId[0]] === 0) {
      this.redisSubscriber.unsubscribe(`notifications${loggedInUserId[0]}`)
    }
  }

  emitOrPublishEventToSingleUser<T, K extends keyof T>(
    socket: Socket,
    dataSend: T,
    key: K,
    event: SocketEventsFromServer
  ): void {
    const userId: string = (dataSend[key] as unknown) as string
    const userSocketIdSendTo: string | undefined = this.userIdToSocketIdMap[
      userId
    ]
    if (typeof userSocketIdSendTo === 'string') {
      socket.to(userSocketIdSendTo).emit(event, dataSend)
    } else {
      const message: string = JSON.stringify({
        userIdEmitTarget: userId,
        data: dataSend,
        event,
      })
      this.redisPublisher.publish(`notifications${userId[0]}`, message, () => {
        console.log(`published message ${message}`)
      })
    }
  }

  @SubscribeMessage(SocketEventsFromClient.CHAT_GROUP_INVITE_SENT)
  chatGroupInviteHasBeenSent(
    socket: Socket,
    chatGroupInviteReducerItem: ChatGroupInvite
  ): void {
    this.emitOrPublishEventToSingleUser(
      socket,
      chatGroupInviteReducerItem,
      'targetUserId',
      SocketEventsFromServer.CHAT_GROUP_INVITE_RECEIVED
    )
  }

  @SubscribeMessage(SocketEventsFromClient.CHAT_GROUP_INVITE_RESPONSE_SENT)
  chatGroupInviteResponseHasBeenSent(
    socket: Socket,
    newNotification: Notification
  ): void {
    this.emitOrPublishEventToSingleUser(
      socket,
      newNotification,
      'targetUserId',
      SocketEventsFromServer.CHAT_GROUP_INVITE_RESPONSE_RECEIVED
    )
  }
}

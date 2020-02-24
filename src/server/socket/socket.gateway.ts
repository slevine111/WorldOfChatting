import { config } from 'dotenv'
import { Socket } from 'socket.io'
import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage
} from '@nestjs/websockets'
import { RedisClient, createClient, ClientOpts } from 'redis'
import { INotificationReducerFields } from '../../types-for-both-server-and-client'
import {
  SocketEventsFromClient,
  SocketEventsFromServer
} from '../../socket-events'

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
      password: process.env.REDIS_PASSWORD
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
        const { emitTarget, data, event } = JSON.parse(message)
        socket.to(emitTarget).emit(event, data)
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

  @SubscribeMessage(SocketEventsFromClient.CHAT_GROUP_INVITE_SENT)
  chatGroupInviteHasBeenSent(
    socket: Socket,
    notificationReducerItem: INotificationReducerFields
  ) {
    const { targetUserId } = notificationReducerItem
    const targetUserSocketId: string | undefined = this.userIdToSocketIdMap[
      targetUserId
    ]
    if (typeof targetUserSocketId === 'string') {
      socket
        .to(targetUserSocketId)
        .emit(
          SocketEventsFromServer.CHAT_GROUP_INVITE_RECEIVED,
          notificationReducerItem
        )
    } else {
      this.redisPublisher.publish(
        `notifications${targetUserId[0]}`,
        JSON.stringify({
          emitTarget: targetUserSocketId,
          data: notificationReducerItem,
          event: SocketEventsFromServer.CHAT_GROUP_INVITE_RECEIVED
        }),
        () => {
          console.log('published something')
        }
      )
    }
  }
}

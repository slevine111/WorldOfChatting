import io from 'socket.io-client'
import { MyStoreType } from '../index'
import { chatGroupSocketEventReceived } from '../notification/actions'
import { INotificationReducerFields } from '../../../types-for-both-server-and-client'
import {
  SocketEventsFromClient,
  SocketEventsFromServer
} from '../../../socket-events'
const {
  CHAT_GROUP_INVITE_RECEIVED,
  CHAT_GROUP_INVITE_RESPONSE_RECEIVED
} = SocketEventsFromServer

export default class MySocket {
  private socket: SocketIOClient.Socket
  private store: MyStoreType
  constructor(store: MyStoreType) {
    this.socket = {} as SocketIOClient.Socket
    this.store = store
  }

  connect(loggedInUserId: string): void {
    this.socket = io(window.location.origin, {
      query: { loggedInUserId }
    })
    console.log('two-way connection has been made!')

    const chatGroupEvents = [
      CHAT_GROUP_INVITE_RECEIVED,
      CHAT_GROUP_INVITE_RESPONSE_RECEIVED
    ]
    for (let i = 0; i < chatGroupEvents.length; ++i) {
      this.socket.on(
        chatGroupEvents[i],
        (notificationReducerItem: INotificationReducerFields) => {
          this.store.dispatch(
            chatGroupSocketEventReceived(notificationReducerItem)
          )
        }
      )
    }
  }

  disconnect(): void {
    this.socket.close()
  }

  sendInviteToChatGroupRequest(
    notificationReducerItem: INotificationReducerFields
  ): void {
    this.socket.emit(
      SocketEventsFromClient.CHAT_GROUP_INVITE_SENT,
      notificationReducerItem
    )
  }

  sendChatGroupRequestResponse(
    updatedNotification: INotificationReducerFields
  ): void {
    this.socket.emit(
      SocketEventsFromClient.CHAT_GROUP_INVITE_RESPONSE_SENT,
      updatedNotification
    )
  }
}

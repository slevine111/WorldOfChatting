import io from 'socket.io-client'
import { MyStoreType } from '../index'
import { chatGroupInvitationReceived } from '../notification/actions'
import { INotificationReducerFields } from '../../../types-for-both-server-and-client'
import {
  SocketEventsFromClient,
  SocketEventsFromServer
} from '../../../socket-events'

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
    this.socket.on(
      SocketEventsFromServer.CHAT_GROUP_INVITE_RECEIVED,
      (notificationReducerItem: INotificationReducerFields) => {
        this.store.dispatch(
          chatGroupInvitationReceived(notificationReducerItem)
        )
      }
    )
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
}

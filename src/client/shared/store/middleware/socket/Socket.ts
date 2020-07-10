import io from 'socket.io-client'
import { MyStoreType } from '../../store.types'
import { actionCreators } from './actions'
import {
  SocketEventsFromClient,
  SocketEventsFromServer,
} from '../../../../../socket-events'
import { Notification, ChatGroupInvite } from '../../../../../entities'
const {
  CHAT_GROUP_INVITE_RECEIVED,
  CHAT_GROUP_INVITE_RESPONSE_RECEIVED,
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
      query: { loggedInUserId },
    })
    console.log('two-way connection has been made!')

    this.socket.on(
      CHAT_GROUP_INVITE_RECEIVED,
      (chatGroupInviteReducerItem: ChatGroupInvite) => {
        this.store.dispatch(
          actionCreators.chatGroupInviteReceived(chatGroupInviteReducerItem)
        )
      }
    )

    this.socket.on(
      CHAT_GROUP_INVITE_RESPONSE_RECEIVED,
      (notification: Notification) => {
        this.store.dispatch(actionCreators.notificationReceived(notification))
      }
    )
  }

  disconnect(): void {
    this.socket.close()
  }

  sendInviteToChatGroupRequest(
    chatGroupInviteReducerItem: ChatGroupInvite
  ): void {
    this.socket.emit(
      SocketEventsFromClient.CHAT_GROUP_INVITE_SENT,
      chatGroupInviteReducerItem
    )
  }

  sendChatGroupRequestResponse(newNotification: Notification): void {
    this.socket.emit(
      SocketEventsFromClient.CHAT_GROUP_INVITE_RESPONSE_SENT,
      newNotification
    )
  }
}

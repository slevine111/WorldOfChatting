import io from 'socket.io-client'
import { MyStoreType } from '../index'
import { chatGroupInviteReceived } from '../chatgroupinvite/actions'
import { notificationReceived } from '../notification/actions'
import { ChatGroupInvite } from '../../../entities'
import {
  SocketEventsFromClient,
  SocketEventsFromServer,
} from '../../../socket-events'
import { Notification } from '../../../entities'
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
        this.store.dispatch(chatGroupInviteReceived(chatGroupInviteReducerItem))
      }
    )

    this.socket.on(
      CHAT_GROUP_INVITE_RESPONSE_RECEIVED,
      (notification: Notification) => {
        this.store.dispatch(notificationReceived(notification))
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

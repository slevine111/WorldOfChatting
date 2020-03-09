import MySocket from './Socket'
import {
  IThunkReturnObject,
  RequestDataSuccessConstants
} from '../APIRequestsHandling/types'
import { AnyAction } from 'redux'
import { ChatGroupInviteActionReturns } from '../chatgroupinvite/actions'
import { AuthActionReturns } from '../auth/actions'
import { SharedActionsTypes } from '../APIRequestsHandling/multiplereduceractions'
import { MyStoreType } from '../index'
const {
  AUTHENTICATING_USER_LOGIN_ATTEMPT_REQUEST_SUCCESS,
  CHECKING_IF_USER_LOGGED_IN_REQUEST_SUCCESS,
  USER_LOGGING_OUT_REQUEST_SUCCESS,
  CHAT_GROUP_INVITE_REQUEST_SUCCESS,
  CHAT_GROUP_INVITE_ACCEPTED_REQUEST_SUCCESS,
  CHAT_GROUP_INVITE_DECLINED_REQUEST_SUCCESS
} = RequestDataSuccessConstants

const isThunkOject = (
  action: IThunkReturnObject<any> | AnyAction
): action is IThunkReturnObject<any> => {
  return (action as IThunkReturnObject<any>).requestDataActionType !== undefined
}

export default (store: MyStoreType) => {
  const socket: MySocket = new MySocket(store)

  return (next: any) => (
    action:
      | ChatGroupInviteActionReturns
      | SharedActionsTypes
      | AuthActionReturns
  ) => {
    if (isThunkOject(action)) return next(action)

    switch (action.type) {
      case AUTHENTICATING_USER_LOGIN_ATTEMPT_REQUEST_SUCCESS:
      case CHECKING_IF_USER_LOGGED_IN_REQUEST_SUCCESS:
        socket.connect(action.user.id)
        break
      case USER_LOGGING_OUT_REQUEST_SUCCESS:
        socket.disconnect()
        break
      case CHAT_GROUP_INVITE_REQUEST_SUCCESS:
        socket.sendInviteToChatGroupRequest(action.chatGroupInviteReducerItem)
        break
      case CHAT_GROUP_INVITE_ACCEPTED_REQUEST_SUCCESS:
      case CHAT_GROUP_INVITE_DECLINED_REQUEST_SUCCESS:
        socket.sendChatGroupRequestResponse(action.newNotification)
        break
      default:
        break
    }

    return next(action)
  }
}

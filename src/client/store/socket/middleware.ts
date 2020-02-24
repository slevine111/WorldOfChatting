import MySocket from './Socket'
import {
  IThunkReturnObject,
  RequestDataSuccessConstants
} from '../APIRequestsHandling/types'
import { AnyAction } from 'redux'
import { NotificationActionReturns } from '../notification/actions'
import { UIAPICallingActionReturns } from '../APIRequestsHandling/types'
import { MyStoreType } from '../index'
const {
  AUTHENTICATING_USER_LOGIN_ATTEMPT_REQUEST_SUCCESS,
  CHECKING_IF_USER_LOGGED_IN_REQUEST_SUCCESS,
  USER_LOGGING_OUT_REQUEST_SUCCESS,
  INVITING_TO_CHAT_REQUEST_SUCCESS
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
      | IThunkReturnObject<any>
      | NotificationActionReturns
      | UIAPICallingActionReturns
  ) => {
    if (isThunkOject(action)) return next(action)

    switch (action.type) {
      case AUTHENTICATING_USER_LOGIN_ATTEMPT_REQUEST_SUCCESS:
      case CHECKING_IF_USER_LOGGED_IN_REQUEST_SUCCESS:
        socket.connect(action.user.id)
        break
      case USER_LOGGING_OUT_REQUEST_SUCCESS:
        socket.disconnect()
      case INVITING_TO_CHAT_REQUEST_SUCCESS:
        socket.sendInviteToChatGroupRequest(action.notificationReducerItem)
        break
      default:
        break
    }

    return next(action)
  }
}

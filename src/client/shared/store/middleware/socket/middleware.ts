import MySocket from './Socket'
import { AnyAction } from 'redux'
import { MyStoreType, IThunkReturnObject } from '../../store.types'
import {
  REQUEST_SUCCESS_ACTION_TYPES as APP_ACTION_TYPES,
  LoggedInUserFoundEnteringSiteAR,
} from '../../../../app/actions'
import {
  REQUEST_SUCCESS_ACTION_TYPES as NAVBAR_ACTION_TYPES,
  ChatGroupRequestAcceptedAR,
  ChatGroupRequestDeclinedAR,
  UserLoggedOutAR,
} from '../../../../Navbar/actions'
import {
  AUTHENTICATING_USER_LOGIN_REQUEST_SUCCESS,
  UserLoginSucceededAR,
} from '../../../../Login_Signup/Login/actions'
import {
  CHAT_GROUP_INVITE_REQUEST_SUCCESS,
  ChatGroupInviteSentAR,
} from '../../actions_thunks/chatgroupinvite'

const isThunkOject = (
  action: IThunkReturnObject<any> | AnyAction
): action is IThunkReturnObject<any> => {
  return (action as IThunkReturnObject<any>).requestDataActionType !== undefined
}

type ActionReturns =
  | UserLoggedOutAR
  | ChatGroupRequestAcceptedAR
  | ChatGroupRequestDeclinedAR
  | LoggedInUserFoundEnteringSiteAR
  | UserLoginSucceededAR
  | ChatGroupInviteSentAR

export default (store: MyStoreType) => {
  const socket: MySocket = new MySocket(store)

  return (next: any) => (action: ActionReturns) => {
    if (isThunkOject(action)) return next(action)

    switch (action.type) {
      case AUTHENTICATING_USER_LOGIN_REQUEST_SUCCESS:
      case APP_ACTION_TYPES.CHECKING_IF_USER_LOGGED_IN_REQUEST_SUCCESS:
        socket.connect(action.user.id)
        break
      case NAVBAR_ACTION_TYPES.USER_LOGGING_OUT_REQUEST_SUCCESS:
        socket.disconnect()
        break
      case CHAT_GROUP_INVITE_REQUEST_SUCCESS:
        socket.sendInviteToChatGroupRequest(action.chatGroupInviteReducerItem)
        break
      case NAVBAR_ACTION_TYPES.CHAT_GROUP_INVITE_ACCEPTED_REQUEST_SUCCESS:
      case NAVBAR_ACTION_TYPES.CHAT_GROUP_INVITE_DECLINED_REQUEST_SUCCESS:
        socket.sendChatGroupRequestResponse(action.newNotification)
        break
      default:
        break
    }

    return next(action)
  }
}

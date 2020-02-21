import MySocket from './Socket'
import {
  IThunkReturnObject,
  RequestDataSuccessConstants
} from '../APIRequestsHandling/types'
import { AnyAction } from 'redux'
const {
  AUTHENTICATING_USER_LOGIN_ATTEMPT_REQUEST_SUCCESS
} = RequestDataSuccessConstants

const isThunkOject = (
  action: IThunkReturnObject<any> | AnyAction
): action is IThunkReturnObject<any> => {
  return (action as IThunkReturnObject<any>).requestDataActionType !== undefined
}

export default () => {
  const socket: MySocket = new MySocket()

  return (next: any) => (action: IThunkReturnObject<any> | AnyAction) => {
    if (isThunkOject(action)) return next(action)

    switch (action.type) {
      case AUTHENTICATING_USER_LOGIN_ATTEMPT_REQUEST_SUCCESS:
        socket.connect()
      default:
        break
    }

    return next(action)
  }
}

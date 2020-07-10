import { AnyAction } from 'redux'
import { AxiosResponse } from 'axios'
import { User } from '../../../entities'

export {
  AuthReducerState,
  ChatGroupReducerState,
  ChatGroupInviteReducerState,
  LanguageReducerState,
  MessageReducerState,
  NotificationReducerState,
  UIReducerState,
  UserReducerState,
  UserChatGroupReducerState,
  UserLanguageReducerState,
} from './reducers'
export { ReduxState, MyStoreType } from './index'

export interface IAxiosErrorData {
  message: string
  statusCode: number
}

export interface INormalizedReducerShape<T> {
  byId: Record<string, T>
  allIds: string[]
  subGroupings: Record<string, string[]>
}

export interface IThunkReturnObject<T = any> {
  requestDataActionType: string
  apiCall: () => Promise<AxiosResponse | AxiosResponse[] | Record<string, any>>
  dataTransformationCall?: (apiResponseData: any) => T
  dispatchActionOnSuccess: (data: T) => AnyAction
  bypassRefreshTokenMiddleware?: boolean
}

export type MyReducerType<T, A extends AnyAction = AnyAction> = (
  state: INormalizedReducerShape<T>,
  action: A
) => INormalizedReducerShape<T>

export type SubGroupingFunctionType<T> = (
  currentNormalizedData: INormalizedReducerShape<T>,
  dataItem: T
) => INormalizedReducerShape<T>

export interface IUserAndExpireTime {
  user: User
  expireTime: number
}

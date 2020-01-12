import { User } from '../../entities'
import { IReduxStoreUserFields } from '../../shared-types'
import { IAxiosErrorData } from '../store/apiMiddleware'

export interface IUsersByChatGroup {
  name: string
  language: string
  users: IReduxStoreUserFields[]
}

export interface IObjectOfOneType<T> {
  [key: string]: T
}

export type IObjectOfUserArrays = IObjectOfOneType<IReduxStoreUserFields[]>

export interface IUsersInformation {
  usersGrouped: IObjectOfUserArrays
  usersMap: IObjectOfOneType<IReduxStoreUserFields>
}

export type IReduxStoreGenericErrorType = null | IAxiosErrorData

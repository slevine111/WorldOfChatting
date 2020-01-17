import { User } from '../../entities'
import { IReduxStoreUserFields } from '../../types-for-both-server-and-client'

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

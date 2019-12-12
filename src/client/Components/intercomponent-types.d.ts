import { User } from '../../entities'
import { IUserFieldsForStore } from '../../shared-types'

export interface IUsersByChatGroup {
  name: string
  language: string
  users: IUserFieldsForStore[]
}

export interface IObjectOfOneType<T> {
  [key: string]: T
}

export type IObjectOfUserArrays = IObjectOfOneType<IUserFieldsForStore[]>

export interface IUsersInformation {
  usersGrouped: IObjectOfUserArrays
  usersMap: IObjectOfOneType<IUserFieldsForStore>
}

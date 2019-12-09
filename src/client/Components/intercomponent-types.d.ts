import { User } from '../../entities'

export interface IUsersByChatGroup {
  name: string
  language: string
  users: User[]
}

export interface IObjectOfOneType<T> {
  [key: string]: T
}

export type IObjectOfUserArrays = IObjectOfOneType<User[]>

export interface IUsersInformation {
  usersGrouped: IObjectOfUserArrays
  usersMap: IObjectOfOneType<User>
}

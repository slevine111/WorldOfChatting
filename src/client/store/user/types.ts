import { User } from '../../../entities'

export const CREATE_NEW_USER: string = 'CREATE_NEW_USER'

export interface ICreateNewUserAction {
  type: typeof CREATE_NEW_USER
  newUser: User
}

export type UserActionTypes = ICreateNewUserAction

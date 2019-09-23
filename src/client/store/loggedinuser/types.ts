import { User } from '../../../entities'

export const SET_USER: string = 'SET_USER'

export interface ISetLoggedInUserAction {
  type: typeof SET_USER
  user: User
}

export type LoggedInUserActionTypes = ISetLoggedInUserAction

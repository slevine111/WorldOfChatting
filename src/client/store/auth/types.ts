import { User } from '../../../entities'
import { ILanguageWithActiveAndTypeFields } from '../../../shared-types'

export const ADD_POSTPONNED_ACTION = <const>'ADD_POSTPONNED_ACTION'
export const USER_LOGGING_IN_FOUND = <const>'USER_LOGGING_IN_FOUND'
export const ACCESS_TOKEN_REFRESHED = <const>'ACCESS_TOKEN_REFRESHED'

export enum PossibleStatuses {
  NONE = 'NONE',
  FETCHING = 'FETCHING',
  RECEIVED = 'RECEIVED'
}

export interface ILanguageExpanded extends ILanguageWithActiveAndTypeFields {
  usersOnlineCount: number
}

export interface IUserAndExpireTime {
  user: User
  expireTime: number
}

export interface IAuthReducerUserField extends User {
  languages: ILanguageExpanded[]
}

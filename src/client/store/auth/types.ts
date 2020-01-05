import { User } from '../../../entities'
import { ILanguageWithActiveAndTypeFields } from '../../../shared-types'
import { AnyAction } from 'redux'

export const SET_STATUS = <const>'SET_STATUS'
export const SET_ACCESS_TOKEN_FIELDS = <const>'SET_ACCESS_TOKEN_FIELDS'
export const SET_USER_AND_ACCESS_TOKEN_FIELDS = <const>(
  'SET_USER_AND_ACCESS_TOKEN_FIELDS'
)
export const ADD_POSTPONNED_ACTION = <const>'ADD_POSTPONNED_ACTION'

export enum PossibleStatuses {
  NONE = 'NONE',
  FETCHING = 'FETCHING',
  RECEIVED = 'RECEIVED'
}

export interface ILanguageExpanded extends ILanguageWithActiveAndTypeFields {
  usersOnlineCount: number
}

interface IAccessTokenFields {
  status: PossibleStatuses
  expireTime: number
}

export interface IUserAndExpireTime {
  user: User
  expireTime: number
}

export interface IAuthReducerUserField extends User {
  languages: ILanguageExpanded[]
}

export interface IAuthReducerState {
  user: IAuthReducerUserField
  accessTokenFields: IAccessTokenFields
  postponnedActions: AnyAction[]
}

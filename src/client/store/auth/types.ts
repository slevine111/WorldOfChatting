import { User } from '../../../entities'
import { AnyAction } from 'redux'

export const SET_TO_INITIAL_STATE = <const>'SET_TO_INITIAL_STATE'
export const SET_USER = <const>'SET USER'
export const SET_STATUS = <const>'SET_STATUS'
export const SET_ACCESS_TOKEN_FIELDS = <const>'SET_ACCESS_TOKEN_FIELDS'
export const SET_USER_AND_ACCESS_TOKEN_FIELDS = <const>(
  'SET_USER_AND_ACCESS_TOKEN_FIELDS'
)
export const ADD_POSTPONNED_ACTION = <const>'ADD_POSTPONNED_ACTION'

export type PossibleStatuses = 'NONE' | 'FETCHING' | 'RECEIVED'

interface IAccessTokenFields {
  status: PossibleStatuses
  expireTime: number
}

export interface IUserAndExpireTime {
  user: User
  expireTime: number
}

export interface IAuthReducerState {
  user: User
  accessTokenFields: IAccessTokenFields
  postponnedActions: AnyAction[]
}
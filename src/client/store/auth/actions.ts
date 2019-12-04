import * as types from './types'
import { AnyAction } from 'redux'

export const addPostponnedAction = (postponnedAction: AnyAction) => ({
  type: types.ADD_POSTPONNED_ACTION,
  postponnedAction
})
type AddPostponnedActionType = ReturnType<typeof addPostponnedAction>

export const setToInitialState = () => ({
  type: types.SET_TO_INITIAL_STATE
})
type SetToInitialStateActionType = ReturnType<typeof setToInitialState>

export const setAccessTokenStatus = (status: types.PossibleStatuses) => ({
  type: types.SET_STATUS,
  status
})
type SetAccessTokenStatusActionType = ReturnType<typeof setAccessTokenStatus>

export const setAccessTokenFields = (
  status: types.PossibleStatuses,
  expireTime: number
) => ({
  type: types.SET_ACCESS_TOKEN_FIELDS,
  accessTokenFields: { status, expireTime }
})
type SetAccessTokenFieldsActionType = ReturnType<typeof setAccessTokenFields>

export const setUserAndAccessTokenFields = (
  user: types.IAuthReducerUserField,
  status: types.PossibleStatuses,
  expireTime: number
) => ({
  type: types.SET_USER_AND_ACCESS_TOKEN_FIELDS,
  user,
  accessTokenFields: { status, expireTime }
})
export type SetUserAndAccessTokenFieldsActionType = ReturnType<
  typeof setUserAndAccessTokenFields
>

export type AuthActionTypes =
  | SetToInitialStateActionType
  | AddPostponnedActionType
  | SetAccessTokenStatusActionType
  | SetAccessTokenFieldsActionType
  | SetUserAndAccessTokenFieldsActionType

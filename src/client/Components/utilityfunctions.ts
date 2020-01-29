import { UserChatGroup } from '../../entities'
import { IReduxStoreUserFields } from '../../types-for-both-server-and-client'
import {
  IObjectOfUserArrays,
  IObjectOfOneType,
  IUsersInformation
} from './intercomponent-types'
import { IObjectWithIdProperty } from '../shared-client-types'
import { ReducerErrorProperty } from '../store/reducer.base'

export enum GeneralErrorTypes {
  NO_ERROR = 'NO_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  NON_AUTHENTICATION_ERROR = 'NON_AUTHENTICATION_ERROR'
}

export const mapValuesById = <T extends IObjectWithIdProperty>(
  values: T[]
): IObjectOfOneType<T> => {
  let valueMap: IObjectOfOneType<T> = {}
  for (let i = 0; i < values.length; ++i) {
    valueMap[values[i].id] = values[i]
  }
  return valueMap
}

export const groupUserChatGroups = (
  usersMap: IObjectOfOneType<IReduxStoreUserFields>,
  userChatGroups: UserChatGroup[]
): IUsersInformation => {
  let objectByChatGroup: IObjectOfUserArrays = {}
  for (let i = 0; i < userChatGroups.length; ++i) {
    const { userId, chatGroupId } = userChatGroups[i]
    if (
      usersMap[userId] !== undefined &&
      objectByChatGroup[chatGroupId] !== undefined
    ) {
      objectByChatGroup[chatGroupId].push(usersMap[userId])
    } else if (usersMap[userId] !== undefined) {
      objectByChatGroup[chatGroupId] = [usersMap[userId]]
    }
  }
  return { usersGrouped: objectByChatGroup, usersMap }
}

export const checkError = (error: ReducerErrorProperty): GeneralErrorTypes => {
  const {
    NO_ERROR,
    AUTHENTICATION_ERROR,
    NON_AUTHENTICATION_ERROR
  } = GeneralErrorTypes
  if (error === null) return NO_ERROR
  if (error.statusCode === 401) return AUTHENTICATION_ERROR
  return NON_AUTHENTICATION_ERROR
}

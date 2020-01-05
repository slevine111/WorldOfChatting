import { UserChatGroup } from '../../entities'
import { IReduxStoreUserFields } from '../../shared-types'
import {
  IObjectOfUserArrays,
  IObjectOfOneType,
  IUsersInformation
} from './intercomponent-types'

export interface IGroupedArraysAndObjects {
  arrays: any[][]
  objects: object[]
}

interface IObjectWithIdProperty {
  id: string
  [key: string]: any
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
  users: IReduxStoreUserFields[],
  userChatGroups: UserChatGroup[]
): IUsersInformation => {
  const usersMap: IObjectOfOneType<IReduxStoreUserFields> = mapValuesById(users)
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

export const checkIfDataExists = (input: IGroupedArraysAndObjects): boolean => {
  const { arrays, objects } = input
  for (let i = 0; i < arrays.length; ++i) {
    if (!arrays[i].length) return false
  }
  for (let i = 0; i < objects.length; ++i) {
    if (!objects[i]) return false
    if (!Object.keys(objects[i]).keys) return false
  }
  return true
}

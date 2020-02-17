import { IUserReducerState } from '../user/reducer'
import { IUserChatGroupReducerState } from '../userchatgroup/reducer'
import { IUserAndChatGroupGetReturn } from '../../../types-for-both-server-and-client'
import { CHAT_GROUP_KEY_PREFIX } from '../userchatgroup/reducer'

interface IUsersAndUserChatGroups {
  usersNormalizedAll: IUserReducerState
  userChatGroupNormalized: IUserChatGroupReducerState
}

export const separateUserAndChatGroupFields = (
  usersNormalized: IUserReducerState,
  usersWithChatGroups: IUserAndChatGroupGetReturn[]
): IUsersAndUserChatGroups => {
  let usersNormalizedAll: IUserReducerState = {
    ...usersNormalized
  }
  usersNormalizedAll.subGroupings.userIdsChattingWith = []
  let userChatGroupNormalized: IUserChatGroupReducerState = {
    byId: {},
    allIds: [],
    subGroupings: {}
  }
  let uniqueUserIdsChattingWith: Set<string> = new Set()
  for (let i = 0; i < usersWithChatGroups.length; ++i) {
    const {
      userTableId,
      firstName,
      lastName,
      fullName,
      email,
      loggedIn,
      loggedInAsString,
      ...userChatGroupFields
    } = usersWithChatGroups[i]
    const {
      userChatGroupId,
      chatGroupId,
      ...otherUserChatGroupFields
    } = userChatGroupFields
    userChatGroupNormalized.byId[userChatGroupId] = {
      id: userChatGroupId,
      chatGroupId,
      ...otherUserChatGroupFields
    }
    userChatGroupNormalized.allIds.push(userChatGroupId)
    const subGroupKey: string = `${CHAT_GROUP_KEY_PREFIX}${chatGroupId}`
    if (userChatGroupNormalized.subGroupings[subGroupKey] !== undefined) {
      userChatGroupNormalized.subGroupings[subGroupKey].push(userChatGroupId)
    } else {
      userChatGroupNormalized.subGroupings[subGroupKey] = [userChatGroupId]
    }

    if (usersNormalizedAll.byId[userTableId] === undefined) {
      usersNormalizedAll.byId[userTableId] = {
        id: userTableId,
        firstName,
        lastName,
        fullName,
        email,
        loggedIn,
        loggedInAsString
      }
      usersNormalizedAll.allIds.push(userTableId)
    }
    if (!uniqueUserIdsChattingWith.has(userTableId)) {
      usersNormalizedAll.subGroupings.userIdsChattingWith.push(userTableId)
      uniqueUserIdsChattingWith.add(userTableId)
    }
  }
  return { usersNormalizedAll, userChatGroupNormalized }
}

import { IUserNormalizedShape } from '../user/reducer'
import { IUserChatGroupNormalizedShape } from '../userchatgroup/reducer'
import { IUserAndChatGroupGetReturn } from '../../../types-for-both-server-and-client'
import { CHAT_GROUP_KEY_PREFIX } from '../constants'

interface IUsersAndUserChatGroups {
  usersNormalizedAll: IUserNormalizedShape
  userChatGroupNormalized: IUserChatGroupNormalizedShape
}

export const separateUserAndChatGroupFields = (
  usersNormalized: IUserNormalizedShape,
  usersWithChatGroups: IUserAndChatGroupGetReturn[],
  userIdToFilterOn: string
): IUsersAndUserChatGroups => {
  let usersNormalizedAll: IUserNormalizedShape = {
    ...usersNormalized
  }
  usersNormalizedAll.subGroupings.userIdsChattingWith = []
  let userChatGroupNormalized: IUserChatGroupNormalizedShape = {
    byId: {},
    allIds: [],
    subGroupings: {}
  }
  let count: number = 0
  for (let i = 0; i < usersWithChatGroups.length; ++i) {
    if (usersWithChatGroups[i].userId !== userIdToFilterOn) {
      ++count
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
      usersNormalizedAll.subGroupings.userIdsChattingWith.push(userTableId)
    }
  }
  console.log(count, usersWithChatGroups.length)
  return { usersNormalizedAll, userChatGroupNormalized }
}

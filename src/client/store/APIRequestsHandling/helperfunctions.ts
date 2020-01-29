import { UserChatGroup } from '../../../entities'
import { INormalizedReducerShape } from '../reducer.base'
import {
  IUserAndChatGroupGetReturn,
  IReduxStoreUserFields
} from '../../../types-for-both-server-and-client'

interface IUsersAndUserChatGroups {
  usersNormalizedAll: INormalizedReducerShape<IReduxStoreUserFields>
  userChatGroups: UserChatGroup[]
}

export const separateUserAndChatGroupFields = (
  usersNormalized: INormalizedReducerShape<IReduxStoreUserFields>,
  usersWithChatGroups: IUserAndChatGroupGetReturn[],
  userIdToFilterOn: string
): IUsersAndUserChatGroups => {
  let usersNormalizedAll: INormalizedReducerShape<IReduxStoreUserFields> = {
    ...usersNormalized
  }
  usersNormalizedAll.subGroupings.userIdsChattingWith = []
  let userChatGroups: UserChatGroup[] = []
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
      const { userChatGroupId, ...otherUserTableFields } = userChatGroupFields
      userChatGroups.push({
        id: userChatGroupId,
        ...otherUserTableFields
      })

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
  return { usersNormalizedAll, userChatGroups }
}

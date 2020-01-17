import { UserChatGroup } from '../../../entities'
import {
  IUserAndChatGroupGetReturn,
  IReduxStoreUserFields
} from '../../../types-for-both-server-and-client'

interface IUsersAndUserChatGroups {
  users: IReduxStoreUserFields[]
  userChatGroups: UserChatGroup[]
}

export const separateUserAndChatGroupFields = (
  usersWithChatGroups: IUserAndChatGroupGetReturn[],
  userIdToFilterOn: string
): IUsersAndUserChatGroups => {
  let uniqueUserIds: Set<string> = new Set()
  let users: IReduxStoreUserFields[] = []
  let userChatGroups: UserChatGroup[] = []
  for (let i = 0; i < usersWithChatGroups.length; ++i) {
    if (usersWithChatGroups[i].userId !== userIdToFilterOn) {
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

      if (!uniqueUserIds.has(userTableId)) {
        users.push({
          id: userTableId,
          firstName,
          lastName,
          fullName,
          email,
          loggedIn,
          loggedInAsString
        })
        uniqueUserIds.add(userTableId)
      }
    }
  }
  return { users, userChatGroups }
}

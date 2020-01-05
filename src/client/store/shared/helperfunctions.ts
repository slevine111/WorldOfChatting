import { User, UserChatGroup } from '../../../entities'
import {
  IUserCountByLanguage,
  ILanguageWithActiveAndTypeFields,
  IUserAndChatGroupGetReturn,
  IReduxStoreUserFields
} from '../../../shared-types'
import { IAuthReducerUserField } from '../auth/types'

interface IUserCountByLanguageMap {
  [key: string]: number | undefined
}

interface IUsersAndUserChatGroups {
  users: IReduxStoreUserFields[]
  userChatGroups: UserChatGroup[]
}

export const generateAuthReducerUserField = (
  user: User,
  languages: ILanguageWithActiveAndTypeFields[],
  userCountByLanguage: IUserCountByLanguage[]
): IAuthReducerUserField => {
  let userWithLanguagesArray: IAuthReducerUserField = { ...user, languages: [] }
  let userCountByLanguageMap: IUserCountByLanguageMap = {}
  for (let i = 0; i < userCountByLanguage.length; ++i) {
    let { language, usersOnlineCount } = userCountByLanguage[i]
    userCountByLanguageMap[language] = usersOnlineCount
  }
  for (let i = 0; i < languages.length; ++i) {
    const { language } = languages[i]
    const usersOnlineCount: number = userCountByLanguageMap[language] || 0
    userWithLanguagesArray.languages.push({ ...languages[i], usersOnlineCount })
  }
  return userWithLanguagesArray
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

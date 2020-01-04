import { User, UserChatGroup } from '../../entities'
import {
  IUserCountByLanguage,
  ILanguageWithActiveAndTypeFields,
  IChatGroupReducer,
  IUserAndChatGroupGetReturn,
  IUserFieldsForStore
} from '../../shared-types'
import { setMyUsers /*setMyAndCurrentLanguageUsers*/ } from './user/actions'
import { setChatGroups } from './chatgroup/actions'
import { setUserChatGroups } from './userchatgroup/actions'
//import { setUserLanguages } from './userlanguage/actions'
import { IUserAndExpireTime, IAuthReducerUserField } from './auth/types'
import {
  setUserAndAccessTokenFields //,
  //setAuthReducerToInitialState
} from './auth/actions'
import { IUserPostDTO, IUserUpdateDTO } from '../../server/users/users.dto'
import {
  IUserLanguagePostDTO,
  IUserLanguagePostDTOSubset
} from '../../server/userlanguages/userlanguages.dto'
import axios, { AxiosResponse } from 'axios'

interface IUserCountByLanguageMap {
  [key: string]: number | undefined
}

interface IUsersAndUserChatGroups {
  users: IUserFieldsForStore[]
  userChatGroups: UserChatGroup[]
}

export const signupNewUserProcess = (
  newUser: IUserPostDTO,
  newUserLanguages: IUserLanguagePostDTOSubset[]
) => {
  return async () => {
    const userResponse: AxiosResponse<User> = await axios.post(
      '/api/user',
      newUser
    )
    const newULsForDB: IUserLanguagePostDTO[] = newUserLanguages.map(ul => ({
      ...ul,
      userId: userResponse.data.id
    }))
    await axios.post('/api/userlanguage', newULsForDB)
  }
}

export const LOGOUT_USER_PROCESS = <const>'LOGOUT_USER_PROCESS'

const logoutUserProcess = () => ({
  type: LOGOUT_USER_PROCESS
})
export type LogoutUserProcessType = ReturnType<typeof logoutUserProcess>

export const logoutUserProcessThunk = (
  userId: string,
  partialUpdatedUser: IUserUpdateDTO
) => {
  const innerFunction = async (dispatch: any): Promise<void> => {
    await axios.put(`/api/user/${userId}`, partialUpdatedUser)
    await axios.delete('/api/auth')
    dispatch(logoutUserProcess())
  }
  innerFunction.bypassRefreshTokenMiddleware = true

  return innerFunction
}

export const getAndSetSingleUserRelatedData = async (
  userAndExpireTime: IUserAndExpireTime,
  dispatch: any
): Promise<void> => {
  const { expireTime, user } = userAndExpireTime
  const [languages, chatGroups, userCountByLanguage, usersWithChatGroups]: [
    AxiosResponse<ILanguageWithActiveAndTypeFields[]>,
    AxiosResponse<IChatGroupReducer>,
    AxiosResponse<IUserCountByLanguage[]>,
    AxiosResponse<IUserAndChatGroupGetReturn[]>
  ] = await Promise.all([
    axios.get(`/api/language/${user.id}`),
    axios.get(`/api/chatgroup/${user.id}`),
    axios.get(`/api/userlanguage/linked/${user.id}/countbylanguage`),
    axios.get(`/api/user/linked/${user.id}/withchatgroup`)
  ])
  const { users, userChatGroups } = separateUserAndChatGroupFields(
    usersWithChatGroups.data,
    user.id
  )
  let userWithLanguagesArray: IAuthReducerUserField = generateAuthReducerUserField(
    user,
    languages.data,
    userCountByLanguage.data
  )
  dispatch(
    setUserAndAccessTokenFields(userWithLanguagesArray, 'RECEIVED', expireTime)
  )
  dispatch(setChatGroups(chatGroups.data))
  dispatch(setMyUsers(users))
  dispatch(setUserChatGroups(userChatGroups))
}

const generateAuthReducerUserField = (
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

const separateUserAndChatGroupFields = (
  usersWithChatGroups: IUserAndChatGroupGetReturn[],
  userIdToFilterOn: string
): IUsersAndUserChatGroups => {
  let uniqueUserIds: Set<string> = new Set()
  let users: IUserFieldsForStore[] = []
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

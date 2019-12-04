import { User, ChatGroup, UserChatGroup } from '../../entities'
import {
  IUserCountByLanguage,
  ILanguageWithActiveAndTypeFields
} from '../../shared-types'
import { setUsers } from './user/actions'
import { setChatGroups } from './chatgroup/actions'
import { setUserLanguages } from './userlanguage/actions'
import { setUserChatGroups } from './userchatgroup/actions'
import { IUserAndExpireTime, IAuthReducerUserField } from './auth/types'
import { setUserAndAccessTokenFields, setToInitialState } from './auth/actions'
import { IUserPostDTO, IUserUpdateDTO } from '../../server/users/users.dto'
import {
  IUserLanguagePostDTO,
  IUserLanguagePostDTOSubset
} from '../../server/userlanguages/userlanguages.dto'
import axios, { AxiosResponse } from 'axios'

interface IPlainObject {
  [key: string]: true
}

interface IUserCountByLanguageMap {
  [key: string]: number | undefined
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

export const logoutUserProcess = (
  userId: string,
  partialUpdatedUser: IUserUpdateDTO
) => {
  const innerFunction = async (dispatch: any) => {
    await axios.put(`/api/user/${userId}`, partialUpdatedUser)
    dispatch(setChatGroups([]))
    dispatch(setUserLanguages([]))
    dispatch(setUsers([]))
    dispatch(setUserChatGroups([]))
    return axios.delete('/api/auth').then((): void => {
      dispatch(setToInitialState())
    })
  }
  innerFunction.bypassRefreshTokenMiddleware = true

  return innerFunction
}

export const getAndSetSingleUserRelatedData = async (
  userAndExpireTime: IUserAndExpireTime,
  dispatch: any
): Promise<void> => {
  const { expireTime, user } = userAndExpireTime
  const [languages, chatGroups, userCountByLanguage, userChatGroups]: [
    AxiosResponse<ILanguageWithActiveAndTypeFields[]>,
    AxiosResponse<ChatGroup[]>,
    AxiosResponse<IUserCountByLanguage[]>,
    AxiosResponse<UserChatGroup[]>
  ] = await Promise.all([
    axios.get(`/api/language/${user.id}`),
    axios.get(`/api/chatgroup/${user.id}`),
    axios.get(`/api/userlanguage/linked/${user.id}/countbylanguage`),
    axios.get(`/api/userchatgroup/linked/${user.id}`)
  ])
  const uniqueUserIds: string[] = getUniqueUserIds(userChatGroups.data)
  const usersResponse: AxiosResponse<User[]> = await axios.get(
    `/api/user/specified/${uniqueUserIds.join(',')}`
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
  dispatch(setUsers(usersResponse.data))
  dispatch(setUserChatGroups(userChatGroups.data))
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

const getUniqueUserIds = (users: UserChatGroup[]): string[] => {
  const uniqueUserIds: IPlainObject = {}
  for (let i = 0; i < users.length; ++i) {
    const { userId } = users[i]
    if (!uniqueUserIds[userId]) uniqueUserIds[userId] = true
  }
  return Object.keys(uniqueUserIds)
}

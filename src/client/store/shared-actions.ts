import { User, UserLanguage, ChatGroup, UserChatGroup } from '../../entities'
import { setUsers } from './user/actions'
import { setChatGroups } from './chatgroup/actions'
import { setUserLanguages } from './userlanguage/actions'
import { setUserChatGroups } from './userchatgroup/actions'
import { IUserAndExpireTime } from './auth/types'
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
  const [chatGroupResponse, userLanguageResponse, userChatGroupResponse]: [
    AxiosResponse<ChatGroup[]>,
    AxiosResponse<UserLanguage[]>,
    AxiosResponse<UserChatGroup[]>
  ] = await Promise.all([
    axios.get(`/api/chatgroup/${user.id}`),
    axios.get(`/api/userlanguage/linked/${user.id}`),
    axios.get(`/api/userchatgroup/linked/${user.id}`)
  ])
  const userLanguages: UserLanguage[] = userLanguageResponse.data
  const uniqueUserIds: string[] = getUniqueUserIds(userLanguages)
  const usersResponse: AxiosResponse<User[]> = await axios.get(
    '/api/user/loggedin',
    { params: { userIds: uniqueUserIds.join(',') } }
  )
  dispatch(setUserAndAccessTokenFields(user, 'RECEIVED', expireTime))
  dispatch(setChatGroups(chatGroupResponse.data))
  dispatch(setUserLanguages(userLanguages))
  dispatch(setUsers(usersResponse.data))
  dispatch(setUserChatGroups(userChatGroupResponse.data))
}

const getUniqueUserIds = (userLanguages: UserLanguage[]): string[] => {
  const uniqueUserIds: IPlainObject = {}
  for (let i = 0; i < userLanguages.length; ++i) {
    const { userId } = userLanguages[i]
    if (!uniqueUserIds[userId]) uniqueUserIds[userId] = true
  }
  return Object.keys(uniqueUserIds)
}

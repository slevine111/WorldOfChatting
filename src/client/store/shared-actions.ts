import { User, UserLanguage, ChatGroup } from '../../entities'
import { setUsers, createNewUser } from './user/actions'
import { setChatGroups } from './chatgroup/actions'
import { setUserLanguages } from './userlanguage/actions'
import { IUserAndExpireTime } from './auth/types'
import { setUserAndAccessTokenFields } from './auth/actions'
import { IUserPostDTO } from '../../server/users/users.dto'
import { createNewUserLanguages } from './userlanguage/actions'
import {
  IUserLanguagePostDTO,
  IUserLanguagePostDTOSubset
} from '../../server/userlanguages/userlanguages.dto'
import { IUserSignInDTO } from '../../server/auth/auth.dto'
import axios, { AxiosResponse } from 'axios'

interface IPlainObject {
  [key: string]: true
}

export const signupNewUserProcess = (
  newUser: IUserPostDTO,
  newUserLanguages: IUserLanguagePostDTOSubset[]
) => {
  return async (dispatch: any) => {
    const userResponse: AxiosResponse<User> = await axios.post(
      '/api/user',
      newUser
    )
    const newULsForDB: IUserLanguagePostDTO[] = newUserLanguages.map(ul => ({
      ...ul,
      user: userResponse.data
    }))
    const userLanguageResponse: AxiosResponse<
      UserLanguage[]
    > = await axios.post('/api/userlanguage', newULsForDB)

    dispatch(createNewUser(userResponse.data))
    dispatch(createNewUserLanguages(userLanguageResponse.data))
  }
}

export const loginUserProcess = (userEmailAndPassword: IUserSignInDTO) => {
  return async (dispatch: any) => {
    const loginResponse: AxiosResponse<IUserAndExpireTime> = await axios.post(
      '/api/auth/login',
      userEmailAndPassword
    )
    const { expireTime, user } = loginResponse.data
    const [chatGroupResponse, userLanguageResponse]: [
      AxiosResponse<ChatGroup[]>,
      AxiosResponse<UserLanguage[]>
    ] = await Promise.all([
      axios.get(`/api/chatgroup/${user.id}`),
      axios.get(`/api/userlanguage/linked/${user.id}`)
    ])
    const userLanguages: UserLanguage[] = userLanguageResponse.data
    const uniqueUserIds: IPlainObject = {}
    for (let i = 0; i < userLanguages.length; ++i) {
      const { userId } = userLanguages[i]
      if (!uniqueUserIds[userId]) uniqueUserIds[userId] = true
    }
    const usersResponse: AxiosResponse<User[]> = await axios.get(
      '/api/user/loggedin',
      { params: { userIds: Object.keys(uniqueUserIds).join(',') } }
    )
    dispatch(setUserAndAccessTokenFields(user, 'RECEIVED', expireTime))
    dispatch(setChatGroups(chatGroupResponse.data))
    dispatch(setUserLanguages(userLanguageResponse.data))
    dispatch(setUsers(usersResponse.data))
  }
}

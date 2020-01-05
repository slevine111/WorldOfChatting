import {
  logoutUserProcess,
  userLoggedIn,
  wentToLanguagePageView
} from './actions'
import {
  generateAuthReducerUserField,
  separateUserAndChatGroupFields
} from './helperfunctions'
import { IUserAndExpireTime, IAuthReducerUserField } from '../auth/types'
import { IUserUpdateDTO } from '../../../server/users/users.dto'
import {
  IUserCountByLanguage,
  ILanguageWithActiveAndTypeFields,
  IChatGroupReducer,
  IUserAndChatGroupGetReturn,
  IReduxStoreUserFields
} from '../../../shared-types'
import { UserLanguage } from '../../../entities'
import axios, { AxiosResponse } from 'axios'

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

export const userLoggedInThunk = (userAndExpireTime: IUserAndExpireTime) => {
  return async (dispatch: any): Promise<void> => {
    const { user } = userAndExpireTime
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
      userLoggedIn(
        userWithLanguagesArray,
        chatGroups.data,
        users,
        userChatGroups
      )
    )
  }
}

export const languagePageDataRetrivalThunk = (language: string) => {
  return async (dispatch: any) => {
    const [userLanguages, users]: [
      AxiosResponse<UserLanguage[]>,
      AxiosResponse<IReduxStoreUserFields[]>
    ] = await Promise.all([
      axios.get(`/api/userlanguage/language/${language}`),
      axios.get(`/api/user/linked/language/${language}`)
    ])
    dispatch(wentToLanguagePageView(userLanguages.data, users.data))
  }
}

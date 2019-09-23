import { User, UserLanguage } from '../../entities'
import { createNewUser } from './user/actions'
import { ICreateNewUserAction } from './user/types'
import { IUserPostDTO } from '../../server/users/users.dto'
import { createNewUserLanguages } from './userlanguage/actions'
import { ICreateNewUserLanguagesAction } from './userlanguage/types'
import {
  IUserLanguagePostDTO,
  IUserLanguagePostDTOSubset
} from '../../server/userlanguages/userlanguages.dto'
import axios, { AxiosResponse } from 'axios'
import { ThunkAction } from 'redux-thunk'

export type signupNewUserEntites = User | UserLanguage[]
export type signupNewUserDTOs = IUserPostDTO | IUserLanguagePostDTO[]
export type signupNewUserPureActions =
  | ICreateNewUserAction
  | ICreateNewUserLanguagesAction

type signupNewUserProcessThunkAction = ThunkAction<
  Promise<void>,
  signupNewUserEntites,
  signupNewUserDTOs,
  signupNewUserPureActions
>

export const signupNewUserProcess = (
  newUser: IUserPostDTO,
  newUserLanguages: IUserLanguagePostDTOSubset[]
): signupNewUserProcessThunkAction => {
  return async dispatch => {
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

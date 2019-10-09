import { User, UserLanguage } from '../../entities'
import { createNewUser } from './user/actions'
import { IUserPostDTO } from '../../server/users/users.dto'
import { createNewUserLanguages } from './userlanguage/actions'
import {
  IUserLanguagePostDTO,
  IUserLanguagePostDTOSubset
} from '../../server/userlanguages/userlanguages.dto'
import axios, { AxiosResponse } from 'axios'

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

import { User } from '../../../entities'
import { IUserPostDTO } from '../../../server/users/users.dto'
import {
  IUserLanguagePostDTO,
  IUserLanguagePostDTOSubset
} from '../../../server/userlanguages/userlanguages.dto'
import axios, { AxiosResponse } from 'axios'

export const signupNewUserProcess = async (
  newUser: IUserPostDTO,
  newUserLanguages: IUserLanguagePostDTOSubset[]
): Promise<void> => {
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

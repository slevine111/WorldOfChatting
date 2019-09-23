import { User } from '../../../entities'
import { ICreateNewUserAction, CREATE_NEW_USER } from './types'

export const createNewUser = (newUser: User): ICreateNewUserAction => ({
  type: CREATE_NEW_USER,
  newUser
})

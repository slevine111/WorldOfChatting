import { User } from '../../../entities'
import { SET_USER, ISetLoggedInUserAction } from './types'

const setLoggedInUser = (user: User): ISetLoggedInUserAction => ({
  type: SET_USER,
  user
})

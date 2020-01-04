import { logoutUserProcess } from './actions'
import { IUserUpdateDTO } from '../../../server/users/users.dto'
import axios from 'axios'

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

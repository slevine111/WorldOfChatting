import { LOGOUT_USER_PROCESS } from './types'

export const logoutUserProcess = () => ({
  type: LOGOUT_USER_PROCESS
})
export type LogoutUserProcessType = ReturnType<typeof logoutUserProcess>

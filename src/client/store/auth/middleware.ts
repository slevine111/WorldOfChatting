import { MyStoreType } from '../index'
import { addPostponnedAction } from './actions'
import { refreshToken } from './thunks'
import { PossibleStatuses } from './types'

const refreshTokenMiddleware = (store: MyStoreType) => {
  return (next: any) => (action: any) => {
    const { NONE, RECEIVED, FETCHING } = PossibleStatuses
    const { status, expireTime } = store.getState().auth.accessTokenFields
    const actionBypassMiddlewareProperty: boolean =
      action.bypassRefreshTokenMiddleware === true
    const actionIsNotFunction: boolean = typeof action !== 'function'
    const statusEqualsNONE: boolean = status === NONE
    const tokenExpiresInAwhile: boolean =
      status === RECEIVED && expireTime * 1000 > Date.now() + 50 * 1000
    if (
      actionBypassMiddlewareProperty ||
      actionIsNotFunction ||
      statusEqualsNONE ||
      tokenExpiresInAwhile
    ) {
      return next(action)
    }

    next(addPostponnedAction(action))

    if (status !== FETCHING) {
      next(refreshToken()).then(() => {
        Promise.all(
          store.getState().auth.postponnedActions.map(action => next(action))
        )
      })
    }
  }
}

export default refreshTokenMiddleware

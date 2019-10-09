import { MyStoreType } from '../index'
import { addPostponnedAction } from './actions'
import { refreshToken } from './thunks'

const refreshTokenMiddleware = (store: MyStoreType) => {
  return (next: any) => (action: any) => {
    const { status, expireTime } = store.getState().auth.accessTokenFields
    console.log(action)
    console.dir(action)
    const actionBypassMiddlewareProperty: boolean =
      action.bypassRefreshTokenMiddleware === true
    const actionIsNotFunction: boolean = typeof action !== 'function'
    const statusEqualsNONE: boolean = status === 'NONE'
    const tokenExpiresInAwhile: boolean =
      status === 'RECEIVED' && expireTime * 1000 > Date.now() + 50 * 1000
    console.log(
      `actionBypassMiddlewareProperty:${actionBypassMiddlewareProperty}`
    )
    console.log(`actionIsNotFunction:${actionIsNotFunction}`)
    console.log(`statusEqualsNONE:${statusEqualsNONE}`)
    console.log(`tokenExpiresInAwhile:${tokenExpiresInAwhile}`)
    if (
      actionBypassMiddlewareProperty ||
      actionIsNotFunction ||
      statusEqualsNONE ||
      tokenExpiresInAwhile
    ) {
      //console.log('ACTION NOT FUNCTION')
      return next(action)
    }
    /*if (status === 'NONE') {
      console.log('NO STATUS')
      return next(action)
    }
    if (status !== 'FETCHING' && expireTime * 1000 < Date.now() + 50 * 1000) {
      console.log('TOKEN EXPIRE TIME FAR OFF')
      return next(action)
    }*/

    console.log('TO POSTPONNING ACTION')
    next(addPostponnedAction(action))

    if (status !== 'FETCHING') {
      console.log('REFRESHING')
      next(refreshToken()).then(() => {
        Promise.all(
          store.getState().auth.postponnedActions.map(action => next(action))
        )
      })
    }
  }
}

export default refreshTokenMiddleware

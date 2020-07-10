import thunk from 'redux-thunk'
import logger from 'redux-logger'
import { refreshTokenMiddleware, callAPIMiddleware } from './api/apiMiddleware'
import socketMiddleware from './socket/middleware'

export const getMiddlewareArray = (
  environmentMode: string | undefined
): any[] => {
  return [
    refreshTokenMiddleware,
    callAPIMiddleware,
    thunk,
    socketMiddleware,
    ...(environmentMode === 'development' ? [logger] : []),
  ]
}

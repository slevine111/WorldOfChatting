import { AnyAction } from 'redux'
import { AxiosResponse } from 'axios'
import { RequestDataConstants, ActionRequestData } from './shared/types'
import { MyStoreType } from './index'
import { addPostponnedAction } from './auth/actions'
import { refreshToken } from './auth/thunks'

export interface IThunkReturnObjectSubset<T = any> {
  requestDataActionType: RequestDataConstants
  dataTransformationCall?: (apiResponseData: any) => T
  dispatchAction: (
    data: T,
    isLoading: boolean,
    otherInputs: { [key: string]: any }
  ) => AnyAction
  dispatchProps: { [key: string]: any }
}

export interface IThunkReturnObject<T = any>
  extends IThunkReturnObjectSubset<T> {
  apiCall: () => Promise<AxiosResponse[] | AxiosResponse>
  bypassRefreshTokenMiddleware?: boolean
}

const isThunkOject = (action: unknown): action is IThunkReturnObject<any> => {
  return (action as IThunkReturnObject<any>).requestDataActionType !== undefined
}

const responseIsArray = (
  apiResponse: AxiosResponse[] | AxiosResponse
): apiResponse is AxiosResponse[] => {
  return Array.isArray(apiResponse)
}

export const refreshTokenMiddleware = (store: MyStoreType) => {
  return (next: any) => (action: unknown) => {
    if (!isThunkOject(action)) return next(action)

    const { bypassRefreshTokenMiddleware, requestDataActionType } = action

    const requestDataAction: ActionRequestData = {
      type: requestDataActionType,
      isLoading: true
    }
    next(requestDataAction)

    if (bypassRefreshTokenMiddleware === true) return next(action)

    const { isLoading, expireTime } = store.getState().auth.accessTokenFields
    if (!isLoading && expireTime * 1000 > Date.now() + 50 * 1000)
      return next(action)

    next(addPostponnedAction(action))

    if (!isLoading) {
      next(refreshToken()).then(() => {
        Promise.all(
          store.getState().auth.postponnedActions.map(action => next(action))
        )
      })
    }
  }
}

export const callAPIMiddleware = () => {
  return (next: any) => async (action: unknown) => {
    if (!isThunkOject(action)) return next(action)

    const {
      apiCall,
      dispatchAction,
      dispatchProps,
      dataTransformationCall
    } = action

    const apiResponse = await apiCall()
    let data: any
    if (responseIsArray(apiResponse)) {
      data = apiResponse.map(response => response.data)
    } else {
      data = apiResponse.data
    }
    if (dataTransformationCall) data = dataTransformationCall(data)
    next(dispatchAction(data, false, dispatchProps))
  }
}

import { AnyAction } from 'redux'
import { AxiosResponse, AxiosError } from 'axios'
import {
  RequestDataConstants,
  ActionRequestData,
  OnApiFailureActionTypes,
  ActionOnApiFailure
} from './shared/types'
import { MyStoreType } from './index'
import { addPostponnedAction } from './auth/actions'
import { refreshToken } from './auth/thunks'
const {
  REFRESHING_ACCESS_TOKEN_REQUEST,
  AUTHENTICATING_USER_REQUEST,
  CHECKING_IF_USER_LOGGED_IN_REQUEST
} = RequestDataConstants

export interface IAxiosErrorData {
  message: string
  statusCode: number
}

export interface IThunkReturnObjectSubset<T = any> {
  requestDataActionType: RequestDataConstants
  dataTransformationCall?: (apiResponseData: any) => T
  dispatchActionOnSuccess: (
    data: T,
    isLoading: boolean,
    error: null,
    otherInputs: { [key: string]: any }
  ) => AnyAction
  apiFailureActionType: OnApiFailureActionTypes
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

    const { isLoading, tokenExpireTime } = store.getState().auth.accessToken
    if (!isLoading && tokenExpireTime * 1000 > Date.now() + 50 * 1000) {
      return next(action)
    }

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
  return (next: any) => async (action: unknown): Promise<void> => {
    if (!isThunkOject(action)) return next(action)

    const {
      requestDataActionType,
      apiCall,
      dispatchActionOnSuccess,
      apiFailureActionType,
      dispatchProps,
      dataTransformationCall
    } = action

    if (requestDataActionType === REFRESHING_ACCESS_TOKEN_REQUEST) {
      next({
        type: requestDataActionType,
        isLoading: true
      })
    }

    try {
      const apiResponse = await apiCall()
      let data: any
      if (responseIsArray(apiResponse)) {
        data = apiResponse.map(response => response.data)
      } else {
        data = apiResponse.data
      }
      if (dataTransformationCall) data = dataTransformationCall(data)
      next(dispatchActionOnSuccess(data, false, null, dispatchProps))
    } catch (error) {
      const errorTyped = error as AxiosError<IAxiosErrorData>
      let errorData: IAxiosErrorData
      if (errorTyped.response === undefined) {
        errorData = {
          message: 'unknown internal server error',
          statusCode: 500
        }
      } else {
        errorData = errorTyped.response.data
      }
      const dispatchFailureActionObject: ActionOnApiFailure = {
        type: apiFailureActionType,
        isLoading: false,
        error: errorData
      }
      next(dispatchFailureActionObject)
      if (
        [
          CHECKING_IF_USER_LOGGED_IN_REQUEST,
          AUTHENTICATING_USER_REQUEST
        ].includes(requestDataActionType)
      )
        throw error
    }
  }
}

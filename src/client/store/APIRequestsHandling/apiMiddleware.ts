import { AxiosResponse, AxiosError } from 'axios'
import {
  RequestDataConstants,
  IThunkReturnObject,
  IAxiosErrorData,
  ActionOnTriggerDataRequest,
  ActionOnDataRequestFailure,
  TRIGGER_DATA_REQUEST,
  DATA_REQUEST_FAILURE
} from './types'
import { MyStoreType } from '../index'
import { addPostponnedAction } from '../auth/actions'
import { refreshToken } from '../auth/thunks'
const {
  REFRESHING_ACCESS_TOKEN_REQUEST,
  CHECKING_IF_USER_LOGGED_IN_REQUEST
} = RequestDataConstants

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

    const requestDataAction: ActionOnTriggerDataRequest = {
      type: TRIGGER_DATA_REQUEST,
      eventTriggeringDataRequest: requestDataActionType
    }
    next(requestDataAction)

    if (bypassRefreshTokenMiddleware === true) return next(action)

    const {
      auth: { accessTokenExpireTime },
      ui: { apiCalling }
    } = store.getState()
    const { accessTokenBeingRefreshed } = apiCalling
    if (
      !accessTokenBeingRefreshed &&
      accessTokenExpireTime * 1000 > Date.now() + 50 * 1000
    ) {
      return next(action)
    }

    next(addPostponnedAction(action))

    if (!accessTokenBeingRefreshed) {
      next(refreshToken()).then(() => {
        Promise.all(
          store.getState().auth.postponnedActions.map(action => next(action))
        )
      })
    }
  }
}

export const callAPIMiddleware = (store: MyStoreType) => {
  return (next: any) => async (action: unknown): Promise<void> => {
    if (!isThunkOject(action)) return next(action)

    const {
      requestDataActionType,
      apiCall,
      dispatchActionOnSuccess,
      dispatchProps,
      dataTransformationCall
    } = action

    if (requestDataActionType === REFRESHING_ACCESS_TOKEN_REQUEST) {
      next({
        type: requestDataActionType
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
      next(dispatchActionOnSuccess(data, dispatchProps))
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
      const {
        accessTokenBeingRefreshed,
        event
      } = store.getState().ui.apiCalling
      const dispatchFailureActionObject: ActionOnDataRequestFailure = {
        type: DATA_REQUEST_FAILURE,
        error: errorData,
        event: accessTokenBeingRefreshed ? requestDataActionType : event
      }
      next(dispatchFailureActionObject)
      if (requestDataActionType === CHECKING_IF_USER_LOGGED_IN_REQUEST) {
        throw error
      }
    }
  }
}

//IN Login.tsx and in

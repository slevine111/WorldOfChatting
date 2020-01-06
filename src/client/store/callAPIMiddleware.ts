import { requestDataAPI } from './shared/actions'
import { AnyAction } from 'redux'

export interface IThunkReturnObject<T extends any[] = any[]> {
  isAPICall: true
  apiCall: () => Promise<T>
  dispatchAction: (
    data: T,
    isLoading: boolean,
    otherInputs: { [key: string]: any }
  ) => AnyAction
  dispatchProps: { [key: string]: any }
}

const isThunkOject = (action: unknown): action is IThunkReturnObject => {
  return (action as IThunkReturnObject).isAPICall !== undefined
}

const callAPIMiddleware = () => {
  return (next: any) => async (action: unknown) => {
    if (!isThunkOject(action)) return next(action)

    const { apiCall, dispatchAction, dispatchProps } = action

    next(requestDataAPI())

    const data = await apiCall()
    next(dispatchAction(data, false, dispatchProps))
  }
}

export default callAPIMiddleware

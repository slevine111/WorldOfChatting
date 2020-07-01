import 'react-redux'
import { Action, AnyAction, Dispatch } from 'redux'
import { IThunkReturnObject } from '../store/APIRequestsHandling/types'

declare module 'react-redux' {
  function useDispatch<ThunkReturnObject = IThunkReturnObject<any>>(): (
    thunkObject: ThunkReturnObject | AnyAction
  ) => Promise<AnyAction>
  function useDispatch<TDispatch = Dispatch<any>>(): TDispatch
  function useDispatch<A extends Action = AnyAction>(): Dispatch<A>
}

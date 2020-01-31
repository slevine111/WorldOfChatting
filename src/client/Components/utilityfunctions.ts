import { ReducerErrorProperty } from '../store/reducer.base'

export enum GeneralErrorTypes {
  NO_ERROR = 'NO_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  NON_AUTHENTICATION_ERROR = 'NON_AUTHENTICATION_ERROR'
}

export const checkError = (error: ReducerErrorProperty): GeneralErrorTypes => {
  const {
    NO_ERROR,
    AUTHENTICATION_ERROR,
    NON_AUTHENTICATION_ERROR
  } = GeneralErrorTypes
  if (error === null) return NO_ERROR
  if (error.statusCode === 401) return AUTHENTICATION_ERROR
  return NON_AUTHENTICATION_ERROR
}

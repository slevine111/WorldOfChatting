import React from 'react'
import { Redirect, Link } from 'react-router-dom'
import store from '../store'
import { checkError, GeneralErrorTypes } from './utilityfunctions'
import { IReduxStoreGenericErrorType } from './intercomponent-types'

const WillNameLaterHOC = (Component: any): any => {
  const WillNameLater: React.FC<{
    reduxStoreDataSlices: {
      error: IReduxStoreGenericErrorType
      [key: string]: any
    }[]
    [key: string]: any
  }> = props => {
    console.log('props', props)
    const { reduxStoreDataSlices, ...otherProps } = props
    const {
      NO_ERROR,
      NON_AUTHENTICATION_ERROR,
      AUTHENTICATION_ERROR
    } = GeneralErrorTypes

    let authErrorType: GeneralErrorTypes = checkError(
      store.getState().auth.error
    )
    let apiError: GeneralErrorTypes =
      authErrorType === AUTHENTICATION_ERROR ? authErrorType : NO_ERROR
    if (apiError !== AUTHENTICATION_ERROR) {
      for (let i = 0; i < reduxStoreDataSlices.length; ++i) {
        if (
          checkError(reduxStoreDataSlices[i].error) === AUTHENTICATION_ERROR
        ) {
          apiError = AUTHENTICATION_ERROR
          break
        }
        if (
          checkError(reduxStoreDataSlices[i].error) === NON_AUTHENTICATION_ERROR
        )
          apiError = NON_AUTHENTICATION_ERROR
      }
    }

    if (apiError === AUTHENTICATION_ERROR) return <Redirect to="/Login" />

    if (apiError === NON_AUTHENTICATION_ERROR) {
      return (
        <div>
          Error occured :(. Fixing it ASAP. In meantime, return to{' '}
          <Link to="/home">home page</Link>
        </div>
      )
    }
    return <Component {...{ ...otherProps }} />
  }

  return WillNameLater
}

export default WillNameLaterHOC

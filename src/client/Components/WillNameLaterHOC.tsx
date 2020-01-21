import React from 'react'
import { Link } from 'react-router-dom'
import { checkError, GeneralErrorTypes } from './utilityfunctions'
import { ReducerErrorProperty } from '../store/reducer.base'

const WillNameLaterHOC = (Component: any): any => {
  const WillNameLater: React.FC<{
    reduxStoreDataSlices: {
      error: ReducerErrorProperty
      [key: string]: any
    }[]
    [key: string]: any
  }> = props => {
    const { reduxStoreDataSlices, ...otherProps } = props
    const { NO_ERROR, NON_AUTHENTICATION_ERROR } = GeneralErrorTypes

    let apiError: GeneralErrorTypes = NO_ERROR
    for (let i = 0; i < reduxStoreDataSlices.length; ++i) {
      if (
        checkError(reduxStoreDataSlices[i].error) === NON_AUTHENTICATION_ERROR
      ) {
        apiError = NON_AUTHENTICATION_ERROR
        break
      }
    }

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

import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ReduxState } from '../store/store.types'
import CircularProgress from '@material-ui/core/CircularProgress'

const WithDataLoadingChecksHOC = (
  Component: React.FC<Record<string, any>>,
  apiRequestActionType: string
): React.FC<Record<string, any>> => {
  return (props) => {
    const {
      apiCalling: { error, event, dataLoading },
    } = useSelector((state: ReduxState) => state.ui)
    if (error !== null) {
      return (
        <div>
          Error occured :(. Fixing it ASAP. In meantime, return to{' '}
          <Link to="/home">home page</Link>
        </div>
      )
    }

    if (event === apiRequestActionType && dataLoading) {
      return <CircularProgress disableShrink />
    }

    return <Component {...{ ...props }} />
  }
}

export default WithDataLoadingChecksHOC

import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ReduxState } from '../store/store.types'

const WillNameLaterHOC = (Component: any): any => {
  const WillNameLater: React.FC<{
    [key: string]: any
  }> = (props) => {
    const error = useSelector(({ ui }: ReduxState) => ui.apiCalling.error)
    if (error !== null) {
      return (
        <div>
          Error occured :(. Fixing it ASAP. In meantime, return to{' '}
          <Link to="/home">home page</Link>
        </div>
      )
    }
    return <Component {...{ ...props }} />
  }

  return WillNameLater
}

export default WillNameLaterHOC

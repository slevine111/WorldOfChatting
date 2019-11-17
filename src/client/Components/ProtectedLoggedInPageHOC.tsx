import React, { ReactElement } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { ReduxState } from '../store/index'
import { User } from '../../entities'

const ProtectedLoggedInPageHOC = (Component: any): any => {
  interface IReduxStateProps {
    user: User
  }

  const ProtectedLoggedInPage: React.FC<IReduxStateProps> = ({
    user
  }): ReactElement => {
    if (!user.id) return <Redirect to="/" />
    return <Component />
  }

  const mapStateToProps = ({
    auth: { user }
  }: ReduxState): IReduxStateProps => ({
    user
  })

  return connect(mapStateToProps)(ProtectedLoggedInPage)
}

export default ProtectedLoggedInPageHOC

import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Route } from 'react-router'
import Home from './Home/'
import LanguagePage from './LanguagePage'
import { userLoggedInThunk } from '../store/shared/thunks'
import { User } from '../../entities'
import { ReduxState } from '../store'
import CircularProgress from '@material-ui/core/CircularProgress'

interface IReduxStateProps {
  dataLoading: boolean
  user: User
}

interface IDispatchProps {
  loggedInUserDataRetrival: (user: User) => void
}

const LoggedInUserController: React.FC<IReduxStateProps & IDispatchProps> = ({
  user,
  dataLoading,
  loggedInUserDataRetrival
}) => {
  useEffect(() => {
    loggedInUserDataRetrival(user)
  }, [])
  if (dataLoading) return <CircularProgress disableShrink />
  return (
    <div>
      <Route path="/home" exact component={Home} />
      <Route path="/language/:language" exact component={LanguagePage} />
    </div>
  )
}

const mapStateToProps = ({
  auth,
  users,
  userLanguages,
  chatGroups,
  userChatGroups
}: ReduxState): IReduxStateProps => {
  const { user } = auth
  const dataLoading: boolean =
    users.myUsers.isLoading ||
    userLanguages.ofUser.isLoading ||
    [chatGroups, userChatGroups].some(dataItem => dataItem.isLoading)
  return { dataLoading, user: user.data }
}

const mapDispatchToProps = (dispatch: any): IDispatchProps => {
  return {
    loggedInUserDataRetrival: (user: User): void =>
      dispatch(userLoggedInThunk(user))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoggedInUserController)

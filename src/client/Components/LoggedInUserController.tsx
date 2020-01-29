import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Route, Switch, Redirect } from 'react-router'
import Home from './Home/'
import LanguagePage from './LanguagePage'
import { userLoggedInDataRetrivalThunk } from '../store/APIRequestsHandling/multiplereducerthunks'
import { User } from '../../entities'
import { ReduxState } from '../store'
import { IAuthReducerState } from '../store/auth/reducer'
import { RequestDataFailureConstants } from '../store/APIRequestsHandling/types'
import CircularProgress from '@material-ui/core/CircularProgress'
//import Backdrop from '@material-ui/core/Backdrop'
import Typography from '@material-ui/core/Typography'
import WillNameLaterHOC from './WillNameLaterHOC'
const { USER_LOGGING_OUT_REQUEST_FAILURE } = RequestDataFailureConstants

interface IReduxStateProps {
  dataLoading: boolean
  user: User
  auth: IAuthReducerState
}

interface IDispatchProps {
  loggedInUserDataRetrival: (user: User) => void
}

const LoggedInUserController: React.FC<IReduxStateProps & IDispatchProps> = ({
  user,
  auth,
  dataLoading,
  loggedInUserDataRetrival
}) => {
  useEffect(() => {
    loggedInUserDataRetrival(user)
  }, [])
  if (dataLoading) return <CircularProgress disableShrink />
  return (
    <div>
      {auth.error !== null &&
        auth.error.actionType === USER_LOGGING_OUT_REQUEST_FAILURE && (
          <Typography variant="body1">
            Error occured in logout :(. Stay on the site :).
          </Typography>
        )}
      <Switch>
        <Route path="/home" exact component={Home} />
        <Route path="/language/:language" exact component={LanguagePage} />
        <Redirect to="/home" />
      </Switch>
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
    userLanguages.ofUser.isLoading ||
    [users, chatGroups, userChatGroups].some(dataItem => dataItem.isLoading)
  return {
    dataLoading,
    user: user.data,
    auth
  }
}

const mapDispatchToProps = (dispatch: any): IDispatchProps => {
  return {
    loggedInUserDataRetrival: (user: User): void =>
      dispatch(userLoggedInDataRetrivalThunk(user))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WillNameLaterHOC(LoggedInUserController))

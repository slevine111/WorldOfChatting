import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Route, Switch, Redirect } from 'react-router'
import Home from './Home/'
import LanguagePage from './LanguagePage'
import { userLoggedInThunk } from '../store/APIRequestsHandling/thunks'
import { User } from '../../entities'
import { ReduxState } from '../store'
import { IUserReducerDataSlice } from '../store/user/reducer'
import { IUserLoggedInLanguagesDataSlice } from '../store/userlanguage/reducer'
import { IChatGroupReducerState } from '../store/chatgroup/reducer'
import { IUserChatGroupReducerState } from '../store/userchatgroup/reducer'
import { IAuthReducerState } from '../store/auth/reducer'
import { OnApiFailureActionTypes } from '../store/APIRequestsHandling/types'
import CircularProgress from '@material-ui/core/CircularProgress'
//import Backdrop from '@material-ui/core/Backdrop'
import Typography from '@material-ui/core/Typography'
import WillNameLaterHOC from './WillNameLaterHOC'
const { USER_LOGGING_OUT_REQUEST_FAILED } = OnApiFailureActionTypes

interface IReduxStateProps {
  dataLoading: boolean
  user: User
  auth: IAuthReducerState
  reduxStoreDataSlices:
    | []
    | [
        IUserReducerDataSlice,
        IUserLoggedInLanguagesDataSlice,
        IChatGroupReducerState,
        IUserChatGroupReducerState
      ]
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
        auth.error.actionType === USER_LOGGING_OUT_REQUEST_FAILED && (
          <Typography variant="body1">
            Error occured in logout :(. Stay on the site :).
          </Typography>
        )}
      {/*<Backdrop open={userLoggingOut} className={backdrop}>
        <CircularProgress disableShrink />
      </Backdrop>*/}
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
    users.myUsers.isLoading ||
    userLanguages.ofUser.isLoading ||
    [chatGroups, userChatGroups].some(dataItem => dataItem.isLoading)
  return {
    dataLoading,
    user: user.data,
    auth,
    reduxStoreDataSlices: dataLoading
      ? []
      : [users.myUsers, userLanguages.ofUser, chatGroups, userChatGroups]
  }
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
)(WillNameLaterHOC(LoggedInUserController))

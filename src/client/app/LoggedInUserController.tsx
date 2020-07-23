import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Route, Switch, Redirect } from 'react-router'
import Home from '../UserHomePage'
import LanguagePage from '../Components/LanguagePage'
import ChatPage from '../ChatPage'
import { userLoggedInDataRetrivalThunk } from './thunks'
import { REQUEST_ACTION_TYPES } from './actions'
import { ReduxState } from '../shared/store/store.types'
import WithDataLoadingChecksHOC from '../shared/components/WithDataLoadingChecksHOC'

const LoggedInUserRoutes: React.FC<{}> = () => {
  return (
    <div>
      {/*auth.error !== null &&
        auth.error.actionType === USER_LOGGING_OUT_REQUEST_FAILURE && (
          <Typography variant="body1">
            Error occured in logout :(. Stay on the site por favor34\ :).
          </Typography>
        )*/}
      <Switch>
        <Route path="/home" exact component={Home} />
        <Route path="/language/:language" exact component={LanguagePage} />
        <Route path="/chat/:chatGroupId?" component={ChatPage} />

        <Redirect to="/home" />
      </Switch>
    </div>
  )
}

const LoggedInUserRoutesHOC = WithDataLoadingChecksHOC(
  LoggedInUserRoutes,
  REQUEST_ACTION_TYPES.GET_LOGGEDIN_USER_BASE_DATA_REQUEST
)

const LoggedInUserController: React.FC<{}> = () => {
  const userId = useSelector((state: ReduxState) => state.auth.user.id)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(userLoggedInDataRetrivalThunk(userId))
  }, [userId])
  return <LoggedInUserRoutesHOC />
}

export default LoggedInUserController

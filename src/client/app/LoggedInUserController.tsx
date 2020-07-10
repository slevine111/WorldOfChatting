import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Route, Switch, Redirect } from 'react-router'
import Home from '../UserHomePage'
import LanguagePage from '../Components/LanguagePage'
import ChatPage from '../ChatPage'
import { userLoggedInDataRetrivalThunk } from './thunks'
import { REQUEST_ACTION_TYPES } from './actions'
import { ReduxState } from '../shared/store/store.types'
import CircularProgress from '@material-ui/core/CircularProgress'
import WillNameLaterHOC from '../shared/components/WillNameLaterHOC'

const LoggedInUserController: React.FC<{}> = () => {
  const dispatch = useDispatch()
  const dataLoading = useSelector(
    ({ ui: { apiCalling } }: ReduxState) =>
      apiCalling.event ===
        REQUEST_ACTION_TYPES.GET_LOGGEDIN_USER_BASE_DATA_REQUEST &&
      apiCalling.dataLoading
  )

  const user = useSelector(({ auth }: ReduxState) => auth.user)
  useEffect(() => {
    dispatch(userLoggedInDataRetrivalThunk(user))
  }, [])
  if (dataLoading) return <CircularProgress disableShrink />
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

export default WillNameLaterHOC(LoggedInUserController)

import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Route, Switch, Redirect } from 'react-router'
import Home from './Home/'
import LanguagePage from './LanguagePage'
import { userLoggedInDataRetrivalThunk } from '../store/APIRequestsHandling/multiplereducerthunks'
import { ReduxState } from '../store'
import { RequestDataConstants } from '../store/APIRequestsHandling/types'
import CircularProgress from '@material-ui/core/CircularProgress'
import WillNameLaterHOC from './WillNameLaterHOC'
const { HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST } = RequestDataConstants

const LoggedInUserController: React.FC<{}> = () => {
  const dispatch = useDispatch()
  const dataLoading = useSelector(
    ({ ui: { apiCalling } }: ReduxState) =>
      apiCalling.event === HAVE_LOGGEDIN_USER_GET_THEIR_BASE_DATA_REQUEST &&
      apiCalling.dataLoading
  )
  const user = useSelector(({ auth }: ReduxState) => auth.user.data)
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
        <Redirect to="/home" />
      </Switch>
    </div>
  )
}

export default WillNameLaterHOC(LoggedInUserController)

import React, { ReactElement, useState, ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import { Location } from 'history'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import useStyles from './styles'
import { connect } from 'react-redux'
import { loginUserProcess } from '../../store/auth/thunks'
import { IUserSignInDTO } from '../../../server/auth/auth.dto'
import { RequestDataFailureConstants } from '../../store/APIRequestsHandling/types'
import { ReduxState } from '../../store'
import { IAuthReducerState } from '../../store/auth/reducer'
import Grid from '@material-ui/core/Grid'
import ErrorMessageCaption from '../_shared/utility/ErrorMessageCaption'
const {
  REFRESHING_ACCESS_TOKEN_REQUEST_FAILURE,
  AUTHENTICATING_USER_LOGIN_ATTEMPT_REQUEST_FAILURE
} = RequestDataFailureConstants

interface IReduxStateProps {
  auth: IAuthReducerState
}

interface IDispatchProps {
  loginUser: (userLoginInfo: IUserSignInDTO) => Promise<void>
}

const Login: React.FC<IReduxStateProps &
  IDispatchProps & {
    location: Location<
      | {
          email: string
          password: string
        }
      | undefined
    >
  }> = ({ auth, loginUser, location }): ReactElement => {
  let initialEmail: string = ''
  let initialPassword: string = ''
  if (typeof location.state === 'object' && location.state !== null) {
    const { state } = location
    initialEmail = state.email
    initialPassword = state.password
  }
  const [loginInfo, setLoginInfo] = useState<IUserSignInDTO>({
    email: initialEmail,
    password: initialPassword
  })

  const handleChange = ({ target }: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = target
    setLoginInfo({ ...loginInfo, [name]: value })
  }

  const {
    formContainer,
    paperPadding,
    topMargin,
    topMarginButton,
    centerText
  } = useStyles()
  const { error } = auth
  return (
    <Grid container className={formContainer}>
      {error !== null &&
        error.actionType == REFRESHING_ACCESS_TOKEN_REQUEST_FAILURE && (
          <div>
            You accidentally got logged out. Please log back in. Fixing it ASAP.
          </div>
        )}
      <Paper className={paperPadding} square={true}>
        <Typography className={centerText} variant="body1">
          <i>Ready to keep chatting with the world?!</i>
        </Typography>

        <TextField
          id="email"
          name="email"
          label="Email"
          value={loginInfo.email}
          onChange={handleChange}
          margin="normal"
          fullWidth
          variant="outlined"
        />
        <TextField
          id="password"
          name="password"
          label="Password"
          value={loginInfo.password}
          onChange={handleChange}
          onKeyDown={event => {
            if (event.which === 13) loginUser(loginInfo)
          }}
          margin="normal"
          fullWidth
          variant="outlined"
          type="password"
        />
        {error !== null &&
          error.actionType ===
            AUTHENTICATING_USER_LOGIN_ATTEMPT_REQUEST_FAILURE && (
            <ErrorMessageCaption errorMessage={error.message} />
          )}
        <div className={topMarginButton}>
          <Button
            size="small"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loginInfo.email === '' || loginInfo.password === ''}
            onClick={() => loginUser(loginInfo)}
          >
            Log in
          </Button>
        </div>
        <div className={topMargin}>
          <Typography className={centerText}>
            Don't have an account? <Link to="/signup">Sign up here</Link>
          </Typography>
        </div>
      </Paper>
    </Grid>
  )
}

const mapStateToProps = ({ auth }: ReduxState): IReduxStateProps => ({ auth })

const mapDispatchToProps = (dispatch: any): IDispatchProps => {
  return {
    loginUser: (userLoginInfo: IUserSignInDTO) => {
      return dispatch(loginUserProcess(userLoginInfo))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)

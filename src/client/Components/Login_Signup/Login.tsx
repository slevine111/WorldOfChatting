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
import { OnApiFailureActionTypes } from '../../store/APIRequestsHandling/types'
import { ReduxState } from '../../store'
import { IAuthReducerState } from '../../store/auth/reducer'
import Grid from '@material-ui/core/Grid'
const { REFRESHING_ACCESS_TOKEN_REQUEST_FAILED } = OnApiFailureActionTypes

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
  let email: string = ''
  let password: string = ''
  if (typeof location.state === 'object' && location.state !== null) {
    const { state } = location
    email = state.email
    password = state.password
  }
  const [loginInfo, setLoginInfo] = useState<IUserSignInDTO>({
    email,
    password
  })
  const [loginError, setLoginError] = useState('')

  const handleChange = ({ target }: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = target
    setLoginInfo({ ...loginInfo, [name]: value })
  }

  const onSubmit = (event: ChangeEvent<HTMLFormElement>): void => {
    event.preventDefault()
    loginUser(loginInfo).catch(error => {
      setLoginError(error.response.data.message)
    })
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
        error.actionType == REFRESHING_ACCESS_TOKEN_REQUEST_FAILED && (
          <div>
            You accidentally got logged out. Please log back in. Fixing it ASAP.
          </div>
        )}
      <Paper className={paperPadding} square={true}>
        <Typography className={centerText} variant="body1">
          <i>Ready to keep chatting with the world?!</i>
        </Typography>
        <form onSubmit={onSubmit}>
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
            margin="normal"
            fullWidth
            variant="outlined"
          />
          {loginError !== '' && (
            <Typography variant="caption" style={{ color: 'red' }}>
              {loginError}
            </Typography>
          )}
          <div className={topMarginButton}>
            <Button
              type="submit"
              size="small"
              fullWidth
              variant="contained"
              color="primary"
            >
              Log in
            </Button>
          </div>
        </form>
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

import React, { ReactElement, useState, ChangeEvent } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Location } from 'history'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import useStyles from '../styles'
import { loginUserProcess } from './thunks'
import { IUserSignInDTO } from '../../../server/auth/auth.dto'
import { AUTHENTICATING_USER_LOGIN_REQUEST } from './actions'
import { ACTION_TYPES } from '../../shared/store/middleware/api/actions'
import { ReduxState } from '../../shared/store/store.types'
import Grid from '@material-ui/core/Grid'
import ErrorMessageCaption from '../../shared/components/utility/ErrorMessageCaption'

const Login: React.FC<{
  location: Location<
    | {
        email: string
        password: string
      }
    | undefined
  >
}> = ({ location }): ReactElement => {
  const {
    formContainer,
    paperPadding,
    topMargin,
    topMarginButton,
    centerText,
  } = useStyles()
  const dispatch = useDispatch()
  const {
    apiCalling: { error, event },
  } = useSelector(({ ui }: ReduxState) => ui)

  let initialEmail: string = ''
  let initialPassword: string = ''
  if (typeof location.state === 'object' && location.state !== null) {
    const { state } = location
    initialEmail = state.email
    initialPassword = state.password
  }
  const [loginInfo, setLoginInfo] = useState<IUserSignInDTO>({
    email: initialEmail,
    password: initialPassword,
  })

  const handleChange = ({ target }: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = target
    setLoginInfo({ ...loginInfo, [name]: value })
  }

  return (
    <Grid container className={formContainer}>
      {error !== null &&
        event == ACTION_TYPES.REFRESHING_ACCESS_TOKEN_REQUEST && (
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
          onKeyDown={(event) => {
            if (event.which === 13) dispatch(loginUserProcess(loginInfo))
          }}
          margin="normal"
          fullWidth
          variant="outlined"
          type="password"
        />
        {error !== null && event === AUTHENTICATING_USER_LOGIN_REQUEST && (
          <ErrorMessageCaption errorMessage={error.message} />
        )}
        <div className={topMarginButton}>
          <Button
            size="small"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loginInfo.email === '' || loginInfo.password === ''}
            onClick={() => dispatch(loginUserProcess(loginInfo))}
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

export default Login

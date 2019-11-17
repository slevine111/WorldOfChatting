import React, { ReactElement, useState, ChangeEvent } from 'react'
import { Link, Redirect } from 'react-router-dom'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import useStyles from './styles'
import { connect } from 'react-redux'
import { loginUserProcess } from '../../store/auth/thunks'
import { SetUserAndAccessTokenFieldsActionType } from '../../store/auth/actions'
import { IUserAndExpireTime } from '../../store/auth/types'
import { IUserSignInDTO } from '../../../server/auth/auth.dto'
import { ThunkDispatch } from 'redux-thunk'
import { History } from 'history'
import Grid from '@material-ui/core/Grid'
import { ReduxState } from '../../store/index'
import { User } from '../../../entities'

interface IReduxStateProps {
  user: User
}

interface IDispatchProps {
  loginUser: (userLoginInfo: IUserSignInDTO) => Promise<void>
}

interface ILoginProps extends IDispatchProps, IReduxStateProps {
  history: History
}

const Login: React.FC<ILoginProps> = ({
  user,
  loginUser,
  history
}): ReactElement => {
  if (user.id) return <Redirect to="/home" />

  const [loginInfo, setLoginInfo] = useState<IUserSignInDTO>(
    history.location.state || {
      email: '',
      password: ''
    }
  )
  const [error, setError] = useState<string>('')

  const handleChange = ({ target }: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = target
    setLoginInfo({ ...loginInfo, [name]: value })
  }

  const onSubmit = (event: ChangeEvent<HTMLFormElement>): void => {
    event.preventDefault()
    loginUser(loginInfo)
      .then(() => history.push('/home'))
      .catch(({ response }) => setError(response.data.message))
  }

  const {
    formContainer,
    paperPadding,
    topMargin,
    topMarginButton,
    centerText
  } = useStyles()
  return (
    <Grid container className={formContainer}>
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
          {error !== '' && (
            <Typography variant="caption" style={{ color: 'red' }}>
              {error}
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

const mapStateToProps = ({ auth: { user } }: ReduxState): IReduxStateProps => ({
  user
})

const mapDispatchToProps = (
  dispatch: ThunkDispatch<
    IUserAndExpireTime,
    IUserSignInDTO,
    SetUserAndAccessTokenFieldsActionType
  >
): IDispatchProps => {
  return {
    loginUser: (userLoginInfo: IUserSignInDTO) =>
      dispatch(loginUserProcess(userLoginInfo))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)

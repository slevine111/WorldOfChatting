import React, { ReactElement, useState, ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import useStyles from './styles'
import { connect } from 'react-redux'
import { loginUserThunk } from '../../store/loggedinuser/actions'
import { ISetLoggedInUserAction } from '../../store/loggedinuser/types'
import { User } from '../../../entities'
import { IUserSignInDTO } from '../../../server/auth/auth.dto'
import { ThunkDispatch } from 'redux-thunk'
import { History } from 'history'

interface IDispatchProps {
  loginUser: (userLoginInfo: IUserSignInDTO) => Promise<void>
}

interface ILoginProps extends IDispatchProps {
  history: History
}

const Login: React.FC<ILoginProps> = ({ loginUser, history }): ReactElement => {
  const [loginInfo, setLoginInfo] = useState<IUserSignInDTO>({
    email: '',
    password: ''
  })
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

  const { formContainer, topMargin, topMarginButton } = useStyles()
  return (
    <Paper className={formContainer} square={true}>
      <Typography variant="body1">
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
        <Typography>
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </Typography>
      </div>
    </Paper>
  )
}

const mapDispatchToProps = (
  dispatch: ThunkDispatch<User, IUserSignInDTO, ISetLoggedInUserAction>
): IDispatchProps => {
  return {
    loginUser: (userLoginInfo: IUserSignInDTO) =>
      dispatch(loginUserThunk(userLoginInfo))
  }
}

export default connect(
  null,
  mapDispatchToProps
)(Login)

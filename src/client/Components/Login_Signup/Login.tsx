import React, { ReactElement, useState, ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import useStyles from './styles'

interface ILoginInfo {
  email: string
  password: string
}

const Login: React.FC<{}> = (): ReactElement => {
  const [loginInfo, setLoginInfo] = useState<ILoginInfo>({
    email: '',
    password: ''
  })

  const handleChange = ({ target }: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = target
    setLoginInfo({ ...loginInfo, [name]: value })
  }

  const { formContainer, topMargin, topMarginButton } = useStyles()
  return (
    <Paper className={formContainer} square={true}>
      <Typography variant="body1">
        <i>Ready to keep chatting with the world?!</i>
      </Typography>
      <form>
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

export default Login

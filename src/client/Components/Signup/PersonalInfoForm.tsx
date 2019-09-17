import React, { ReactElement, ChangeEvent } from 'react'
import TextField from '@material-ui/core/TextField'
import useStyles from './styles'
import { ISignupInfo } from './index'

interface IPersonalInfoFormProps {
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void
  signupInfo: ISignupInfo
}

const PersonalInfoForm: React.FC<IPersonalInfoFormProps> = ({
  handleChange,
  signupInfo
}): ReactElement => {
  const { flexSpaceBetween, firstNameInput } = useStyles()
  return (
    <div>
      <div className={flexSpaceBetween}>
        <TextField
          id="firstName"
          name="firstName"
          label="First Name"
          value={signupInfo.firstName}
          onChange={handleChange}
          className={firstNameInput}
          variant="outlined"
        />
        <TextField
          id="lastName"
          name="lastName"
          label="Last Name"
          value={signupInfo.lastName}
          onChange={handleChange}
          variant="outlined"
        />
      </div>
      <TextField
        id="email"
        name="email"
        label="Email"
        value={signupInfo.email}
        onChange={handleChange}
        margin="normal"
        fullWidth
        variant="outlined"
      />
      <TextField
        id="password"
        name="password"
        label="Password"
        value={signupInfo.password}
        onChange={handleChange}
        margin="normal"
        fullWidth
        variant="outlined"
      />
    </div>
  )
}

export default PersonalInfoForm

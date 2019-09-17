import React, { useState, ReactElement, ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import PersonalInfoForm from './PersonalInfoForm'
import LanguageSelector from '../_shared/LanguageSelector/LanguageSelector'
import SignupStepButtons from './SignupStepButtons'
import useStyles from './styles'
import { ISignupInfo } from './index'

//Material-UI
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

const Signup: React.FC<{}> = (): ReactElement => {
  let [signupInfo, setSignupFields] = useState<ISignupInfo>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    languagesToLearn: [],
    languagesToTeach: []
  })

  let [currentStep, setCurrentStep] = useState<string>('personal info')

  const handleChange = ({ target }: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = target
    setSignupFields({ ...signupInfo, [name]: value })
  }

  const handleLanguageChange = (
    { target }: ChangeEvent<HTMLInputElement>,
    language: string,
    signupInfoKey: 'languagesToLearn' | 'languagesToTeach'
  ): void => {
    if (target.checked) {
      setSignupFields({
        ...signupInfo,
        [signupInfoKey]: signupInfo[signupInfoKey].concat(language)
      })
    } else {
      setSignupFields({
        ...signupInfo,
        [signupInfoKey]: signupInfo[signupInfoKey].filter(el => el !== language)
      })
    }
  }

  /*const dummyFunction = (event: ChangeEvent<HTMLFormElement>): void => {
    event.preventDefault()
    console.log('clicked')
  }*/

  const { languagesToLearn, languagesToTeach } = signupInfo
  const { signupContainer } = useStyles()
  return (
    <div className={signupContainer}>
      <Typography variant="caption">
        <i>Ready to become a citizen of the world?</i>
      </Typography>
      <form>
        {currentStep === 'personal info' ? (
          <PersonalInfoForm {...{ signupInfo, handleChange }} />
        ) : (
          <LanguageSelector
            handleChange={handleLanguageChange}
            {...{ languagesToLearn, languagesToTeach }}
          />
        )}

        {currentStep === 'personal info' ? (
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => setCurrentStep('language selector')}
          >
            Next
          </Button>
        ) : (
          <SignupStepButtons {...{ setCurrentStep }} />
        )}
      </form>
      <Typography>
        Have an account? <Link to="/">Log in</Link>
      </Typography>
    </div>
  )
}

export default Signup

//Packages
import React, { useState, ReactElement, ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import { History } from 'history'

//Components
import PersonalInfoForm from './PersonalInfoForm'
import LanguageSelector from '../_shared/LanguageSelector/LanguageSelector'
import SignupStepButtons from './SignupStepButtons'
import ErrorMessageCaption from '../_shared/utility/ErrorMessageCaption'

//My modules
import { ISignupInfo } from './index'
import { signupNewUserProcess } from './helperfunctions'
import { IUserLanguagePostDTOSubset } from '../../../server/userlanguages/userlanguages.dto'
import { UserLanguageTypeFieldOptions } from '../../../entities/UserLanguage'

//Material-UI
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import useStyles from './styles'

const Signup: React.FC<{ history: History }> = ({ history }): ReactElement => {
  let [signupInfo, setSignupFields] = useState<ISignupInfo>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirmed: '',
    languagesToLearn: [],
    languagesToTeach: []
  })
  let [
    haveClickedOnConfirmPasswordInput,
    sethaveClickedOnConfirmPasswordInput
  ] = useState(false)

  let [currentStep, setCurrentStep] = useState<string>('personal info')

  const handleChange = ({ target }: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = target
    setSignupFields({ ...signupInfo, [name]: value })
  }

  const switchHaveClickedOnConfirmPasswordInputToTrue = (): void => {
    if (!haveClickedOnConfirmPasswordInput) {
      sethaveClickedOnConfirmPasswordInput(true)
    }
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

  const onSubmit = (event: ChangeEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const { LEARNER, TEACHER } = UserLanguageTypeFieldOptions
    const { languagesToLearn, languagesToTeach, ...otherUserInfo } = signupInfo
    const userLanguagePayload: IUserLanguagePostDTOSubset[] = [
      ...languagesToLearn.map(language => ({
        language,
        type: LEARNER
      })),
      ...languagesToTeach.map(language => ({
        language,
        type: TEACHER
      }))
    ]
    signupNewUserProcess(otherUserInfo, userLanguagePayload).then(() => {
      history.push({
        pathname: '/login',
        state: { email: otherUserInfo.email, password: otherUserInfo.password }
      })
    })
  }

  const {
    languagesToLearn,
    languagesToTeach,
    password,
    passwordConfirmed
  } = signupInfo
  const {
    paperPadding,
    formContainer,
    topMargin,
    topMarginButton,
    centerText
  } = useStyles()
  return (
    <Grid container className={formContainer}>
      <Paper className={paperPadding} square={true}>
        <Typography className={centerText} variant="body1">
          <i>Ready to become a citizen of the world?!</i>
        </Typography>
        <form onSubmit={onSubmit} className={topMargin}>
          {currentStep === 'personal info' ? (
            <PersonalInfoForm
              {...{
                signupInfo,
                handleChange,
                switchHaveClickedOnConfirmPasswordInputToTrue
              }}
            />
          ) : (
            <LanguageSelector
              handleChange={handleLanguageChange}
              {...{ languagesToLearn, languagesToTeach }}
            />
          )}

          {password !== passwordConfirmed &&
            haveClickedOnConfirmPasswordInput && (
              <ErrorMessageCaption errorMessage="passwords do not match" />
            )}

          {currentStep === 'personal info' ? (
            <div className={topMarginButton}>
              <Button
                type="button"
                fullWidth
                variant="contained"
                color="primary"
                onClick={() => setCurrentStep('language selector')}
              >
                Next
              </Button>
            </div>
          ) : (
            <SignupStepButtons {...{ setCurrentStep }} />
          )}
        </form>
        <div className={topMargin}>
          <Typography className={centerText}>
            Already have an account? <Link to="/login">Log in</Link>
          </Typography>
        </div>
      </Paper>
    </Grid>
  )
}

export default Signup

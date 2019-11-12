//Packages
import React, { useState, ReactElement, ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import { History } from 'history'
import { connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'

//Components
import PersonalInfoForm from './PersonalInfoForm'
import LanguageSelector from '../_shared/LanguageSelector/LanguageSelector'
import SignupStepButtons from './SignupStepButtons'

//My modules
import { ISignupInfo } from './index'
import { signupNewUserProcess } from '../../store/shared-actions'
import { IUserPostDTO } from '../../../server/users/users.dto'
import { IUserLanguagePostDTOSubset } from '../../../server/userlanguages/userlanguages.dto'
import { Language } from '../../../entities'

//Material-UI
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import useStyles from './styles'

interface IDispatchProps {
  signupNewUserProcess: (
    newUser: IUserPostDTO,
    newUserLanguages: IUserLanguagePostDTOSubset[]
  ) => Promise<void>
}

interface ISignupProps extends IDispatchProps {
  history: History
}

const Signup: React.FC<ISignupProps> = ({
  signupNewUserProcess,
  history
}): ReactElement => {
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
    language: Language,
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
    const { languagesToLearn, languagesToTeach, ...otherUserInfo } = signupInfo
    const userLanguagePayload: IUserLanguagePostDTOSubset[] = [
      ...languagesToLearn.map(language => ({ type: 'learner', language })),
      ...languagesToTeach.map(language => ({ type: 'teacher', language }))
    ]
    signupNewUserProcess(otherUserInfo, userLanguagePayload)
    history.push('/login')
  }

  const { languagesToLearn, languagesToTeach } = signupInfo
  const { formContainer, topMargin, topMarginButton } = useStyles()
  return (
    <Paper className={formContainer} square={true}>
      <Typography variant="body1">
        <i>Ready to become a citizen of the world?!</i>
      </Typography>
      <form onSubmit={onSubmit} className={topMargin}>
        {currentStep === 'personal info' ? (
          <PersonalInfoForm {...{ signupInfo, handleChange }} />
        ) : (
          <LanguageSelector
            handleChange={handleLanguageChange}
            {...{ languagesToLearn, languagesToTeach }}
          />
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
        <Typography>
          Already have an account? <Link to="/login">Log in</Link>
        </Typography>
      </div>
    </Paper>
  )
}

const mapDispatchToProps = (
  dispatch: ThunkDispatch<any, any, AnyAction>
): IDispatchProps => {
  return {
    signupNewUserProcess: (
      newUser: IUserPostDTO,
      newUserLanguages: IUserLanguagePostDTOSubset[]
    ) => dispatch(signupNewUserProcess(newUser, newUserLanguages))
  }
}

export default connect(
  null,
  mapDispatchToProps
)(Signup)

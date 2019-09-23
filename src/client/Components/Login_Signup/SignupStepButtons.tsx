import React, { ReactElement, Dispatch, SetStateAction } from 'react'
import Button from '@material-ui/core/Button'
import useStyles from './styles'

interface ISignupStepButtons {
  setCurrentStep: Dispatch<SetStateAction<string>>
}

const SignupStepButtons: React.FC<ISignupStepButtons> = ({
  setCurrentStep
}): ReactElement => {
  const { flexSpaceBetween, signupButton, topMargin } = useStyles()
  return (
    <div className={`${flexSpaceBetween} ${topMargin}`}>
      <Button
        type="button"
        color="primary"
        onClick={() => setCurrentStep('personal info')}
      >
        Back
      </Button>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        size="small"
        className={signupButton}
      >
        Sign Up
      </Button>
    </div>
  )
}

export default SignupStepButtons

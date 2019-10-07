import { makeStyles } from '@material-ui/core/styles'
import { Style } from 'jss'

const useStyles: Style = makeStyles({
  flexSpaceBetween: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '50%',
    minWidth: '400px',
    margin: '40px auto 0',
    padding: '10px 0'
  },
  firstNameInput: {
    marginRight: '15px'
  },
  signupButton: {
    width: '30%'
  },
  topMargin: {
    marginTop: '16px'
  },
  topMarginButton: {
    marginTop: '10px'
  }
})

export default useStyles

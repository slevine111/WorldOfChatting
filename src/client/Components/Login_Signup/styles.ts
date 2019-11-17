import { makeStyles } from '@material-ui/core/styles'
import { Style } from 'jss'

const useStyles: Style = makeStyles({
  flexSpaceBetween: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  formContainer: {
    justifyContent: 'center',
    margin: '5vh auto 0'
  },
  paperPadding: { padding: '20px' },
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
  },
  centerText: {
    textAlign: 'center'
  }
})

export default useStyles

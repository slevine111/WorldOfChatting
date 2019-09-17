import { makeStyles } from '@material-ui/core/styles'
import { Style } from 'jss'

const useStyles: Style = makeStyles({
  flexSpaceBetween: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  signupContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  firstNameInput: {
    marginRight: '15px'
  },
  signupButton: {
    width: '30%'
  },
  topMargin: {
    marginTop: '15px'
  }
})

export default useStyles

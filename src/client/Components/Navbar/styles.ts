import { makeStyles } from '@material-ui/core/styles'
import { Style } from 'jss'

const styles: Style = makeStyles(theme => ({
  siteNameLink: { textDecoration: 'none', color: 'white', width: '100%' },
  buttonStyle: {
    textTransform: 'none',
    color: 'inherit'
  },
  aboutButton: { marginLeft: '15px' },
  toolbar: theme.mixins.toolbar
}))

export default styles

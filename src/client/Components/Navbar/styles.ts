import { makeStyles } from '@material-ui/core/styles'

const styles = makeStyles((theme) => ({
  siteNameLink: { textDecoration: 'none', color: 'white', width: '100%' },
  buttonStyle: {
    textTransform: 'none',
    color: 'inherit',
  },
  aboutButton: { marginLeft: '15px' },
  toolbar: theme.mixins.toolbar,
  modals: { width: '40%' },
  containedSizeSmall: { fontSize: '.6125rem' },
  chatGroupInvite: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
  acceptedButton: { marginRight: '5px' },
  inheritColor: { color: 'inherit' },
  defaultColor: { color: 'default' },
}))

export default styles

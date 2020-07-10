import { makeStyles } from '@material-ui/core/styles'

const styles = makeStyles({
  siteNameLink: { textDecoration: 'none', color: 'white', width: '100%' },
  buttonStyle: {
    textTransform: 'none',
    color: 'inherit',
  },
  aboutButton: { marginLeft: '15px' },
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
  iconButtonRoot: {
    width: '34px',
    height: '34px',
    padding: '5px',
    marginTop: '10px',
    marginRight: '8px',
  },
  badge: {
    minWidth: '0px !important',
    height: '16px !important',
    width: '16px !important',
  },
})

export default styles

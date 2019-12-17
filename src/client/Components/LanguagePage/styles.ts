import { makeStyles } from '@material-ui/core/styles'
import { Style } from 'jss'

const styles: Style = makeStyles(theme => {
  return {
    maxTableWidth: {
      maxWidth: '600px'
    },
    nestedListItem: {
      paddingLeft: theme.spacing(4)
    },
    orderByWidth: {
      width: '50%'
    },
    paperPageSection: {
      margin: '0px 0px 30px 10px',
      padding: '20px'
    }
  }
})

export default styles

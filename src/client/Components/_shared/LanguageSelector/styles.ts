import { makeStyles } from '@material-ui/core/styles'
import { Style } from 'jss'

const useStyles: Style = makeStyles({
  tableSize: {
    maxHeight: '800px',
    overflow: 'scroll'
  }
})

export default useStyles

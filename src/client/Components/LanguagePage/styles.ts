import { makeStyles } from '@material-ui/core/styles'
import { Style } from 'jss'

const styles: Style = makeStyles(theme => {
  const paddingTop: string = '8px'
  return {
    maxTableWidth: {
      maxWidth: '600px'
    },
    orderByWidth: {
      width: '50%'
    },
    paperPageSection: {
      margin: '0px 0px 30px 10px',
      padding: '20px'
    },
    bottomMarginLarge: {
      marginBottom: '15px'
    },
    hoverNoBackground: {
      '&:hover': { backgroundColor: 'white' }
    },
    allUsersListPadding: {
      paddingTop,
      paddingLeft: '50px'
    },
    allUsersContainerLeftPadding: {
      paddingLeft: '10px'
    },
    sidebarColumn: {
      maxWidth: '150px',
      borderBottom: `1px solid ${theme.palette.divider}`,
      padding: `${paddingTop} 0 4px`
    },
    langTypeBottomMargin: {
      marginBottom: '20px'
    },
    listItemRoot: {
      padding: '0px'
    }
  }
})

export default styles

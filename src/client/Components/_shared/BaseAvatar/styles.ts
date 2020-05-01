import { makeStyles } from '@material-ui/core/styles'

const styles = makeStyles(() => {
  const boxShadow: string = '0 0 0 2px #fff'
  return {
    loggedInBadge: {
      backgroundColor: 'green',
      boxShadow,
    },
    loggedOutBadge: {
      backgroundColor: 'red',
      boxShadow,
    },
    dot: { height: '10px', minWidth: '10px' },
    avatarColor: { backgroundColor: 'dodgerblue' },
    badgeRightMargin: {
      marginRight: '5px',
    },
  }
})

export default styles

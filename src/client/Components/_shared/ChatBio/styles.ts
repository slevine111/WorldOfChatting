import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(() => {
  const boxShadow: string = '0 0 0 2px #fff'
  return {
    loggedInBadge: {
      backgroundColor: 'green',
      boxShadow
    },
    loggedOutBadge: {
      backgroundColor: 'red',
      boxShadow
    },
    dot: { height: '10px', minWidth: '10px' },
    blockDisplay: { display: 'block' },
    avatarColor: { backgroundColor: 'dodgerblue' }
  }
})

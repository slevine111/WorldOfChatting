import { makeStyles } from '@material-ui/core/styles'

export const SMALL_AVATAR = <const>'SMALL_AVATAR'

export const NAVBAR_HEIGHT = <const>'48px'

export default makeStyles({
  '@global': {
    [`.${SMALL_AVATAR}`]: {
      width: '22px',
      height: '22px',
      fontSize: '.6rem',
      marginRight: '7px',
    },
  },
})

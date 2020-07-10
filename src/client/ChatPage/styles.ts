import { makeStyles } from '@material-ui/core/styles'
import { NAVBAR_HEIGHT } from '../shared/styles/globalstyles'

export const settingsIconBackgroundColor: string = 'rgba(0, 0, 0, 0.07)'

export const commonStyles = makeStyles({
  flexContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: `calc(100vh - ${NAVBAR_HEIGHT})`,
    marginLeft: '5px',
  },
  subHeading: {
    height: '50px',
    minHeight: '50px',
  },
})

export const sidebarStyles = makeStyles((theme) => {
  const buttonSize: string = '35.6px'
  return {
    toolbar: theme.mixins.toolbar,
    drawerPaper: { zIndex: theme.zIndex.appBar - 1 },
    top: {
      display: 'flex',
      justifyContent: 'space-between',
      marginRight: '20px',
      height: '50px',
    },
    sidebarDense: { paddingTop: '0px', paddingBottom: '0px' },
    iconButtonRoot: {
      color: 'black',
      padding: '5px',
      width: buttonSize,
      height: buttonSize,
      background: settingsIconBackgroundColor,
      '&:hover': { background: settingsIconBackgroundColor },
    },
    svgIconRoot: { fontSize: '1.6rem' },
    singleChatGroup: {
      display: 'flex',
      marginBottom: '5%',
      marginRight: '15px',
      cursor: 'pointer',
    },
    selectedChatGroup: {
      backgroundColor: settingsIconBackgroundColor,
      padding: '7px',
      borderRadius: '10px',
    },
    singleChatGroupTextItem: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      flexGrow: 1.5,
    },
    singleChatGroupTextItemTop: {
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
    },
  }
})

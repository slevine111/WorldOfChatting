import { makeStyles } from '@material-ui/core/styles'

export const sidebarStyles = makeStyles(() => {
  const settingsIconBackgroundColor: string = 'rgba(0, 0, 0, 0.07)'
  return {
    top: {
      display: 'flex',
      justifyContent: 'space-between',
      marginRight: '20px',
    },
    sidebarDense: { paddingTop: '0px', paddingBottom: '0px' },
    iconButtonRoot: {
      color: 'black',
      padding: '5px',
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

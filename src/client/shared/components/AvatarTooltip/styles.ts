import { makeStyles } from '@material-ui/core/styles'

export const avatarTooltipStyles = makeStyles(() => {
  const toolTipColor: string = '#f5f5f9'
  const toolTipDirectChat: Record<string, string> = {
    backgroundColor: toolTipColor,
    border: '1px solid #dadde9',
    color: 'rgba(0, 0, 0, 0.87)',
  }
  return {
    toolTipDirectChat,
    toolTipGroupChat: { ...toolTipDirectChat, padding: '4px 14px' },
    arrow: {
      color: toolTipColor,
      fontSize: '12px',
    },
  }
})

export const dotAvatarStyles = makeStyles(() => {
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

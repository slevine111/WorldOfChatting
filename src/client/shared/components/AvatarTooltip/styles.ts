import { makeStyles } from '@material-ui/core/styles'

const styles = makeStyles(() => {
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

export default styles

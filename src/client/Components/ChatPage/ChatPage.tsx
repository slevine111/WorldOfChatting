import React from 'react'
import ChatGroupSidebar from './ChatGroupSidebar'
import Grid from '@material-ui/core/Grid'

const ChatPage: React.FC<{}> = () => {
  return (
    <Grid container>
      <Grid item xs={3}>
        <ChatGroupSidebar />
      </Grid>
      <Grid item xs={9} style={{ backgroundColor: 'rgba(211,211,211,.3)' }}>
        <div>23</div>
      </Grid>
    </Grid>
  )
}

export default ChatPage

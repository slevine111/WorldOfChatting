import React, { useState } from 'react'
import FavoriteChats from './FavoriteChats'
import SimilarUsers from './SimilarUsers'
import Typography from '@material-ui/core/Typography'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

const ChattingSection = () => {
  const [tabIndex, setTabIndex] = useState(0)

  return (
    <div>
      <Typography variant="h4">Chatting Section</Typography>
      <Tabs
        value={tabIndex}
        onChange={(_event, value) => setTabIndex(value)}
        indicatorColor="primary"
        textColor="primary"
        style={{ marginBottom: '10px' }}
      >
        <Tab label="Favorite Chats" />
        <Tab label="Most Similar Users" />
      </Tabs>

      {tabIndex === 0 && <FavoriteChats />}
      {tabIndex === 1 && <SimilarUsers />}
    </div>
  )
}

export default ChattingSection

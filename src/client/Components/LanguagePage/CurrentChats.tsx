import React from 'react'
import { useSelector } from 'react-redux'
import { ReduxState } from '../../store'
import ChatBio from '../../shared/components/SingleChatOverview'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

interface IOwnProps {
  language: string
}

const FavoriteChats: React.FC<IOwnProps> = ({ language }) => {
  const chatGroupsOfLanguage: string[] = useSelector(
    ({ chatGroups }: ReduxState) => chatGroups.subGroupings[language]
  )
  return (
    <div>
      <Typography variant="h6">Current Chats</Typography>
      {!chatGroupsOfLanguage.length && (
        <Typography variant="body1">{`You are not currently chatting with anybody in ${language}. Click on someone below to start chatting!!`}</Typography>
      )}
      {!!chatGroupsOfLanguage.length && (
        <Grid container>
          {chatGroupsOfLanguage.map((chatGroupId: string) => {
            return (
              <ChatBio
                chatGroupId={chatGroupId}
                displayLanguage={false}
                key={chatGroupId}
              />
            )
          })}
        </Grid>
      )}
    </div>
  )
}

export default FavoriteChats

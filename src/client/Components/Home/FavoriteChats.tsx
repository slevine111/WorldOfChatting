import React from 'react'
import { useSelector } from 'react-redux'
import { ReduxState } from '../../store'
import { FAVORITE_CHAT_GROUPS_KEY } from '../../store/chatgroup/reducer'
import ChatBio from '../_shared/ChatBio'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'

const FavoriteChats: React.FC<{}> = ({}) => {
  const favoriteChatGroupIds: string[] = useSelector(
    ({ chatGroups }: ReduxState) =>
      chatGroups.subGroupings[FAVORITE_CHAT_GROUPS_KEY]
  )
  return (
    <div>
      <Typography variant="h6">My Favorite Chats</Typography>
      <Grid container>
        {!favoriteChatGroupIds.length && (
          <Typography variant="body1">
            You have no favorite chats. Go to your chats and add some!!
          </Typography>
        )}
        {favoriteChatGroupIds.length &&
          favoriteChatGroupIds.map((chatGroupId: string) => {
            return (
              <ChatBio
                key={chatGroupId}
                chatGroupId={chatGroupId}
                displayLanguage={true}
              />
            )
          })}
      </Grid>
    </div>
  )
}

export default FavoriteChats

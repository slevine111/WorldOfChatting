import React from 'react'
import { IUsersByChatGroup } from '../intercomponent-types'
import ChatBio from '../_shared/ChatBio'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'

interface IOwnProps {
  language: string
  usersByChatGroup: IUsersByChatGroup[]
}

const FavoriteChats: React.FC<IOwnProps> = ({ usersByChatGroup, language }) => {
  return (
    <div>
      <Typography variant="h6">Current Chats</Typography>
      {!usersByChatGroup.length && (
        <Typography variant="body1">{`You are not currently chatting with anybody in ${language}`}</Typography>
      )}
      <Grid container>
        {!!usersByChatGroup.length &&
          usersByChatGroup.map((ch: IUsersByChatGroup, idx: number) => {
            return (
              <ChatBio
                usersByChatGroup={ch}
                displayLanguage={false}
                key={idx}
              />
            )
          })}
      </Grid>
    </div>
  )
}

export default FavoriteChats

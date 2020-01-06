import React from 'react'
import { IUsersByChatGroup } from '../intercomponent-types'
import ChatBio from '../_shared/ChatBio'
import Grid from '@material-ui/core/Grid'

interface IOwnProps {
  usersByChatGroup: IUsersByChatGroup[]
}

const FavoriteChats: React.FC<IOwnProps> = ({ usersByChatGroup }) => {
  return (
    <div>
      <Grid container>
        {usersByChatGroup.map((ch: IUsersByChatGroup, idx: number) => {
          return (
            <ChatBio usersByChatGroup={ch} displayLanguage={false} key={idx} />
          )
        })}
      </Grid>
    </div>
  )
}

export default FavoriteChats

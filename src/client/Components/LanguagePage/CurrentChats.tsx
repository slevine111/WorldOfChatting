import React from 'react'
import { IUsersByChatGroup } from '../intercomponent-types'
import ChatBio from '../_shared/ChatBio'
import Typography from '@material-ui/core/Typography'

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
      {!!usersByChatGroup.length &&
        usersByChatGroup.map((ch: IUsersByChatGroup, idx: number) => {
          return (
            <ChatBio key={idx} usersByChatGroup={ch} displayLanguage={false} />
          )
        })}
    </div>
  )
}

export default FavoriteChats

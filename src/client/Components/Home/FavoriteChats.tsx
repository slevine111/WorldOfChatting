import React from 'react'
import { connect } from 'react-redux'
import { ReduxState } from '../../store'
import { IUsersByChatGroup } from '../intercomponent-types'
import { checkIfDataExists } from '../utilityfunctions'
import { getFavoriteChatGroupsOfUser } from './helperfunctions'
import ChatBio from '../_shared/ChatBio'
import Typography from '@material-ui/core/Typography'

interface IReduxStateProps {
  favoriteChatGroups: IUsersByChatGroup[]
}

interface IFavoriteChatsProps extends IReduxStateProps {}

const FavoriteChats: React.FC<IFavoriteChatsProps> = ({
  favoriteChatGroups
}) => {
  return (
    <div>
      <Typography variant="h6">My Favorite Chats</Typography>
      {favoriteChatGroups.length &&
        favoriteChatGroups.map((ch: IUsersByChatGroup, idx: number) => {
          return (
            <ChatBio key={idx} usersByChatGroup={ch} displayLanguage={true} />
          )
        })}
    </div>
  )
}

const mapStateToProps = ({
  users,
  chatGroups,
  userChatGroups
}: ReduxState): IReduxStateProps => {
  const dataExists: boolean = checkIfDataExists({
    objects: [],
    arrays: [users.myUsers, userChatGroups, Object.keys(chatGroups)]
  })
  if (!dataExists) return { favoriteChatGroups: [] }
  const favoriteChatGroups: IUsersByChatGroup[] = getFavoriteChatGroupsOfUser(
    users.myUsers,
    chatGroups,
    userChatGroups
  )
  return {
    favoriteChatGroups
  }
}

export default connect(mapStateToProps)(FavoriteChats)

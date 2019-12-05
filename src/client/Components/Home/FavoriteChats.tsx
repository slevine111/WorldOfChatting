import React from 'react'
import { connect } from 'react-redux'
import { ReduxState } from '../../store'
import { IUsersByChatGroup } from './shared-types'
import { getFavoriteChatGroupsOfUser } from './helperfunctions'
import ChatBio from './ChatBio'
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
          return <ChatBio key={idx} usersByChatGroup={ch} />
        })}
    </div>
  )
}

const mapStateToProps = ({
  users,
  chatGroups,
  userChatGroups
}: ReduxState): IReduxStateProps => {
  const favoriteChatGroups: IUsersByChatGroup[] = getFavoriteChatGroupsOfUser(
    users.myUsers,
    chatGroups,
    userChatGroups.myUserCGs
  )
  return {
    favoriteChatGroups
  }
}

export default connect(mapStateToProps)(FavoriteChats)

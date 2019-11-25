import React from 'react'
import { connect } from 'react-redux'
import { ReduxState } from '../../store'
import { IObjectOfUsers, IUsersByChatGroup } from './index'
import { getFavoriteChatGroupsOfUser } from './helperfunctions'
import DirectChat from './DirectChat'
import GroupChat from './GroupChat'
import Typography from '@material-ui/core/Typography'

interface IReduxStateProps {
  favoriteChatGroups: IUsersByChatGroup[]
}
interface IOwnProps {
  usersMap: IObjectOfUsers
}

interface IFavoriteChatsProps extends IReduxStateProps, IOwnProps {}

const FavoriteChats: React.FC<IFavoriteChatsProps> = ({
  favoriteChatGroups
}) => {
  return (
    <div>
      <Typography variant="h6">My Favorite Chats</Typography>

      {favoriteChatGroups.length &&
        favoriteChatGroups.map((ch: IUsersByChatGroup) => {
          if (ch.users.length > 1) {
            return <GroupChat usersByChatGroup={ch} />
          } else {
            return <DirectChat usersByChatGroup={ch} />
          }
        })}
    </div>
  )
}

const mapStateToProps = (
  { auth, chatGroups, userChatGroups }: ReduxState,
  { usersMap }: IOwnProps
): IReduxStateProps => {
  const favoriteChatGroups: IUsersByChatGroup[] = getFavoriteChatGroupsOfUser(
    auth.user,
    usersMap,
    chatGroups,
    userChatGroups
  )
  return {
    favoriteChatGroups
  }
}

export default connect(mapStateToProps)(FavoriteChats)

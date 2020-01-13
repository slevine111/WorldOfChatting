import React from 'react'
import { connect } from 'react-redux'
import { ReduxState } from '../../store'
import { IUsersByChatGroup } from '../intercomponent-types'
import { getFavoriteChatGroupsOfUser } from './helperfunctions'
import ChatBio from '../_shared/ChatBio'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'

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
      <Grid container>
        {!favoriteChatGroups.length && (
          <Typography variant="body1">
            You have no favorite chats. Go to your chats and add some!!
          </Typography>
        )}
        {favoriteChatGroups.length &&
          favoriteChatGroups.map((ch: IUsersByChatGroup, idx: number) => {
            return (
              <ChatBio key={idx} usersByChatGroup={ch} displayLanguage={true} />
            )
          })}
      </Grid>
    </div>
  )
}

const mapStateToProps = ({
  users,
  chatGroups,
  userChatGroups
}: ReduxState): IReduxStateProps => {
  const favoriteChatGroups: IUsersByChatGroup[] = getFavoriteChatGroupsOfUser(
    users.myUsers.data,
    chatGroups.data,
    userChatGroups.data
  )
  return {
    favoriteChatGroups
  }
}

export default connect(mapStateToProps)(FavoriteChats)

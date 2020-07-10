import React from 'react'
import { useSelector } from 'react-redux'
import { ReduxState } from '../shared/store/store.types'
import { INITIAL_SUBGROUPING_KEYS } from '../shared/store/constants'
import SingleChatOverview from '../shared/components/SingleChatOverview'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
const {
  chatGroups: { FAVORITE_CHAT_GROUPS_KEY },
} = INITIAL_SUBGROUPING_KEYS

const FavoriteChats: React.FC<{}> = ({}) => {
  const favoriteChatGroupIds: string[] = useSelector(
    ({ chatGroups }: ReduxState) =>
      chatGroups.subGroupings[FAVORITE_CHAT_GROUPS_KEY]
  )
  return (
    <Grid container>
      {!favoriteChatGroupIds.length && (
        <Typography variant="body1">
          You have no favorite chats. Go to your chats and add some!!
        </Typography>
      )}
      {!!favoriteChatGroupIds.length &&
        favoriteChatGroupIds.map((chatGroupId: string) => {
          return (
            <SingleChatOverview key={chatGroupId} chatGroupId={chatGroupId} />
          )
        })}
    </Grid>
  )
}

export default FavoriteChats

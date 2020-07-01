import React from 'react'
import { useSelector } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import AvatarTooltip from '../AvatarTooltip'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import { ReduxState } from '../../../store'
import { IReduxStoreUserFields } from '../../../../types-for-both-server-and-client'
import { getUsersOfChatGroup } from './helperfunctions'

const styles = makeStyles({
  itemBottomMargin: {
    marginBottom: '10px',
  },
})

const SingleChatOverview: React.FC<
  { chatGroupId: string } & RouteComponentProps
> = ({ chatGroupId, history }) => {
  const users: IReduxStoreUserFields[] = useSelector((state: ReduxState) => {
    return getUsersOfChatGroup(state, chatGroupId)
  })
  const { name } = useSelector(
    (state: ReduxState) => state.chatGroups.byId[chatGroupId]
  )
  const { itemBottomMargin } = styles()
  const isGroupChat: boolean = users.length > 1
  return (
    <Grid item xs={6} sm={4} className={itemBottomMargin}>
      <AvatarTooltip
        userSingleOrArray={users.length === 1 ? users[0] : users}
        onButtonClick={() => history.push(`/chat/${chatGroupId}`)}
        chatGroupId={chatGroupId}
      />
      <Typography variant="body1">
        <em>
          {isGroupChat
            ? `${name || `${users[0].fullName} & ${users.length - 1} more`}`
            : users[0].fullName}
        </em>
      </Typography>
    </Grid>
  )
}

export default withRouter(SingleChatOverview)

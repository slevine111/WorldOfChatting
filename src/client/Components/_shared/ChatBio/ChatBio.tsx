import React from 'react'
import { useSelector } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import PersonCircle from '../PersonCircle'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import { ReduxState } from '../../../store'
import { OnlineStatuses } from '../../../../entities/User'
import { IReduxStoreUserFields } from '../../../../types-for-both-server-and-client'
import { getUsersOfChatGroup } from './helperfunctions'

interface IOwnProps {
  chatGroupId: string
  displayLanguage: boolean
}

const styles = makeStyles({
  itemBottomMargin: {
    marginBottom: '10px',
  },
  badgeRightMargin: {
    marginRight: '5px',
  },
})

const ChatBio: React.FC<IOwnProps & RouteComponentProps> = ({
  chatGroupId,
  history,
  displayLanguage,
}) => {
  const users: IReduxStoreUserFields[] = useSelector((state: ReduxState) => {
    return getUsersOfChatGroup(state, chatGroupId)
  })
  const { language, name } = useSelector(
    (state: ReduxState) => state.chatGroups.byId[chatGroupId]
  )
  const { itemBottomMargin, badgeRightMargin } = styles()
  const groupChat: boolean = users.length > 1
  const numberUsersOnline: number = users.reduce(
    (sum, user) => sum + Number(user.onlineStatus !== OnlineStatuses.OFFLINE),
    0
  )
  return (
    <Grid item xs={6} sm={4} className={itemBottomMargin}>
      {users.slice(0, 3).map((user) => {
        return (
          <PersonCircle
            user={user}
            key={user.id}
            onButtonClick={() => history.push('/about')}
            className={badgeRightMargin}
          />
        )
      })}

      {!groupChat && (
        <Typography variant="body1">{users[0].fullName}</Typography>
      )}
      {groupChat && (
        <Typography variant="body1">
          {name || `${users[0].fullName} & ${users.length - 1} more`}
        </Typography>
      )}
      {groupChat && (
        <Typography variant="body1">{`${numberUsersOnline}/${users.length} online`}</Typography>
      )}
      {displayLanguage && (
        <Typography variant="body1">
          <em>{language}</em>
        </Typography>
      )}
    </Grid>
  )
}

export default withRouter(ChatBio)

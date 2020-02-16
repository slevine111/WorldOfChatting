import React from 'react'
import { useSelector } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import Typography from '@material-ui/core/Typography'
import Badge from '@material-ui/core/Badge'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import styles from './styles'
import { ReduxState } from '../../../store'
import { IReduxStoreUserFields } from '../../../../types-for-both-server-and-client'
import { getUsersOfChatGroup } from './helperfunctions'

interface IOwnProps {
  chatGroupId: string
  displayLanguage: boolean
}

const ChatBio: React.FC<IOwnProps & RouteComponentProps> = ({
  chatGroupId,
  history,
  displayLanguage
}) => {
  const users: IReduxStoreUserFields[] = useSelector((state: ReduxState) => {
    return getUsersOfChatGroup(state, chatGroupId)
  })
  const { language, name } = useSelector(
    (state: ReduxState) => state.chatGroups.byId[chatGroupId]
  )
  const {
    loggedInBadge,
    loggedOutBadge,
    dot,
    avatarColor,
    itemBottomMargin,
    badgeRightMargin
  } = styles()
  const groupChat: boolean = users.length > 1
  const numberUsersOnline: number = users.reduce(
    (sum, user) => sum + Number(user.loggedIn),
    0
  )
  return (
    <Grid item xs={6} sm={4} className={itemBottomMargin}>
      {users.slice(0, 3).map((user, idx) => {
        const { loggedIn, firstName, lastName, id } = user
        return (
          <Badge
            key={id}
            overlap="circle"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            variant="dot"
            className={badgeRightMargin}
            classes={{
              badge: loggedIn ? loggedInBadge : loggedOutBadge,
              dot
            }}
          >
            <Avatar className={avatarColor}>
              {idx === 0 && (
                <Button onClick={() => history.push('/about')}>
                  {`${firstName[0]}${lastName[0]}`}
                </Button>
              )}
              {idx !== 0 && `${firstName[0]}${lastName[0]}`}
            </Avatar>{' '}
          </Badge>
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

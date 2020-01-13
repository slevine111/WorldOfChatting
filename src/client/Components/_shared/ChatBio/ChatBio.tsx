import React from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { IUsersByChatGroup } from '../../intercomponent-types'
import Typography from '@material-ui/core/Typography'
import Badge from '@material-ui/core/Badge'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import styles from './styles'

interface IOwnProps {
  usersByChatGroup: IUsersByChatGroup
  displayLanguage: boolean
}

interface IChatBioProps extends IOwnProps, RouteComponentProps {}

const ChatBio: React.FC<IChatBioProps> = ({
  usersByChatGroup,
  history,
  displayLanguage
}) => {
  const {
    loggedInBadge,
    loggedOutBadge,
    dot,
    avatarColor,
    itemBottomMargin,
    badgeRightMargin
  } = styles()
  const { users, language, name } = usersByChatGroup
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

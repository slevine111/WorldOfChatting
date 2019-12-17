import React from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { IUsersByChatGroup } from '../../intercomponent-types'
import Typography from '@material-ui/core/Typography'
import Badge from '@material-ui/core/Badge'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
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
    blockDisplay,
    avatarColor
  } = styles()
  const { users, language, name } = usersByChatGroup
  if (!users || !users[0] || users.includes(undefined))
    return <div>not ready</div>
  const { loggedIn, firstName, lastName, fullName } = users[0]
  const groupChat: boolean = users.length > 1
  const numberUsersOnline: number = users.reduce(
    (sum, user) => sum + Number(user.loggedIn),
    0
  )
  return (
    <div>
      <Badge
        overlap="circle"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        variant="dot"
        classes={
          groupChat
            ? {}
            : {
                badge: loggedIn ? loggedInBadge : loggedOutBadge,
                dot
              }
        }
      >
        <Avatar className={avatarColor}>
          <Button onClick={() => history.push('/about')}>
            {groupChat ? users.length : `${firstName[0]}${lastName[0]}`}
          </Button>
        </Avatar>{' '}
      </Badge>
      <Typography variant="body1">
        {!groupChat && <b className={blockDisplay}>{fullName}</b>}
        {groupChat && (
          <em className={blockDisplay}>
            {name || `${fullName} & ${users.length - 1} more`}
          </em>
        )}
        {groupChat && (
          <em
            className={blockDisplay}
          >{`${numberUsersOnline}/${users.length} online`}</em>
        )}
        {displayLanguage && <em>{language}</em>}
      </Typography>
    </div>
  )
}

export default withRouter(ChatBio)

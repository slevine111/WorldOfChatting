import React from 'react'
import { IUsersByChatGroup } from './index'
import Typography from '@material-ui/core/Typography'
import Badge from '@material-ui/core/Badge'
import Avatar from '@material-ui/core/Avatar'
import styles from './styles'

interface IOwnProps {
  usersByChatGroup: IUsersByChatGroup
}

interface IDirectChatProps extends IOwnProps {}

const DirectChat: React.FC<IDirectChatProps> = ({ usersByChatGroup }) => {
  const { loggedInBadge, loggedOutBadge, dot } = styles()
  const { users } = usersByChatGroup
  const { loggedIn, firstName, lastName } = users[0]
  return (
    <div>
      <Badge
        overlap="circle"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        variant="dot"
        classes={{
          badge: loggedIn ? loggedInBadge : loggedOutBadge,
          dot
        }}
      >
        <Avatar>{`${firstName[0]}${lastName[0]}`}</Avatar>{' '}
      </Badge>
      <Typography variant="body1">{`${firstName} ${lastName}`}</Typography>
    </div>
  )
}

export default DirectChat

import React from 'react'
import { IReduxStoreUserFields } from '../../../../types-for-both-server-and-client'
import { OnlineStatuses } from '../../../../entities/User'
import Avatar from '@material-ui/core/Avatar'
import Badge from '@material-ui/core/Badge'
import styles from './styles'

const AvatarDirectChat: React.FC<{ user: IReduxStoreUserFields }> = ({
  user,
}) => {
  const { dot, loggedInBadge, loggedOutBadge, avatarColor } = styles()
  return (
    <Badge
      overlap="circle"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      variant="dot"
      classes={{
        badge:
          user.onlineStatus !== OnlineStatuses.OFFLINE
            ? loggedInBadge
            : loggedOutBadge,
        dot,
      }}
    >
      <Avatar
        className={avatarColor}
      >{`${user.firstName[0]}${user.lastName[0]}`}</Avatar>
    </Badge>
  )
}

export default AvatarDirectChat

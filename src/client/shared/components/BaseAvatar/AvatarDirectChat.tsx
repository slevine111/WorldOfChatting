import React from 'react'
import { User } from '../../../../entities'
import { IReduxStoreUserFields } from '../../../../types-for-both-server-and-client'
import { OnlineStatuses } from '../../../../entities/User'
import Avatar from '@material-ui/core/Avatar'
import Badge from '@material-ui/core/Badge'
import styles from './styles'

const AvatarDirectChat: React.FC<{
  user: IReduxStoreUserFields | User
  className?: string
  ownStyles?: Record<string, string>
}> = ({ user, className = '', ownStyles = {} }) => {
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
        className={className}
        style={ownStyles}
      >{`${user.firstName[0]}${user.lastName[0]}`}</Avatar>
    </Badge>
  )
}

export default AvatarDirectChat

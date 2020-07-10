import React from 'react'
import { IReduxStoreUserFields } from '../../../../types-for-both-server-and-client'
import { OnlineStatuses } from '../../../../entities/User'
import Avatar from '@material-ui/core/Avatar'
import Badge from '@material-ui/core/Badge'
import styles from './styles'

const AvatarsGroupChat: React.FC<{ users: IReduxStoreUserFields[] }> = ({
  users,
}) => {
  const {
    dot,
    loggedInBadge,
    loggedOutBadge,
    avatarColor,
    badgeRightMargin,
  } = styles()
  return (
    <span>
      {users.slice(0, 3).map((user) => {
        return (
          <Badge
            key={user.id}
            overlap="circle"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            variant="dot"
            className={badgeRightMargin}
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
      })}
    </span>
  )
}

export default AvatarsGroupChat

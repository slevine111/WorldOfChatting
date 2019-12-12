import React from 'react'
import Typography from '@material-ui/core/Typography'
import Badge from '@material-ui/core/Badge'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import styles from '../_shared/ChatBio/styles'
import { IUserWithLanguageFields } from './shared-types'

interface IOwnProps {
  usersOfLanguage: IUserWithLanguageFields[]
  setSelectedUser: (user: IUserWithLanguageFields) => void
}

const PersonIconList: React.FC<IOwnProps> = ({
  usersOfLanguage,
  setSelectedUser
}) => {
  const {
    loggedInBadge,
    loggedOutBadge,
    dot,
    blockDisplay,
    avatarColor
  } = styles()
  if (!Array.isArray(usersOfLanguage)) return <div>not ready</div>
  return (
    <div>
      {usersOfLanguage.map(user => {
        const { loggedIn, firstName, lastName, userType, id, fullName } = user
        return (
          <div key={id}>
            <Badge
              overlap="circle"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="dot"
              classes={{
                badge: loggedIn ? loggedInBadge : loggedOutBadge,
                dot
              }}
            >
              <Avatar className={avatarColor}>
                <Button
                  onClick={() => setSelectedUser(user)}
                >{`${firstName[0]}${lastName[0]}`}</Button>
              </Avatar>{' '}
            </Badge>
            <Typography variant="body1">
              <b className={blockDisplay}>{fullName}</b>
              <b className={blockDisplay}>{userType}</b>
            </Typography>
          </div>
        )
      })}
    </div>
  )
}

export default PersonIconList

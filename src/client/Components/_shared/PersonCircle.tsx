import React from 'react'
import { IReduxStoreUserFields } from '../../../types-for-both-server-and-client'
import { OnlineStatuses } from '../../../entities/User'
import ProfileSnippet from './ProfileSnippet'
import Badge from '@material-ui/core/Badge'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import { makeStyles } from '@material-ui/core/styles'

const styles = makeStyles(() => {
  const boxShadow: string = '0 0 0 2px #fff'
  return {
    loggedInBadge: {
      backgroundColor: 'green',
      boxShadow,
    },
    loggedOutBadge: {
      backgroundColor: 'red',
      boxShadow,
    },
    dot: { height: '10px', minWidth: '10px' },
    blockDisplay: { display: 'block' },
    avatarColor: { backgroundColor: 'dodgerblue' },
    itemBottomMargin: {
      marginBottom: '10px',
    },
    badgeRightMargin: {
      marginRight: '5px',
    },
  }
})

const PersonCircle: React.FC<{
  user: IReduxStoreUserFields
  onButtonClick: () => void
  className?: string
}> = ({ user, onButtonClick, className }) => {
  const { loggedInBadge, loggedOutBadge, dot, avatarColor } = styles()
  const { firstName, lastName, onlineStatus } = user
  return (
    <Tooltip
      title={
        <ProfileSnippet
          userChattingWithLoggedInUser={true}
          {...{ user, onButtonClick }}
        />
      }
    >
      <Badge
        overlap="circle"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        variant="dot"
        className={className || ''}
        classes={{
          badge:
            onlineStatus !== OnlineStatuses.OFFLINE
              ? loggedInBadge
              : loggedOutBadge,
          dot,
        }}
      >
        <Avatar
          className={avatarColor}
          onMouseOver={() => console.log('hovering')}
        >
          {`${firstName[0]}${lastName[0]}`}
        </Avatar>{' '}
      </Badge>
    </Tooltip>
  )
}

export default PersonCircle

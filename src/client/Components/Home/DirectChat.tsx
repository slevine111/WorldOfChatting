import React from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { IUsersByChatGroup } from './index'
import Typography from '@material-ui/core/Typography'
import Badge from '@material-ui/core/Badge'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import styles from './styles'

interface IOwnProps {
  usersByChatGroup: IUsersByChatGroup
}

interface IDirectChatProps extends IOwnProps, RouteComponentProps {}

const DirectChat: React.FC<IDirectChatProps> = ({
  usersByChatGroup,
  history
}) => {
  const { loggedInBadge, loggedOutBadge, dot } = styles()
  const { users, language } = usersByChatGroup
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
        <Avatar style={{ backgroundColor: 'dodgerblue' }}>
          <Button
            onClick={() => history.push('/about')}
          >{`${firstName[0]}${lastName[0]}`}</Button>
        </Avatar>{' '}
      </Badge>
      <Typography variant="body1">
        <div>
          <b>{`${firstName} ${lastName}`}</b>
        </div>{' '}
        <em>{language}</em>
      </Typography>
    </div>
  )
}

export default withRouter(DirectChat)

import React from 'react'
import { IUsersByChatGroup } from './index'
import Typography from '@material-ui/core/Typography'
import Badge from '@material-ui/core/Badge'
import Avatar from '@material-ui/core/Avatar'

interface IOwnProps {
  usersByChatGroup: IUsersByChatGroup
}

interface IGroupChatProps extends IOwnProps {}

const GroupChat: React.FC<IGroupChatProps> = ({ usersByChatGroup }) => {
  const { users, language } = usersByChatGroup
  return (
    <div>
      <Badge
        overlap="circle"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        variant="dot"
      >
        <Avatar>{users.length}</Avatar>{' '}
      </Badge>
      <Typography variant="body1">
        {' '}
        <div>
          <b>
            {' '}
            {`${users[0].firstName} ${users[0].lastName} & ${users.length -
              1} more`}
          </b>
        </div>{' '}
        <em>{language}</em>
      </Typography>
    </div>
  )
}

export default GroupChat

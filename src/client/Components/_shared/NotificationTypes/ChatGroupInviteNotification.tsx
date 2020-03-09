import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ReduxState } from '../../../store'
import { chatGroupRequestAcceptedThunk } from '../../../store/APIRequestsHandling/multiplereducerthunks'
import { getNotificationAndSenderInfo } from './helperfunctions'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

const ChatGroupInviteNotification: React.FC<{ notificationId: string }> = ({
  notificationId
}) => {
  const {
    notification,
    user
  } = useSelector(({ notifications, users }: ReduxState) =>
    getNotificationAndSenderInfo(notificationId, notifications.byId, users.byId)
  )
  const dispatch = useDispatch()
  const { createdAt, id, senderId } = notification
  return (
    <div>
      <Typography variant="body1">{user.fullName}</Typography>
      <Typography variant="body1">{createdAt}</Typography>
      <Button
        onClick={() =>
          dispatch(
            chatGroupRequestAcceptedThunk(id, 'dsf', [senderId, user.id])
          )
        }
      >
        Accept
      </Button>
      <Button>Reject</Button>
    </div>
  )
}

export default ChatGroupInviteNotification

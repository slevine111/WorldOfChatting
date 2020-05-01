import React, { Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ReduxState } from '../../store/index'
import {
  chatGroupRequestAcceptedThunk,
  chatGroupRequestDeclinedThunk,
} from '../../store/APIRequestsHandling/multiplereducerthunks'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Divider from '@material-ui/core/Divider'
import styles from './styles'

const ChatGroupInvites: React.FC<{}> = () => {
  const { containedSizeSmall, chatGroupInvite, acceptedButton } = styles()
  const dispatch = useDispatch()
  const { chatGroupInvites, users, loggedInUserId } = useSelector(
    ({ chatGroupInvites, users, auth }: ReduxState) => ({
      chatGroupInvites,
      users,
      loggedInUserId: auth.user.id,
    })
  )
  const { byId, allIds } = chatGroupInvites
  return (
    <List>
      {allIds.map((id) => {
        const { senderUserId } = byId[id]
        const { fullName } = users.byId[senderUserId]

        return (
          <Fragment key={id}>
            <ListItem>
              <div className={chatGroupInvite}>
                <div>
                  <Typography variant="body1">{fullName}</Typography>
                  <Typography variant="caption">Language</Typography>
                </div>
                <div>
                  <Button
                    size="small"
                    color="primary"
                    variant="contained"
                    classes={{ containedSizeSmall }}
                    className={acceptedButton}
                    onClick={() =>
                      dispatch(
                        chatGroupRequestAcceptedThunk(
                          { directChat: true },
                          senderUserId,
                          loggedInUserId,
                          id
                        )
                      )
                    }
                  >
                    Accept
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    classes={{ containedSizeSmall }}
                    onClick={() =>
                      dispatch(
                        chatGroupRequestDeclinedThunk(
                          senderUserId,
                          loggedInUserId,
                          id
                        )
                      )
                    }
                  >
                    Decline
                  </Button>
                </div>
              </div>
            </ListItem>
            <Divider />
          </Fragment>
        )
      })}
    </List>
  )
}

export default ChatGroupInvites

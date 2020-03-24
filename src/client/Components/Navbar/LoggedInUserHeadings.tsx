import React, { Fragment, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ReduxState } from '../../store/index'
import { logoutUserProcessThunk } from '../../store/APIRequestsHandling/multiplereducerthunks'
import Button from '@material-ui/core/Button'
import Popover from '@material-ui/core/Popover'
import PeopleIcon from '@material-ui/icons/People'
//import NotificationsIcon from '@material-ui/icons/Notifications'
import IconButton from '@material-ui/core/IconButton'
import Badge from '@material-ui/core/Badge'
import styles from './styles'
import ChatGroupInvites from './ChatGroupInvites'

const LoggedInUserHeadings: React.FC<{}> = () => {
  const { buttonStyle, modals, inheritColor, defaultColor } = styles()
  const [cgInviteIconClicked, setCgInviteIconClicked] = useState(false)
  const [anchorEl, setAnchorEl] = useState<
    null | (EventTarget & HTMLButtonElement)
  >(null)
  const dispatch = useDispatch()
  const userId: string = useSelector((state: ReduxState) => state.auth.user.id)
  const numberChatGroupInvites: number = useSelector(
    (state: ReduxState) => state.chatGroupInvites.allIds.length
  )
  return (
    <Fragment>
      <IconButton
        onClick={event => {
          setAnchorEl(event.currentTarget)
          setCgInviteIconClicked(true)
        }}
        className={cgInviteIconClicked ? inheritColor : defaultColor}
      >
        {numberChatGroupInvites > 0 ? (
          <Badge badgeContent={numberChatGroupInvites} color="secondary">
            <PeopleIcon />
          </Badge>
        ) : (
          <PeopleIcon />
        )}
      </IconButton>
      {/* <Button
        className={buttonStyle}
        onClick={event => setAnchorEl(event.currentTarget)}
      >
        Chats
     </Button>*/}
      <Popover
        classes={{ paper: modals }}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        onClose={() => {
          setAnchorEl(null)
          setCgInviteIconClicked(false)
        }}
      >
        <ChatGroupInvites />
      </Popover>
      <Button
        className={buttonStyle}
        onClick={() =>
          dispatch(logoutUserProcessThunk(userId, { loggedIn: false }))
        }
      >
        Logout
      </Button>
      <Button>Notifications</Button>
    </Fragment>
  )
}

export default LoggedInUserHeadings

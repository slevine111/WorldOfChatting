import React, { Fragment, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ReduxState } from '../../store/index'
import { logoutUserProcessThunk } from '../../store/APIRequestsHandling/multiplereducerthunks'
import { NOT_SEEN } from '../../store/notification/types'
import { notificationIconClickedOnThunk } from '../../store/notification/actions'
import Button from '@material-ui/core/Button'
import PeopleIcon from '@material-ui/icons/People'
import NotificationsIcon from '@material-ui/icons/Notifications'
import styles from './styles'
import ChatGroupInvites from './ChatGroupInvites'
import NotificationsDisplay from './NotificationsDisplay'
import IconHeaderHOC from './IconHeaderHOC'

const ChatGroupInvitesHeader = IconHeaderHOC(PeopleIcon, ChatGroupInvites)
const NotificationsHeader = IconHeaderHOC(
  NotificationsIcon,
  NotificationsDisplay
)

const LoggedInUserHeadings: React.FC<{}> = () => {
  const { buttonStyle } = styles()
  const [cgInviteIconClicked, setCgInviteIconClicked] = useState(false)
  const [notificationIconClicked, setNotificationIconClicked] = useState(false)
  const [anchorEl, setAnchorEl] = useState<
    null | (EventTarget & HTMLButtonElement)
  >(null)
  const [notificationEl, setNotificationEl] = useState<
    null | (EventTarget & HTMLButtonElement)
  >(null)

  const dispatch = useDispatch()
  const userId: string = useSelector((state: ReduxState) => state.auth.user.id)
  const numberChatGroupInvites: number = useSelector(
    (state: ReduxState) => state.chatGroupInvites.allIds.length
  )
  const notificationsState = useSelector(
    (state: ReduxState) => state.notifications
  )
  const {
    subGroupings: { [NOT_SEEN]: notSeenNts },
  } = notificationsState

  const onChatGroupInviteIconClicked = (event: any): void => {
    setAnchorEl(event.currentTarget)
    setCgInviteIconClicked(true)
  }
  const onChatGroupCloseDisplay = (): void => {
    setAnchorEl(null)
    setCgInviteIconClicked(false)
  }

  const onNtIconClicked = (event: any): void => {
    setNotificationEl(event.currentTarget)
    setNotificationIconClicked(true)
    if (notSeenNts.length) {
      dispatch(notificationIconClickedOnThunk(notificationsState))
    }
  }
  const onNtCloseDisplay = (): void => {
    setNotificationEl(null)
    setNotificationIconClicked(false)
  }

  return (
    <Fragment>
      <ChatGroupInvitesHeader
        numberDisplay={numberChatGroupInvites}
        onIconClick={onChatGroupInviteIconClicked}
        iconCurrentlyClickedOn={cgInviteIconClicked}
        displayElement={anchorEl}
        onCloseDisplay={onChatGroupCloseDisplay}
      />

      <Button
        className={buttonStyle}
        onClick={() => dispatch(logoutUserProcessThunk(userId))}
      >
        Logout
      </Button>
      <NotificationsHeader
        numberDisplay={notSeenNts.length}
        onIconClick={onNtIconClicked}
        iconCurrentlyClickedOn={notificationIconClicked}
        displayElement={notificationEl}
        onCloseDisplay={onNtCloseDisplay}
      />
    </Fragment>
  )
}

export default LoggedInUserHeadings

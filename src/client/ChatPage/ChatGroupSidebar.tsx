import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { ReduxState } from '../shared/store/store.types'
import { INITIAL_SUBGROUPING_KEYS } from '../shared/store/constants'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import SettingsIcon from '@material-ui/icons/Settings'
import IconButton from '@material-ui/core/IconButton'
import Popover from '@material-ui/core/Popover'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import globalstyles, { SMALL_AVATAR } from '../shared/styles/globalstyles'
import { ITextFields } from './shared-types'
import {
  getTextDisplayChatGroupWithMessage,
  getTextDisplayChatGroupNoMessage,
} from './helperfunctions'
import { sidebarStyles, commonStyles } from './styles'
import { chatGroupClickedOnThunk } from './thunks'
const {
  chatGroups: {
    CHAT_GROUPS_NOT_SEEN_LAST_MESSAGE_KEY,
    CHAT_GROUPS_NO_MESSAGES_KEY,
    CHAT_GROUPS_WITH_MESSAGES_KEY,
  },
} = INITIAL_SUBGROUPING_KEYS

const sidebarDisplayOptions: Record<
  string,
  { header: string; noMatchingGroupText: string }
> = {
  ALL_CHATS: {
    header: 'All Chats',
    noMatchingGroupText: 'You are not chatting with nyone. Go start chatting!',
  },
  UNREAD_CHATS: {
    header: 'Unread Chats',
    noMatchingGroupText: 'You have no unread chats!',
  },
  ACCEPTED: {
    header: 'Accepted',
    noMatchingGroupText:
      'You have no accepted group chats with the conversation not started!',
  },
}

const ChatGroupSidebar: React.FC<
  RouteComponentProps<{ chatGroupId?: string }> & { currentChatGroupId: string }
> = ({
  match: {
    params: { chatGroupId },
  },
  history,
  currentChatGroupId,
}) => {
  globalstyles()
  const {
    top: sidebarTop,
    singleChatGroup,
    selectedChatGroup,
    singleChatGroupTextItem,
    singleChatGroupTextItemTop,
    sidebarDense,
    iconButtonRoot,
    svgIconRoot,
  } = sidebarStyles()
  const { flexContainer, subHeading } = commonStyles()

  const [currentOption, setOption] = useState('ALL_CHATS')
  const [anchorEl, setAnchorEl] = useState<
    null | (EventTarget & HTMLButtonElement)
  >(null)
  const {
    chatGroupState,
    messageState,
    userCGState,
    users,
    loggedInUserId,
  } = useSelector((state: ReduxState) => ({
    chatGroupState: state.chatGroups,
    messageState: state.messages,
    userCGState: state.userChatGroups,
    users: state.users.byId,
    loggedInUserId: state.auth.user.id,
  }))
  const dispatch = useDispatch()
  let chatGroupsDisplay: string[]
  if (currentOption === 'ALL_CHATS') {
    chatGroupsDisplay =
      chatGroupState.subGroupings[CHAT_GROUPS_WITH_MESSAGES_KEY]
  } else if (currentOption === 'UNREAD_CHATS') {
    chatGroupsDisplay =
      chatGroupState.subGroupings[CHAT_GROUPS_NOT_SEEN_LAST_MESSAGE_KEY]
  } else {
    chatGroupsDisplay = chatGroupState.subGroupings[CHAT_GROUPS_NO_MESSAGES_KEY]
  }

  return (
    <div className={flexContainer}>
      <div className={subHeading}>
        <div className={sidebarTop}>
          <Typography variant="h5">
            {sidebarDisplayOptions[currentOption].header}
          </Typography>
          <IconButton
            classes={{ root: iconButtonRoot }}
            onClick={(event) =>
              setAnchorEl(anchorEl === null ? event.currentTarget : null)
            }
          >
            <SettingsIcon classes={{ root: svgIconRoot }} />
          </IconButton>
          <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
            onClose={() => setAnchorEl(null)}
          >
            <List>
              {Object.keys(sidebarDisplayOptions).map((option) => {
                if (option !== currentOption) {
                  return (
                    <ListItem
                      button
                      key={option}
                      dense={true}
                      classes={{ dense: sidebarDense }}
                      onClick={() => setOption(option)}
                    >
                      <ListItemText>
                        {sidebarDisplayOptions[option].header}
                      </ListItemText>{' '}
                    </ListItem>
                  )
                }
              })}
            </List>
          </Popover>
        </div>
      </div>

      <div style={{ overflow: 'scroll' }}>
        {chatGroupsDisplay.length === 0 && (
          <Typography variant="body2">
            {sidebarDisplayOptions[currentOption].noMatchingGroupText}
          </Typography>
        )}

        {chatGroupsDisplay.length > 0 &&
          chatGroupsDisplay.map((id) => {
            const { seenLastMessage } = chatGroupState.byId[id]
            const fontWeight = seenLastMessage ? 'normal' : 'bold'
            const color: string = seenLastMessage ? 'gray' : 'black'

            let textFields: ITextFields
            if (currentOption !== 'ACCEPTED') {
              textFields = getTextDisplayChatGroupWithMessage(
                id,
                chatGroupState.byId,
                messageState,
                userCGState,
                users
              )
            } else {
              textFields = getTextDisplayChatGroupNoMessage(
                id,
                chatGroupState.byId,
                userCGState,
                users
              )
            }
            return (
              <div
                key={id}
                className={`${singleChatGroup} ${
                  id === currentChatGroupId ? selectedChatGroup : ''
                }`}
                onClick={() => {
                  if (
                    chatGroupId &&
                    id === currentChatGroupId &&
                    !chatGroupState.byId[id].seenLastMessage
                  ) {
                    dispatch(
                      chatGroupClickedOnThunk(
                        loggedInUserId,
                        id,
                        messageState,
                        chatGroupState.byId[id]
                      )
                    )
                  } else {
                    history.push({
                      pathname: `/chat/${id}`,
                      state: { chatGroupClickedOn: true },
                    })
                  }
                }}
              >
                <Avatar className={SMALL_AVATAR}>{textFields.avatar}</Avatar>
                <div className={singleChatGroupTextItem}>
                  <div className={singleChatGroupTextItemTop}>
                    <Typography variant="body2" style={{ fontWeight }}>
                      {textFields.header}
                    </Typography>
                    <Typography
                      variant="body2"
                      style={{ fontSize: '.8rem', fontWeight }}
                    >
                      <em>{textFields.datetime}</em>
                    </Typography>
                  </div>
                  <Typography variant="caption" style={{ color, fontWeight }}>
                    {textFields.body}
                  </Typography>
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default withRouter(ChatGroupSidebar)

import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'
import { StaticContext } from 'react-router'
import { ReduxState } from '../../store'
import { CHAT_GROUPS_WITH_MESSAGES_KEY } from '../../store/chatgroup/helperfunctions'
import { chatGroupClickedOnThunk } from '../../store/APIRequestsHandling/multiplereducerthunks'
import ChatGroupSidebar from './ChatGroupSidebar'
import CurrentChat from './CurrentChat'
import Grid from '@material-ui/core/Grid'

const ChatPage: React.FC<RouteComponentProps<
  {
    chatGroupId?: string
  },
  StaticContext,
  { chatGroupClickedOn?: boolean }
>> = ({
  match: {
    params: { chatGroupId },
  },
  location: { state },
}) => {
  const chatGroupClickedOn = state ? state.chatGroupClickedOn : undefined
  console.log(chatGroupClickedOn)
  const dispatch = useDispatch()
  const {
    loggedInUserId,
    mostRecentChat,
    messageReducerState,
    chatGroupsById,
  } = useSelector((state: ReduxState) => {
    return {
      loggedInUserId: state.auth.user.id,
      mostRecentChat:
        state.chatGroups.subGroupings[CHAT_GROUPS_WITH_MESSAGES_KEY][0],
      messageReducerState: state.messages,
      chatGroupsById: state.chatGroups.byId,
    }
  })
  const currentChatGroupId: string = chatGroupId || mostRecentChat
  console.log(currentChatGroupId)

  useEffect(() => {
    if (
      chatGroupClickedOn &&
      !chatGroupsById[currentChatGroupId].seenLastMessage
    ) {
      dispatch(
        chatGroupClickedOnThunk(
          loggedInUserId,
          currentChatGroupId,
          messageReducerState,
          chatGroupsById[currentChatGroupId]
        )
      )
    }
  }, [`${currentChatGroupId}${chatGroupClickedOn}`])
  return (
    <Grid container>
      <Grid item xs={3}>
        <ChatGroupSidebar currentChatGroupId={currentChatGroupId} />
      </Grid>
      <Grid
        item
        xs={9}
        style={{
          backgroundColor: 'rgba(211,211,211,.3)',
        }}
      >
        <CurrentChat currentChatGroupId={currentChatGroupId} />
      </Grid>
    </Grid>
  )
}

export default ChatPage

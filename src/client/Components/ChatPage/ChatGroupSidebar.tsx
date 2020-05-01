import React from 'react'
import { useSelector } from 'react-redux'
import { ReduxState } from '../../store'
import { CHAT_GROUP_KEY_PREFIX } from '../../store/common'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import globalstyles, { SMALL_AVATAR } from '../globalstyles'

const ChatGroupSidebar: React.FC<{}> = () => {
  globalstyles()
  const { chatGroupState, messageState, userCGState, users } = useSelector(
    (state: ReduxState) => ({
      chatGroupState: state.chatGroups,
      messageState: state.messages,
      userCGState: state.userChatGroups,
      users: state.users.byId,
    })
  )

  return (
    <div>
      <Typography variant="h5">Chats</Typography>
      {chatGroupState.allIds.map((id) => {
        const subGroupingPrefix: string = `${CHAT_GROUP_KEY_PREFIX}${id}`
        const chatGroupMessageIds: string[] | undefined =
          messageState.subGroupings[subGroupingPrefix]
        if (chatGroupMessageIds !== undefined) {
          const userCGPrefix: string = `${CHAT_GROUP_KEY_PREFIX}${id}`
          const chatGroupUserIds: string[] =
            userCGState.subGroupings[userCGPrefix]
          const { userId } = userCGState.byId[chatGroupUserIds[0]]
          const { body: messageText } = messageState.byId[
            chatGroupMessageIds[0]
          ]
          const { fullName, firstName, lastName } = users[userId]

          return (
            <div key={id} style={{ display: 'flex', marginBottom: '5%' }}>
              <Avatar
                className={SMALL_AVATAR}
              >{`${firstName[0]}${lastName[0]}`}</Avatar>{' '}
              <div
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                <Typography variant="body2">{fullName}</Typography>
                <Typography variant="caption">{`${
                  chatGroupUserIds.length > 1 ? `${firstName}: ` : ''
                }${messageText}`}</Typography>
              </div>
            </div>
          )
        }
      })}
    </div>
  )
}

export default ChatGroupSidebar

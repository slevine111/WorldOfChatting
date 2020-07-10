import React from 'react'
import { useSelector } from 'react-redux'
import { ReduxState } from '../../shared/store/store.types'
import { CHAT_GROUP_KEY_PREFIX } from '../../shared/store/constants'
import AvatarGroup from '@material-ui/lab/AvatarGroup'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import { generateChatGroupDisplayName } from './helperfucntions'

const styles = makeStyles({
  avatar: {
    width: '34px',
    height: '34px',
    fontSize: '.8rem',
  },
  chatGroupDisplayNameStyle: { marginLeft: '10px' },
})

const ChatHeader: React.FC<{ currentChatId: string }> = ({ currentChatId }) => {
  const { avatar, chatGroupDisplayNameStyle } = styles()
  const {
    chatGroupName,
    userChatGroupsById,
    userChatGroupIds,
    usersById,
  } = useSelector((state: ReduxState) => {
    return {
      chatGroupName: state.chatGroups.byId[currentChatId].name,
      userChatGroupsById: state.userChatGroups.byId,
      userChatGroupIds:
        state.userChatGroups.subGroupings[
          `${CHAT_GROUP_KEY_PREFIX}${currentChatId}`
        ],
      usersById: state.users.byId,
    }
  })
  return (
    <div style={{ display: 'flex' }}>
      <AvatarGroup classes={{ avatar }} max={3}>
        {userChatGroupIds.map((ucgId) => {
          const user = usersById[userChatGroupsById[ucgId].userId]
          return (
            <Avatar
              key={ucgId}
            >{`${user.firstName[0]}${user.lastName[0]}`}</Avatar>
          )
        })}
      </AvatarGroup>
      <Typography variant="h6" className={chatGroupDisplayNameStyle}>
        {generateChatGroupDisplayName(
          chatGroupName,
          userChatGroupIds,
          userChatGroupsById,
          usersById
        )}
      </Typography>
    </div>
  )
}

export default ChatHeader

/*
            <Badge
              overlap="circle"
              variant="dot"
              style={{ color: 'red' }}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
              <Avatar
                style={{
                  width: '28px',
                  height: '28px',
                  fontSize: '1rem',
                }}
              >{`${user.firstName[0]}${user.lastName[0]}`}</Avatar>
            </Badge>*/

import React from 'react'
import { useSelector } from 'react-redux'
import moment, { Moment } from 'moment'
import { ReduxState } from '../../../store'
import { CHAT_GROUP_KEY_PREFIX } from '../../../store/common'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'
import Tooltip from '@material-ui/core/Tooltip'
import { settingsIconBackgroundColor, commonStyles } from '../styles'
import { getDatetimeToDisplayInChat } from '../helperfunctions'
import ChatHeader from './ChatHeader'

const CurrentChat: React.FC<{ currentChatGroupId: string }> = ({
  currentChatGroupId,
}) => {
  const { flexContainer, subHeading } = commonStyles()
  const { messageState, loggedInUser, usersById } = useSelector(
    (state: ReduxState) => ({
      messageState: state.messages,
      loggedInUser: state.auth.user,
      usersById: state.users.byId,
    })
  )
  const currentMessageIds: string[] | undefined =
    messageState.subGroupings[`${CHAT_GROUP_KEY_PREFIX}${currentChatGroupId}`]
  if (currentMessageIds === undefined) {
    return <div>Start Chatting!</div>
  }

  return (
    <div className={flexContainer}>
      <div className={subHeading}>
        <ChatHeader currentChatId={currentChatGroupId} />
      </div>

      <div style={{ overflow: 'scroll' }}>
        {[...currentMessageIds].reverse().map((id, idx, messageIdsArr) => {
          const { body, userId, createdAt } = messageState.byId[id]
          const isLoggedInUser: boolean = userId === loggedInUser.id

          const { firstName, lastName } = isLoggedInUser
            ? loggedInUser
            : usersById[userId]

          const dtCurrentMessage: Moment = moment(createdAt)
          let showAvatar: boolean
          if (idx === messageIdsArr.length - 1) {
            showAvatar = true
          } else {
            const {
              createdAt: nextMesDt,
              userId: nextMesUser,
            } = messageState.byId[messageIdsArr[idx + 1]]
            showAvatar =
              userId !== nextMesUser ||
              dtCurrentMessage.isBefore(
                moment(nextMesDt).clone().subtract(2, 'h')
              )
          }

          let avatarStyle: Record<string, string> = {
            width: '28px',
            height: '28px',
            fontSize: '1rem',
          }
          if (!showAvatar) avatarStyle.background = 'none'

          let isNewConvo: boolean
          let doDisplayName: boolean
          if (idx === 0) {
            isNewConvo = true
            doDisplayName = true
          } else {
            const {
              createdAt: prevMesDt,
              userId: prevMesUser,
            } = messageState.byId[messageIdsArr[idx - 1]]
            isNewConvo = dtCurrentMessage.isAfter(moment(prevMesDt).add(2, 'h'))
            doDisplayName = isNewConvo || userId != prevMesUser
          }

          let styles: Record<string, string> = {
            display: 'flex',
            flexDirection: `row${isLoggedInUser ? '-reverse' : ''}`,
            marginTop: `${isNewConvo ? 0 : 15}px`,
          }
          styles[`margin${isLoggedInUser ? 'Left' : 'Right'}`] = '30%'

          const displayDt: string = getDatetimeToDisplayInChat(dtCurrentMessage)
          return (
            <div key={id}>
              {(idx === 0 || isNewConvo) && (
                <div
                  style={{
                    textAlign: 'center',
                    marginTop: '15px',
                    fontSize: '1rem',
                    color: 'gray',
                  }}
                >
                  <b>{displayDt}</b>
                </div>
              )}
              <div style={styles}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    marginRight: '10px',
                    marginBottom: '3px',
                  }}
                >
                  {!isLoggedInUser && (
                    <Avatar style={avatarStyle}>
                      {showAvatar ? `${firstName[0]}${lastName[0]}` : ''}
                    </Avatar>
                  )}
                </div>

                <div>
                  {!isLoggedInUser && doDisplayName && (
                    <Typography variant="body2" style={{ fontSize: '.8rem' }}>
                      <b>{usersById[userId].fullName}</b>
                    </Typography>
                  )}
                  <Tooltip placement="left" title={displayDt} arrow>
                    <Typography
                      style={{
                        backgroundColor: isLoggedInUser
                          ? 'dodgerblue'
                          : settingsIconBackgroundColor,

                        padding: '7px',
                        borderRadius: '10px',
                        marginTop: '3px',
                        fontSize: '.9rem',
                      }}
                      variant="body1"
                    >
                      {body}
                    </Typography>
                  </Tooltip>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CurrentChat

/*(node:85818) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 message listeners added to [RedisClient]. Use emitter.setMaxListeners() to increase limit*/

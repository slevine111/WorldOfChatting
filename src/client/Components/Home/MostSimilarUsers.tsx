import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { History } from 'history'
import { getMostSimilarUsers } from './helperfunctions'
import { ReduxState } from '../../store'
import { chatGroupInviteThunk } from '../../store/chatgroupinvite/actions'
import AvatarTooltip from '../_shared/AvatarTooltip'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'

const MostSimilarUsers: React.FC<{ history: History }> = ({ history }) => {
  const dispatch = useDispatch()
  const [usersChattingWithShown, setUsersChattingWithShown] = useState(true)
  const userReducerState = useSelector((state: ReduxState) => state.users)
  const chatGroupAllIds = useSelector(
    (state: ReduxState) => state.chatGroups.allIds
  )
  const userChatGroupReducerState = useSelector(
    (state: ReduxState) => state.userChatGroups
  )
  const loggedInUserId = useSelector((state: ReduxState) => state.auth.user.id)
  let { userToChatGroupMap, userIdsDisplay } = getMostSimilarUsers(
    userReducerState,
    chatGroupAllIds,
    userChatGroupReducerState,
    usersChattingWithShown
  )
  return (
    <div>
      <FormControlLabel
        control={
          <Checkbox
            checked={usersChattingWithShown}
            onChange={() => setUsersChattingWithShown(!usersChattingWithShown)}
          />
        }
        label="Show Users Already Chatting With"
      />
      <Grid container>
        {userIdsDisplay.map((id) => {
          const user = userReducerState.byId[id]
          const { directChat, similarityScore, fullName } = user
          return (
            <Grid item xs={6} sm={4} key={id} style={{ marginBottom: '10px' }}>
              <AvatarTooltip
                userSingleOrArray={user}
                onButtonClick={() => {
                  if (directChat) {
                    history.push(`/chat/${userToChatGroupMap[id]}`)
                  } else {
                    dispatch(
                      chatGroupInviteThunk({
                        senderUserId: loggedInUserId,
                        targetUserId: id,
                      })
                    )
                  }
                }}
              />
              <Typography variant="body1">{fullName}</Typography>
              <Typography variant="body1">
                <em>{similarityScore}</em>
              </Typography>
            </Grid>
          )
        })}
      </Grid>
    </div>
  )
}

export default withRouter(MostSimilarUsers)

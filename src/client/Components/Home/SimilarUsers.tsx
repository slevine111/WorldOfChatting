import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { getMostSimilarUsers } from './helperfunctions'
import { ReduxState } from '../../store'
import PersonCircle from '../_shared/PersonCircle'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'

const SimilarUsers = () => {
  const [usersChattingWithShown, setUsersChattingWithShown] = useState(true)
  const userReducerState = useSelector((state: ReduxState) => state.users)
  let userIdsDisplay: string[] = getMostSimilarUsers(
    userReducerState,
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
          return (
            <Grid item xs={6} sm={4} key={id}>
              <PersonCircle
                user={user}
                onButtonClick={() => console.log('hello')}
              />
              <Typography variant="body1">
                <em>{user.similarityScore}</em>
              </Typography>
            </Grid>
          )
        })}
      </Grid>
    </div>
  )
}

export default SimilarUsers

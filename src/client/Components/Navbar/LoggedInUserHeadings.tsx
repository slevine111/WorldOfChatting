import React, { Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ReduxState } from '../../store/index'
//import { INotificationReducerFields } from '../../../types-for-both-server-and-client'
import { logoutUserProcessThunk } from '../../store/APIRequestsHandling/multiplereducerthunks'
import Button from '@material-ui/core/Button'
import styles from './styles'

const LoggedInUserHeadings: React.FC<{}> = () => {
  const { buttonStyle } = styles()
  const dispatch = useDispatch()
  const userId: string = useSelector((state: ReduxState) => state.auth.user.id)
  /*const notifications: INotificationReducerFields[] = useSelector(
    (state: ReduxState) => Object.values(state.notifications.byId)
  )*/

  return (
    <Fragment>
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

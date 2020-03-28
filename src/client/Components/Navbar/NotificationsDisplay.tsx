import React, { Fragment } from 'react'
import moment, { Moment } from 'moment'
import { useSelector, useDispatch } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { ReduxState } from '../../store'
import { singleNotificationClickedOnThunk } from '../../store/notification/actions'
import { Notification } from '../../../entities'
import { IReduxStoreUserFields } from '../../../types-for-both-server-and-client'
import {
  generateNotificationText,
  getTimeDifferenceUnitDisplay,
  TimeUnitsOptions
} from './helperfunctions'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Avatar from '@material-ui/core/Avatar'
import Grid from '@material-ui/core/Grid'
import { History } from 'history'

const IndividualNotification: React.FC<{
  nt: Notification
  user: IReduxStoreUserFields
  dateDiffDisplay: TimeUnitsOptions
  currentDateTime: Moment
  history: History
  onCloseDisplay: () => void
}> = ({
  nt,
  user,
  dateDiffDisplay,
  currentDateTime,
  history,
  onCloseDisplay
}) => {
  const dispatch = useDispatch()
  const { updatedAtSendersCol, clickedOn } = nt
  const { fullName, firstName, lastName } = user
  const textStyle: Record<string, string> = {
    ...{ fontSize: '.7rem' },
    ...(clickedOn ? { color: 'gray', fontWeight: 'bold' } : {})
  }
  return (
    <Button
      size="small"
      variant="outlined"
      onClick={() => {
        history.push('/about')
        if (!clickedOn) {
          dispatch(singleNotificationClickedOnThunk(nt))
        }
        onCloseDisplay()
      }}
      style={{
        textTransform: 'none',
        width: '100%',
        paddingTop: '10px',
        borderRadius: 0,
        border: 0,
        borderTop: '1px solid rgba(0, 0, 0, 0.23)',
        fontSize: '.6rem'
      }}
    >
      <div style={{ display: 'flex' }}>
        <Avatar
          style={{
            width: '22px',
            height: '22px',
            fontSize: '.6rem',
            marginRight: '7px'
          }}
        >{`${firstName[0]}${lastName[0]}`}</Avatar>
        <Grid container>
          <Grid item xs={12} style={{ textAlign: 'left' }}>
            <Typography variant="body2" style={textStyle}>
              {generateNotificationText(nt, fullName)}
            </Typography>
          </Grid>

          <Grid item xs={12} style={{ textAlign: 'left' }}>
            <Typography
              variant="caption"
              style={{ color: 'gray', fontSize: '.6rem' }}
            >{`${Math.round(
              currentDateTime.diff(
                moment(updatedAtSendersCol),
                dateDiffDisplay,
                true
              )
            )} ${dateDiffDisplay}`}</Typography>
          </Grid>
        </Grid>
      </div>
    </Button>
  )
}

const NotificationsDisplay: React.FC<RouteComponentProps & {
  onCloseDisplay: () => void
}> = ({ history, onCloseDisplay }) => {
  const { notificationsReducer, usersById } = useSelector(
    (store: ReduxState) => ({
      notificationsReducer: store.notifications,
      usersById: store.users.byId
    })
  )

  const { byId, allIds } = notificationsReducer

  let currentDateTime: Moment = moment()
  return (
    <Fragment>
      <Typography
        variant="subtitle2"
        style={{ paddingLeft: '9px', fontWeight: 'bold' }}
      >
        Notifications
      </Typography>
      {allIds.map(id => {
        const nt: Notification = byId[id]
        return (
          <IndividualNotification
            key={id}
            user={usersById[nt.sendersUserIds[0]]}
            dateDiffDisplay={getTimeDifferenceUnitDisplay(
              currentDateTime,
              nt.updatedAtSendersCol
            )}
            currentDateTime={currentDateTime.clone()}
            {...{ nt, history, onCloseDisplay }}
          />
        )
      })}
    </Fragment>
  )
}

export default withRouter(NotificationsDisplay)

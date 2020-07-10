import { NotificationReducerState } from '../../store.types'
import { Notification } from '../../../../../entities'

export const normalizeAndMakeNotificationFirst = (
  notificationReceived: Notification,
  currentState: NotificationReducerState
): NotificationReducerState => {
  let updatedState: NotificationReducerState = JSON.parse(
    JSON.stringify(currentState)
  )
  const { allIds } = updatedState
  const { id } = notificationReceived
  if (updatedState.byId[id] === undefined) {
    updatedState.allIds = [id, ...allIds]
  } else {
    let idIndex: number = 0
    for (let i = 0; i < allIds.length; ++i) {
      if (allIds[i] === id) {
        idIndex = i
        break
      }
    }
    updatedState.allIds = [
      id,
      ...allIds.slice(0, idIndex),
      ...allIds.slice(idIndex + 1),
    ]
  }
  updatedState.byId[id] = notificationReceived
  return updatedState
}

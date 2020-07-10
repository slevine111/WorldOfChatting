import { Notification } from '../../../entities'
import { normalizeData } from '../../shared/store/utilityfunctions'
import { SubGroupingFunctionType } from '../../shared/store/store.types'
import { NotificationReducerState } from '../../shared/store/reducers/notification.reducer'
import { INITIAL_SUBGROUPING_KEYS } from '../../shared/store/constants'
const {
  notifications: { NOT_SEEN },
} = INITIAL_SUBGROUPING_KEYS

export const addNotSeenNt: SubGroupingFunctionType<Notification> = (
  currentData,
  notification
) => {
  const { seen, id } = notification
  let updatedData: NotificationReducerState = JSON.parse(
    JSON.stringify(currentData)
  )
  if (!seen) {
    updatedData.subGroupings[NOT_SEEN].push(id)
  }
  return updatedData
}

export const normalizeAndMakeNotificationFirst: SubGroupingFunctionType<Notification> = (
  currentState,
  notificationReceived
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

export const normalizeAndEmptyNotSeenSubgrouping = (
  updatedNotifications: Notification[],
  currentState: NotificationReducerState
): NotificationReducerState => {
  let updatedState: NotificationReducerState = JSON.parse(
    JSON.stringify(currentState)
  )
  updatedState = normalizeData(updatedNotifications, updatedState)
  updatedState.subGroupings[NOT_SEEN] = []
  return updatedState
}

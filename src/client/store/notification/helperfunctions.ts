import { Notification } from '../../../entities'
import { NOT_SEEN, INotificationReducerState } from './types'
import { SubGroupingFunctionType, normalizeData } from '../utilityfunctions'

export const addNotSeenNt: SubGroupingFunctionType<Notification> = (
  currentSubGroupings,
  notification
) => {
  const { seen, id } = notification
  let updatedSubGroupings: Record<string, string[]> = JSON.parse(
    JSON.stringify(currentSubGroupings)
  )
  if (!seen) {
    updatedSubGroupings[NOT_SEEN].push(id)
  }
  return updatedSubGroupings
}

export const normalizeAndMakeNotificationFirst = (
  notificationReceived: Notification,
  currentState: INotificationReducerState
): INotificationReducerState => {
  let updatedState: INotificationReducerState = JSON.parse(
    JSON.stringify(currentState)
  )
  const { allIds } = updatedState
  const { id } = notificationReceived
  if (updatedState.byId[id] === undefined) {
    updatedState.allIds = [id, ...allIds]
  } else {
    let idIndex: number = 0
    for (let i = 0; i < allIds.length; ++i) {
      if (allIds[i] === id) idIndex = i
    }
    updatedState.allIds = [
      id,
      ...allIds.slice(0, idIndex),
      ...allIds.slice(idIndex + 1)
    ]
  }
  updatedState.byId[id] = notificationReceived
  return updatedState
}

export const normalizeAndEmptyNotSeenSubgrouping = (
  updatedNotifications: Notification[],
  currentState: INotificationReducerState
): INotificationReducerState => {
  let updatedState: INotificationReducerState = JSON.parse(
    JSON.stringify(currentState)
  )
  updatedState = normalizeData(updatedNotifications, updatedState)
  updatedState.subGroupings[NOT_SEEN] = []
  return updatedState
}

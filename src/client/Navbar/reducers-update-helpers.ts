import { NotificationReducerState } from '../shared/store/store.types'
import { INITIAL_SUBGROUPING_KEYS } from '../shared/store/constants'
import { normalizeData } from '../shared/store/utilityfunctions'
import { Notification } from '../../entities'
const {
  notifications: { NOT_SEEN },
} = INITIAL_SUBGROUPING_KEYS

export const normalizeAndEmptyNotSeenNtSubgrouping = (
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

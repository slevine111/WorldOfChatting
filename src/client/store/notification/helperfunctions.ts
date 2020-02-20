import { INotificationReducerFields } from '../../../types-for-both-server-and-client'

export const UNREAD_NOTIFICATIONS_KEY = <const>'unreadNotifications'

export const getUnreadNotificationIdsArr = (
  currentSubGroupings: Record<string, string[]>,
  currentNt: INotificationReducerFields
): Record<string, string[]> => {
  let subGroupingsCopy: Record<string, string[]> = { ...currentSubGroupings }
  const { read, id } = currentNt
  if (read) currentSubGroupings[UNREAD_NOTIFICATIONS_KEY].push(id)
  return subGroupingsCopy
}

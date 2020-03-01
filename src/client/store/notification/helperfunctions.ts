import { INotificationReducerFields } from '../../../types-for-both-server-and-client'
import { NtRecipientStatusOptions } from '../../../entities/NotificationRecipient'
import { SubGroupingFunctionType } from '../utilityfunctions'
const { ACCEPTED, DECLINED } = NtRecipientStatusOptions

export const NOTIFICATIONS_DISPLAY = <const>'notificationsToDisplay'

export const generateInitNotficationSubGroupingFunction = (
  loggedInUserId: string
): SubGroupingFunctionType<INotificationReducerFields> => {
  return (currentSubGroupings, currentNt) => {
    let subGroupingsCopy: Record<string, string[]> = { ...currentSubGroupings }
    const { targetUserId, id, status } = currentNt
    if (
      targetUserId === loggedInUserId ||
      [ACCEPTED, DECLINED].includes(status)
    ) {
      currentSubGroupings[NOTIFICATIONS_DISPLAY].push(id)
    }
    return subGroupingsCopy
  }
}

import { INotificationReducerFields } from '../../../types-for-both-server-and-client'
import { SubGroupingFunctionType } from '../utilityfunctions'

export const USER_SENDER = <const>'userSender'
export const USER_RECEIVER = <const>'userReceiver'

export const generateInitNotficationSubGroupingFunction = (
  loggedInUserId: string
): SubGroupingFunctionType<INotificationReducerFields> => {
  return (currentSubGroupings, currentNt) => {
    let subGroupingsCopy: Record<string, string[]> = { ...currentSubGroupings }
    const { senderId, id } = currentNt
    currentSubGroupings[
      senderId === loggedInUserId ? USER_SENDER : USER_RECEIVER
    ].push(id)
    return subGroupingsCopy
  }
}

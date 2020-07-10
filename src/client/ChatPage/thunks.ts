import axios from 'axios'
import { CLICKED_ON_CHAT_GROUP_REQUEST, chatGroupClickedOn } from './actions'
import {
  IThunkReturnObject,
  MessageReducerState,
} from '../shared/store/store.types'
import { CHAT_GROUP_KEY_PREFIX } from '../shared/store/constants'
import { IChatGroupAPIReturn } from '../../types-for-both-server-and-client'

export const chatGroupClickedOnThunk = (
  loggedInUserId: string,
  chatGroupId: string,
  messageReducerState: MessageReducerState,
  currentChatGroup: IChatGroupAPIReturn
): IThunkReturnObject<IChatGroupAPIReturn> => {
  const mostRecentMessageId: string =
    messageReducerState.subGroupings[
      `${CHAT_GROUP_KEY_PREFIX}${chatGroupId}`
    ][0]
  const { createdAt } = messageReducerState.byId[mostRecentMessageId]

  return {
    requestDataActionType: CLICKED_ON_CHAT_GROUP_REQUEST,
    apiCall: () =>
      axios.put(
        `/api/userchatgroup/user/${loggedInUserId}/chatgroup/${chatGroupId}`,
        {
          lastMessageSeenTimeStamp: createdAt,
        }
      ),
    dataTransformationCall: (_data) => {
      return { ...currentChatGroup, seenLastMessage: true }
    },
    dispatchActionOnSuccess: chatGroupClickedOn,
  }
}

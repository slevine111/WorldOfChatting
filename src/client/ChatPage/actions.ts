import { IChatGroupAPIReturn } from '../../types-for-both-server-and-client'

export const CLICKED_ON_CHAT_GROUP_REQUEST = <const>(
  'CLICKED_ON_CHAT_GROUP_REQUEST'
)
export const CLICKED_ON_CHAT_GROUP_REQUEST_SUCCESS = <const>(
  'CLICKED_ON_CHAT_GROUP_REQUEST_SUCCESS'
)
export const chatGroupClickedOn = (updatedChatGroup: IChatGroupAPIReturn) => ({
  type: CLICKED_ON_CHAT_GROUP_REQUEST_SUCCESS,
  updatedChatGroup,
})
export type ChatGroupClickedOnAR = ReturnType<typeof chatGroupClickedOn>

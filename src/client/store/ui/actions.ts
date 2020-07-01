import { WENT_TO_CHAT_PAGE } from './types'

export const wentToChatPage = (chatGroupId: string) => ({
  type: WENT_TO_CHAT_PAGE,
  chatGroupId,
})
export type WentToChatPageActionReturn = ReturnType<typeof wentToChatPage>

export type UIActionReturns = WentToChatPageActionReturn

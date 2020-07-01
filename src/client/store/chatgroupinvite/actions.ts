import axios, { AxiosResponse } from 'axios'
import { IThunkReturnObject } from '../APIRequestsHandling/types'
import { CHAT_GROUP_INVITE_RECEIVED } from './types'
import {
  RequestDataConstants,
  RequestDataSuccessConstants,
} from '../APIRequestsHandling/types'
import { ChatGroupInvite } from '../../../entities'
import { IChatGroupInvitePostDTO } from '../../../server/chatgroupinvites/chatgroupinvites.dto'
const { CHAT_GROUP_INVITE_REQUEST } = RequestDataConstants

const chatGroupInvitationSent = (
  chatGroupInviteReducerItem: ChatGroupInvite
) => ({
  type: <const>RequestDataSuccessConstants.CHAT_GROUP_INVITE_REQUEST_SUCCESS,
  chatGroupInviteReducerItem,
})

export const chatGroupInviteReceived = (
  chatGroupInviteReducerItem: ChatGroupInvite
) => ({
  type: CHAT_GROUP_INVITE_RECEIVED,
  chatGroupInviteReducerItem,
})

export type ChatGroupInviteActionReturns =
  | ReturnType<typeof chatGroupInvitationSent>
  | ReturnType<typeof chatGroupInviteReceived>

export const chatGroupInviteThunk = (
  newChatGroupInvitePost: IChatGroupInvitePostDTO
): IThunkReturnObject<ChatGroupInvite> => {
  return {
    requestDataActionType: CHAT_GROUP_INVITE_REQUEST,
    apiCall: (): Promise<AxiosResponse<ChatGroupInvite>> => {
      return axios.post('/api/chatgroupinvite', newChatGroupInvitePost)
    },
    dispatchActionOnSuccess: chatGroupInvitationSent,
  }
}

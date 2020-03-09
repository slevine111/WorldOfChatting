import axios, { AxiosResponse } from 'axios'
import { IThunkReturnObject } from '../APIRequestsHandling/types'
import { CHAT_GROUP_INVITE_RECEIVED } from './types'
import {
  RequestDataConstants,
  RequestDataSuccessConstants
} from '../APIRequestsHandling/types'
import { IChatGroupInviteReducerFields } from '../../../types-for-both-server-and-client'
import { IChatGroupInvitePostDTO } from '../../../server/chatgroupinvites/chatgroupinvites.dto'
const { CHAT_GROUP_INVITE_REQUEST } = RequestDataConstants

const chatGroupInvitationSent = (
  chatGroupInviteReducerItem: IChatGroupInviteReducerFields
) => ({
  type: <const>RequestDataSuccessConstants.CHAT_GROUP_INVITE_REQUEST_SUCCESS,
  chatGroupInviteReducerItem
})

export const chatGroupInviteReceived = (
  chatGroupInviteReducerItem: IChatGroupInviteReducerFields
) => ({
  type: CHAT_GROUP_INVITE_RECEIVED,
  chatGroupInviteReducerItem
})

export type ChatGroupInviteActionReturns =
  | ReturnType<typeof chatGroupInvitationSent>
  | ReturnType<typeof chatGroupInviteReceived>

export const chatGroupInviteThunk = (
  newChatGroupInvitePost: IChatGroupInvitePostDTO,
  targetUserId: string
): IThunkReturnObject<IChatGroupInviteReducerFields> => {
  return {
    requestDataActionType: CHAT_GROUP_INVITE_REQUEST,
    apiCall: (): Promise<AxiosResponse<IChatGroupInviteReducerFields>> => {
      return axios
        .post('/api/chatgroupinvite', newChatGroupInvitePost)
        .then(({ data }) => {
          return axios.post(
            '/api/chatgroupinvite/chatgroupinviteRecipient/single',
            {
              newChatGroupInvite: data,
              targetUserId
            }
          )
        })
    },
    dispatchActionOnSuccess: chatGroupInvitationSent
  }
}

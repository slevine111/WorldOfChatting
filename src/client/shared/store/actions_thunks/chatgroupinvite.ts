import axios, { AxiosResponse } from 'axios'
import { IThunkReturnObject } from '../store.types'
import { ChatGroupInvite } from '../../../../entities'
import { IChatGroupInvitePostDTO } from '../../../../server/chatgroupinvites/chatgroupinvites.dto'

const CHAT_GROUP_INVITE_REQUEST = <const>'CHAT_GROUP_INVITE_REQUEST'
export const CHAT_GROUP_INVITE_REQUEST_SUCCESS = <const>(
  'CHAT_GROUP_INVITE_REQUEST_SUCCESS'
)

const chatGroupInvitationSent = (
  chatGroupInviteReducerItem: ChatGroupInvite
) => ({
  type: CHAT_GROUP_INVITE_REQUEST_SUCCESS,
  chatGroupInviteReducerItem,
})
export type ChatGroupInviteSentAR = ReturnType<typeof chatGroupInvitationSent>

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

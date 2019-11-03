import { SET_CHAT_GROUPS } from './types'
import { ChatGroup } from '../../../entities'
import axios, { AxiosResponse } from 'axios'
import { ThunkAction } from 'redux-thunk'

const setChatGroups = (chatGroups: ChatGroup[]) => ({
  type: SET_CHAT_GROUPS,
  chatGroups
})
type SetChatGroupsType = ReturnType<typeof setChatGroups>

export type ChatGroupActionTypes = SetChatGroupsType

export const setChatGroupsThunk = (
  userId: string
): ThunkAction<Promise<void>, ChatGroup[], string, SetChatGroupsType> => {
  return dispatch => {
    return axios
      .get(`/api/chatgroup/${userId}`)
      .then(({ data }: AxiosResponse<ChatGroup[]>): void => {
        dispatch(setChatGroups(data))
      })
  }
}

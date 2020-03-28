import { IUserReducerState } from '../user/reducer'
import { IUserChatGroupReducerState } from '../userchatgroup/reducer'
import { IUserAndChatGroupGetReturn } from '../../../types-for-both-server-and-client'
import { CHAT_GROUP_KEY_PREFIX } from '../userchatgroup/reducer'
import { IChatGroupRequestBase } from './types'
import { Notification } from '../../../entities'
import { ChatGroupInviteStatusOptions } from '../../../entities/ChatGroupInviteRecipient'
import { NotificationTypes } from '../../../entities/Notification'
import axios, { AxiosResponse } from 'axios'

interface IUsersAndUserChatGroups {
  usersNormalizedAll: IUserReducerState
  userChatGroupNormalized: IUserChatGroupReducerState
}

export const separateUserAndChatGroupFields = (
  usersNormalized: IUserReducerState,
  usersWithChatGroups: IUserAndChatGroupGetReturn[]
): IUsersAndUserChatGroups => {
  let usersNormalizedAll: IUserReducerState = {
    ...usersNormalized
  }
  usersNormalizedAll.subGroupings.userIdsChattingWith = []
  let userChatGroupNormalized: IUserChatGroupReducerState = {
    byId: {},
    allIds: [],
    subGroupings: {}
  }
  let uniqueUserIdsChattingWith: Set<string> = new Set()
  for (let i = 0; i < usersWithChatGroups.length; ++i) {
    const {
      userTableId,
      firstName,
      lastName,
      fullName,
      email,
      loggedIn,
      loggedInAsString,
      ...userChatGroupFields
    } = usersWithChatGroups[i]
    const {
      userChatGroupId,
      chatGroupId,
      ...otherUserChatGroupFields
    } = userChatGroupFields
    userChatGroupNormalized.byId[userChatGroupId] = {
      id: userChatGroupId,
      chatGroupId,
      ...otherUserChatGroupFields
    }
    userChatGroupNormalized.allIds.push(userChatGroupId)
    const subGroupKey: string = `${CHAT_GROUP_KEY_PREFIX}${chatGroupId}`
    if (userChatGroupNormalized.subGroupings[subGroupKey] !== undefined) {
      userChatGroupNormalized.subGroupings[subGroupKey].push(userChatGroupId)
    } else {
      userChatGroupNormalized.subGroupings[subGroupKey] = [userChatGroupId]
    }

    if (usersNormalizedAll.byId[userTableId] === undefined) {
      usersNormalizedAll.byId[userTableId] = {
        id: userTableId,
        firstName,
        lastName,
        fullName,
        email,
        loggedIn,
        loggedInAsString
      }
      usersNormalizedAll.allIds.push(userTableId)
    }
    if (!uniqueUserIdsChattingWith.has(userTableId)) {
      usersNormalizedAll.subGroupings.userIdsChattingWith.push(userTableId)
      uniqueUserIdsChattingWith.add(userTableId)
    }
  }
  return { usersNormalizedAll, userChatGroupNormalized }
}

const notificationAPICall = async (
  notificationType: NotificationTypes,
  targetUserId: string,
  loggedInUserId: string
): Promise<AxiosResponse> => {
  const currentNotifications: Notification[] = await axios.get(
    `/api/notification/currentDate/${notificationType}/${targetUserId}`
  )
  if (currentNotifications.length >= 2) {
    throw Error('bad')
  }
  if (currentNotifications.length === 1) {
    const { id, sendersUserIds } = currentNotifications[0]
    return axios.put(`/api/notification/single/${id}`, {
      currentNotification: currentNotifications[0],
      updatedNotification: {
        sendersUserIds: [...sendersUserIds, loggedInUserId],
        clickedOn: false,
        seen: false
      }
    })
  } else {
    return axios.post('/api/notification', {
      notificationType,
      senderId: loggedInUserId,
      targetUserId
    })
  }
}

export const respondToChatInviteBase = async (
  userIdSentRequest: string,
  loggedInUserId: string,
  chatGroupInviteRecipientId: string,
  status: ChatGroupInviteStatusOptions,
  notificationType: NotificationTypes
): Promise<IChatGroupRequestBase> => {
  const apiReturn = await Promise.all([
    notificationAPICall(notificationType, userIdSentRequest, loggedInUserId),
    axios.put(`/api/chatgroupinvite/recipient/${chatGroupInviteRecipientId}`, {
      status
    })
  ])
  return {
    newNotification: apiReturn[0].data,
    chatGroupInviteRecipientId
  }
}

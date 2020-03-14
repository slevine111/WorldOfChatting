import { IUserReducerState } from '../user/reducer'
import { IUserChatGroupReducerState } from '../userchatgroup/reducer'
import { IUserAndChatGroupGetReturn } from '../../../types-for-both-server-and-client'
import { CHAT_GROUP_KEY_PREFIX } from '../userchatgroup/reducer'
import { IChatGroupRequestBase } from './types'
import { ChatGroupInviteStatusOptions } from '../../../entities/ChatGroupInviteRecipient'
import { NotificationTypes } from '../../../entities/Notification'
import axios from 'axios'

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

export const respondToChatInviteBase = async (
  userIdSentRequest: string,
  userIdAcceptedRequest: string,
  chatGroupInviteRecipientId: string,
  status: ChatGroupInviteStatusOptions,
  language: string
): Promise<IChatGroupRequestBase> => {
  const apiReturn = await Promise.all([
    axios.post('/api/notification', {
      notificationType: Object(NotificationTypes)[
        `CHAT_GROUP_INVITE_${
          status === ChatGroupInviteStatusOptions.DECLINED
            ? 'DECLINED'
            : 'ACCEPTED'
        }`
      ],
      senderId: userIdAcceptedRequest,
      targetUserId: userIdSentRequest,
      language
    }),
    axios.put(`/api/chatgroupinvite/recipient/${chatGroupInviteRecipientId}`, {
      status
    })
  ])
  return {
    newNotification: apiReturn[0].data,
    chatGroupInviteRecipientId
  }
}

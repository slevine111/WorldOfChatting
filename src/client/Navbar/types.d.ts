import { IChatGroupAPIReturn } from '../../types-for-both-server-and-client'
import { UserChatGroup, Notification } from '../../entities'

export interface IChatGroupRequestDeclinedData {
  newNotification: Notification
  chatGroupInviteId: string
}

export interface IChatGroupRequestAcceptedData
  extends IChatGroupRequestDeclinedData {
  newChatGroup: IChatGroupAPIReturn
  newUserChatGroups: UserChatGroup[]
  newChatGroupId: string
}

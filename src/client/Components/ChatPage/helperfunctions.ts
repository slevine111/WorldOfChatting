import moment, { Moment } from 'moment'
import { CHAT_GROUP_KEY_PREFIX } from '../../store/common'
import { IMessageReducerState } from '../../store/message/reducer'
import { IUserChatGroupReducerState } from '../../store/userchatgroup/reducer'
import { ITextFields } from './shared-types'
import {
  IChatGroupAPIReturn,
  IReduxStoreUserFields,
} from '../../../types-for-both-server-and-client'

const getDatetimeToDisplayInSidebar = (messageDatetime: Date): string => {
  const messageMoment: Moment = moment(messageDatetime)
  const currentDateTime: Moment = moment()
  if (currentDateTime.isSame(messageMoment, 'day')) {
    return messageMoment.format('LT')
  } else if (currentDateTime.isSame(messageMoment, 'year')) {
    return messageMoment.format('MMM D')
  } else {
    return messageMoment.format('M/D/YY')
  }
}

export const getTextDisplayChatGroupWithMessage = (
  chatGroupId: string,
  chatGroupsById: Record<string, IChatGroupAPIReturn>,
  messageState: IMessageReducerState,
  userCGState: IUserChatGroupReducerState,
  usersById: Record<string, IReduxStoreUserFields>
): { avatar: string; datetime: string; header: string; body: string } => {
  const { name: chatGroupName } = chatGroupsById[chatGroupId]
  const subGroupingPrefix: string = `${CHAT_GROUP_KEY_PREFIX}${chatGroupId}`
  const chatGroupMessageIds: string[] =
    messageState.subGroupings[subGroupingPrefix]
  const chatGroupUserIds: string[] = userCGState.subGroupings[subGroupingPrefix]
  const { userId } = userCGState.byId[chatGroupUserIds[0]]
  const { body: messageText, createdAt } = messageState.byId[
    chatGroupMessageIds[0]
  ]
  const { fullName, firstName, lastName } = usersById[userId]
  return {
    avatar: `${firstName[0]}${lastName[0]}`,
    datetime: getDatetimeToDisplayInSidebar(createdAt),
    header:
      chatGroupUserIds.length > 1
        ? chatGroupName || `${firstName} & ${chatGroupUserIds.length - 1} more`
        : fullName,
    body: `${
      chatGroupUserIds.length > 1 ? `${firstName}: ` : ''
    }${messageText}`,
  }
}

export const getTextDisplayChatGroupNoMessage = (
  chatGroupId: string,
  chatGroupsById: Record<string, IChatGroupAPIReturn>,
  userCGState: IUserChatGroupReducerState,
  usersById: Record<string, IReduxStoreUserFields>
): ITextFields => {
  const { name: chatGroupName, createdAt } = chatGroupsById[chatGroupId]
  const subGroupingPrefix: string = `${CHAT_GROUP_KEY_PREFIX}${chatGroupId}`
  const chatGroupUserIds: string[] = userCGState.subGroupings[subGroupingPrefix]
  const isGroupChat: boolean = chatGroupUserIds.length > 1
  const { userId } = userCGState.byId[chatGroupUserIds[0]]
  let { fullName, firstName, lastName, similarityScore } = usersById[userId]
  for (let i = 1; chatGroupsById.length; ++i) {
    const { userId } = userCGState.byId[chatGroupUserIds[0]]
    similarityScore += usersById[userId].similarityScore
  }
  let avgScore: number = similarityScore / chatGroupUserIds.length
  const scoreSplitDec: string[] = String(avgScore).split('.')
  if (scoreSplitDec.length === 2 || scoreSplitDec[1].length > 2) {
    avgScore = Number(avgScore.toFixed(2))
  }

  return {
    avatar: `${firstName[0]}${lastName[0]}`,
    datetime: getDatetimeToDisplayInSidebar(createdAt),
    header: isGroupChat
      ? chatGroupName || `${firstName} & ${chatGroupUserIds.length - 1} more`
      : fullName,
    body: `${isGroupChat ? `Average ` : ''}Similarity Score: ${avgScore}`,
  }
}

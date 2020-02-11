import { ReduxState } from '../../../store'
import { CHAT_GROUP_KEY_PREFIX } from '../../../store/userchatgroup/reducer'
import { IReduxStoreUserFields } from '../../../../types-for-both-server-and-client'

export const getUsersOfChatGroup = (
  { users, userChatGroups }: ReduxState,
  chatGroupId: string
): IReduxStoreUserFields[] => {
  const subGroupKey: string = `${CHAT_GROUP_KEY_PREFIX}${chatGroupId}`
  const userChatGroupIds: string[] = userChatGroups.subGroupings[subGroupKey]
  let usersOfChatGroup: IReduxStoreUserFields[] = []
  for (let i = 0; i < userChatGroupIds.length; ++i) {
    const { userId } = userChatGroups.byId[userChatGroupIds[i]]
    usersOfChatGroup.push(users.data.byId[userId])
  }
  return usersOfChatGroup
}

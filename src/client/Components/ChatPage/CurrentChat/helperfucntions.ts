import { UserChatGroup } from '../../../../entities'
import { IReduxStoreUserFields } from '../../../../types-for-both-server-and-client'

export const generateChatGroupDisplayName = (
  chatGroupName: string,
  userChatGroupIds: string[],
  userChatGroupsById: Record<string, UserChatGroup>,
  usersById: Record<string, IReduxStoreUserFields>
): string => {
  if (chatGroupName) return chatGroupName
  const firstUserFullName: string =
    usersById[userChatGroupsById[userChatGroupIds[0]].userId].fullName
  if (userChatGroupIds.length === 1) return firstUserFullName
  if (userChatGroupIds.length === 2)
    return `${firstUserFullName} & ${
      usersById[userChatGroupsById[userChatGroupIds[1]].userId].fullName
    }`

  let returnString: string = userChatGroupIds
    .slice(0, 2)
    .map((id) => {
      const user = usersById[userChatGroupsById[id].userId]
      return `${user.firstName} ${user.lastName[0]}.`
    })
    .join(', ')
  returnString = `${returnString}, and ${userChatGroupIds.length - 2} more`
  return returnString
}

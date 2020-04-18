import { SubGroupingFunctionType } from './utilityfunctions'
import { Message, UserChatGroup } from '../../entities'

export const CHAT_GROUP_KEY_PREFIX = <const>'chatGroup'

export const addIdToChatGroupSubGrouping: SubGroupingFunctionType<
  Message | UserChatGroup
> = (subGroupings, dataItem) => {
  let updatedSubgroupings: Record<string, string[]> = JSON.parse(
    JSON.stringify(subGroupings)
  )
  const { id, chatGroupId } = dataItem
  const subGrouping: string = `${CHAT_GROUP_KEY_PREFIX}${chatGroupId}`
  if (updatedSubgroupings[subGrouping] !== undefined) {
    updatedSubgroupings[subGrouping].push(id)
  } else {
    updatedSubgroupings[subGrouping] = [id]
  }
  return updatedSubgroupings
}

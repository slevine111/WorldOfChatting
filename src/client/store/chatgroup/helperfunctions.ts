import { INormalizedReducerShape } from '../reducer.base'
import { SubGroupingFunctionType } from '../utilityfunctions'
import { IChatGroupAPIReturn } from '../../../types-for-both-server-and-client'

export type IChatGroupReducerState = INormalizedReducerShape<
  IChatGroupAPIReturn
>

export const FAVORITE_CHAT_GROUPS_KEY = <const>'favorites'
export const CHAT_GROUPS_WITH_MESSAGES_KEY = <const>'chatGroupsWithMessages'

export const addIdToSubgroupingsOnLogin: SubGroupingFunctionType<IChatGroupAPIReturn> = (
  subGroupings,
  chatGroup
) => {
  let updatedSubgroupings: Record<string, string[]> = JSON.parse(
    JSON.stringify(subGroupings)
  )
  const { favorite, lastMessageSeenTimeStamp, id } = chatGroup
  if (favorite) {
    updatedSubgroupings[FAVORITE_CHAT_GROUPS_KEY].push(id)
  }
  if (lastMessageSeenTimeStamp != null) {
    updatedSubgroupings[CHAT_GROUPS_WITH_MESSAGES_KEY].push(id)
  }
  return updatedSubgroupings
}

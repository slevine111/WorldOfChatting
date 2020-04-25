import { SubGroupingFunctionType } from './utilityfunctions'

export const CHAT_GROUP_KEY_PREFIX = <const>'chatGroup'

export const makeFunctionToAddIdToForeignKeySubGrouping = <
  T extends { id: string; [key: string]: any }
>(
  subGroupingPrefix: string,
  foreignKeyName: string
): SubGroupingFunctionType<T> => {
  return (subGroupings, dataItem) => {
    let updatedSubgroupings: Record<string, string[]> = JSON.parse(
      JSON.stringify(subGroupings)
    )
    const { id } = dataItem
    const subGrouping: string = `${subGroupingPrefix}${dataItem[foreignKeyName]}`
    if (updatedSubgroupings[subGrouping] !== undefined) {
      updatedSubgroupings[subGrouping].push(id)
    } else {
      updatedSubgroupings[subGrouping] = [id]
    }
    return updatedSubgroupings
  }
}

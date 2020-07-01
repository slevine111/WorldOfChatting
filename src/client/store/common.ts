import { SubGroupingFunctionType } from './utilityfunctions'
import { INormalizedReducerShape } from './reducer.base'

export const CHAT_GROUP_KEY_PREFIX = <const>'chatGroup'

export const makeFunctionToAddIdToForeignKeySubGrouping = <
  T extends { id: string; [key: string]: any }
>(
  subGroupingPrefix: string,
  foreignKeyName: string
): SubGroupingFunctionType<T> => {
  return (currentData, dataItem) => {
    let updatedData: INormalizedReducerShape<T> = JSON.parse(
      JSON.stringify(currentData)
    )
    const { id } = dataItem
    const subGrouping: string = `${subGroupingPrefix}${dataItem[foreignKeyName]}`
    if (updatedData.subGroupings[subGrouping] !== undefined) {
      updatedData.subGroupings[subGrouping].push(id)
    } else {
      updatedData.subGroupings[subGrouping] = [id]
    }
    return updatedData
  }
}

import { History } from 'history'
import { IWordCloudArrayObject } from './shared-types'
import {
  IUserLanguageReducerState,
  LOGGED_IN_USER_SUBGROUPING_KEY
} from '../../store/userlanguage/reducer'
import { IChatGroupReducerState } from '../../store/chatgroup/reducer'

export const generateWordCloudArray = (
  userLanguages: IUserLanguageReducerState,
  chatGroups: IChatGroupReducerState
): IWordCloudArrayObject[] => {
  let wordCloudArray: IWordCloudArrayObject[] = []
  const { subGroupings, byId } = userLanguages.data
  const selectedUserLangsId: string[] =
    subGroupings[LOGGED_IN_USER_SUBGROUPING_KEY]
  const chatGroupsByLanguage: { [key: string]: string[] } =
    chatGroups.data.subGroupings
  for (let i = 0; i < selectedUserLangsId.length; ++i) {
    const { language, type } = byId[selectedUserLangsId[i]]
    wordCloudArray.push({
      text: language,
      value: chatGroupsByLanguage[language].length,
      userType: type
    })
  }
  return wordCloudArray
}

export const onMyLanguageClick = (
  history: History,
  selectedLang: string,
  curRecentViewedLangs: string[],
  dispatchSetViewedLangs: (langs: string[]) => void
): void => {
  const copyLangs: string[] = [...curRecentViewedLangs]
  const langsSet: Set<string> = new Set(copyLangs)
  let newRecentViewedLangs: string[] = []
  if (!langsSet.has(selectedLang)) {
    const numberLangs: number = curRecentViewedLangs.length
    if (numberLangs === 5) copyLangs.shift()
    newRecentViewedLangs = [...copyLangs, selectedLang]
  } else if (copyLangs[copyLangs.length - 1] !== selectedLang) {
    const langIndex: number = copyLangs.indexOf(selectedLang)
    newRecentViewedLangs = [
      ...copyLangs.slice(0, langIndex),
      ...copyLangs.slice(langIndex + 1),
      selectedLang
    ]
  }
  dispatchSetViewedLangs(newRecentViewedLangs)

  history.push(`/language/${selectedLang}`)
}

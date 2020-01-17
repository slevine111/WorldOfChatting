import { History } from 'history'
import { UserChatGroup } from '../../../entities'
import { IUsersByChatGroup } from '../intercomponent-types'
import {
  IChatGroupReducer,
  IChatGroupWithFavoriteField,
  IReduxStoreUserFields,
  IUserLangugeWithOnlineUserCount
} from '../../../types-for-both-server-and-client'
import { IWordCloudArrayObject } from './shared-types'
import { groupUserChatGroups } from '../utilityfunctions'

export const generateWordCloudArray = (
  loggedInUserLanguages: IUserLangugeWithOnlineUserCount[]
): IWordCloudArrayObject[] => {
  let wordCloudArray: IWordCloudArrayObject[] = []
  for (let i = 0; i < loggedInUserLanguages.length; ++i) {
    const { language, usersOnlineCount, type } = loggedInUserLanguages[i]
    wordCloudArray.push({
      text: language,
      value: usersOnlineCount,
      userType: type
    })
  }
  return wordCloudArray
}

export const getFavoriteChatGroupsOfUser = (
  users: IReduxStoreUserFields[],
  chatGroups: IChatGroupReducer,
  userChatGroups: UserChatGroup[]
): IUsersByChatGroup[] => {
  const { usersGrouped } = groupUserChatGroups(users, userChatGroups)
  let usersByChatGroup: IUsersByChatGroup[] = []
  const languages: string[] = Object.keys(chatGroups)
  for (let j = 0; j < languages.length; ++j) {
    const language: string = languages[j]
    const chatGroupsOfLanguage: IChatGroupWithFavoriteField[] =
      chatGroups[language]
    for (let k = 0; k < chatGroupsOfLanguage.length; ++k) {
      const { id, name, favorite } = chatGroupsOfLanguage[k]
      if (favorite) {
        usersByChatGroup.push({
          name,
          language,
          users: usersGrouped[id]!
        })
      }
    }
  }
  return usersByChatGroup
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

/* <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css?family=Roboto:300,400,500&display=swap"
    />*/

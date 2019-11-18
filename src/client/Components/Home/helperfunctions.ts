import { User, UserLanguage, Language } from '../../../entities'
import * as myInterfaces from './index'

interface IObjectOfLanguages {
  [key: string]: Language
}

interface IObjectOfUsers {
  [key: string]: User
}

export const groupUsersByLanguage = (
  loggedInUser: User,
  users: User[],
  userLanguagues: UserLanguage[],
  languages: Language[]
): myInterfaces.IReturnObject => {
  let languagesMap: IObjectOfLanguages = {}
  for (let i = 0; i < languages.length; ++i) {
    languagesMap[languages[i].id] = languages[i]
  }
  let usersMap: IObjectOfUsers = {}
  for (let i = 0; i < users.length; ++i) {
    usersMap[users[i].id] = users[i]
  }
  let usersByLanguageMap: myInterfaces.IObjectOfUsersByLanguage = {}
  let languagesOfLoggedInUser: myInterfaces.ILanguageOfLoggedInUser[] = []
  for (let i = 0; i < userLanguagues.length; ++i) {
    const { userId, languageId, type, active } = userLanguagues[i]
    const { language } = languagesMap[languageId]
    if (userId === loggedInUser.id) {
      languagesOfLoggedInUser.push({ ...userLanguagues[i], language })
    } else if (active) {
      const user: myInterfaces.IUserWithLanguageType = {
        ...usersMap[userId],
        type
      }
      if (usersByLanguageMap[language]) {
        usersByLanguageMap[language].users.push(user)
      } else {
        usersByLanguageMap[language] = {
          languageId,
          language,
          users: [user]
        }
      }
    }
  }
  return { languagesOfLoggedInUser, usersByLanguageMap }
}

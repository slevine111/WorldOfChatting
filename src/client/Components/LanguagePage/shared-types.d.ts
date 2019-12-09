import { User } from '../../../entities'
import { UserLanguageTypeFieldOptions } from '../../../entities/UserLanguage'
import { IUsersByChatGroup, IObjectOfOneType } from '../intercomponent-types'

export type LanguageTypesCombos = 'll' | 'lt' | 'tl' | 'tt'

export interface IUserWithLanguageFields extends User {
  userType: UserLanguageTypeFieldOptions
  userAndAuthUserLanguageTypes: LanguageTypesCombos
  language: string
}

export interface IUsersofLanguageInformation {
  usersByChatGroup: IUsersByChatGroup[]
  usersMap: IObjectOfOneType<User>
  userIdsOfSoloChats: IObjectOfOneType<true>
}

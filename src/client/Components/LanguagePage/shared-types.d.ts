import { UserLanguageTypeFieldOptions } from '../../../entities/UserLanguage'
import { IUserFieldsForStore } from '../../../shared-types'
import { IUsersByChatGroup, IObjectOfOneType } from '../intercomponent-types'

export type LanguageTypesCombos = 'll' | 'lt' | 'tl' | 'tt'

export interface IUserWithLanguageFields extends IUserFieldsForStore {
  userType: UserLanguageTypeFieldOptions
  userAndAuthUserLanguageTypes: LanguageTypesCombos
  language: string
  [key: string]: string | boolean | undefined
}

export interface IUsersofLanguageInformation {
  usersByChatGroup: IUsersByChatGroup[]
  usersMap: IObjectOfOneType<IUserFieldsForStore>
  userIdsOfSoloChats: IObjectOfOneType<true>
}

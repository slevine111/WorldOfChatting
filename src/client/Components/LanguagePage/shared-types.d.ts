import { UserLanguageTypeFieldOptions } from '../../../entities/UserLanguage'
import { IReduxStoreUserFields } from '../../../types-for-both-server-and-client'
import { OnlineStatusesEnum } from '../../../entities/User'
import { IUsersByChatGroup, IObjectOfOneType } from '../intercomponent-types'

export type LanguageTypesCombos = 'LL' | 'LT' | 'TL' | 'TT'

export interface IUserWithLanguageFields extends IReduxStoreUserFields {
  userType: UserLanguageTypeFieldOptions
  userAndAuthUserLanguageTypes: LanguageTypesCombos
  language: string
  [key: string]: string | boolean | undefined
}

export interface IUsersofLanguageInformation {
  usersByChatGroup: IUsersByChatGroup[]
  usersMap: IObjectOfOneType<IReduxStoreUserFields>
  userIdsOfSoloChats: IObjectOfOneType<true>
}

export type IOnlineStatusesChecked = {
  [key in OnlineStatusesEnum]: boolean
}

export type IUserLangsTypesChecked = {
  [key in UserLanguageTypeFieldOptions]: boolean
}

type OrderColumns = 'fullName' | 'loggedInAsString' | 'userType'
type OrderDirections = 'asc' | 'desc'

export interface IOrderDirectionAndColumn {
  orderColumn: OrderColumns
  orderDirection: OrderDirections
}

export interface IDisplayAndDataNames {
  display: string
  data: OrderColumns
  orderDirection?: OrderDirections
}

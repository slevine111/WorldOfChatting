import { UserLanguageTypeFieldOptions } from '../../../entities/UserLanguage'
import { IReduxStoreUserFields } from '../../../types-for-both-server-and-client'
import { OnlineStatusesEnum } from '../../../entities/User'

export type LanguageTypesCombos = 'LL' | 'LT' | 'TL' | 'TT'

export interface IUserWithLanguageFields extends IReduxStoreUserFields {
  userType: UserLanguageTypeFieldOptions
  userAndAuthUserLanguageTypes: LanguageTypesCombos
  language: string
  inSoloChat: boolean
  [key: string]: string | boolean | undefined
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

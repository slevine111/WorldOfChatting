import { UserLanguageTypeFieldOptions } from '../../../entities/UserLanguage'
import { IReduxStoreUserFields } from '../../../types-for-both-server-and-client'
import { OnlineStatuses } from '../../../entities/User'

export type LanguageTypesCombos = 'LL' | 'LT' | 'TL' | 'TT'

export interface IUserWithLanguageFields extends IReduxStoreUserFields {
  userType: UserLanguageTypeFieldOptions
  userAndAuthUserLanguageTypes: LanguageTypesCombos
  language: string
  inSoloChat: boolean
  //[key: string]: string | boolean | undefined
}

export type IOnlineStatusesChecked = {
  [key in OnlineStatuses]: boolean
}

export type IUserLangsTypesChecked = {
  [key in UserLanguageTypeFieldOptions]: boolean
}

type OrderColumns = 'fullName' | 'onlineStatus' | 'userType'
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

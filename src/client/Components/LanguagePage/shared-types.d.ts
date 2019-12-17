import { UserLanguageTypeFieldOptions } from '../../../entities/UserLanguage'
import { IUserFieldsForStore } from '../../../shared-types'
import { OnlineStatusesEnum } from '../../../shared-types/shared-enums'
import { IUsersByChatGroup, IObjectOfOneType } from '../intercomponent-types'

export type LanguageTypesCombos = 'LL' | 'LT' | 'TL' | 'TT'

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

export interface IColumnAndDB {
  column: string
  db: OrderColumns
  orderDirection?: OrderDirections
}

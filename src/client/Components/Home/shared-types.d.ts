import { User } from '../../../entities'
import { UserLanguageTypeFieldOptions } from '../../../entities/UserLanguage'

export interface IWordCloudArrayObject {
  text: string
  value: number
  userType: UserLanguageTypeFieldOptions
}

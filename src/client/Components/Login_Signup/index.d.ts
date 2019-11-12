import { Language } from '../../../entities'

export interface ISignupInfo {
  firstName: string
  lastName: string
  email: string
  password: string
  languagesToLearn: Language[]
  languagesToTeach: Language[]
}

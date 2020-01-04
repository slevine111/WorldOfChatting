import {
  Connection,
  createConnection,
  getConnection,
  Repository
} from 'typeorm'
import {
  createUsers,
  createChatGroups,
  createUserLanguages,
  createMessages
} from './src/bin/seed'
import { User, Language } from './src/entities'
import { IChatGroupSeed } from './src/bin/seed'

declare global {
  namespace NodeJS {
    interface Global {
      __POSTGRES__: Connection
    }
  }
}

interface ILanguageAndCountries {
  language: string
  countries: string[]
}

interface ISelectedLanguages {
  English: Language
  Swahili: Language
  French: Language
  Spanish: Language
  Japanese: Language
  Turkish: Language
  Mandarin: Language
  [key: string]: Language
}

const createLanguages = async (): Promise<Language[]> => {
  const languagesArray: ILanguageAndCountries[] = [
    { language: 'Swahili', countries: ['Tanzania'] },
    { language: 'French', countries: ['France'] },
    { language: 'Japanese', countries: ['Japan'] },
    { language: 'Spanish', countries: ['Spain'] },
    { language: 'Turkish', countries: ['Turkey'] },
    { language: 'Mandarin', countries: ['China'] },
    { language: 'English', countries: ['United States'] }
  ]
  const repository: Repository<Language> = await getConnection(
    'test'
  ).getRepository(Language)
  return repository.save(languagesArray)
}

const getSelectedLanguages = (allLanguages: Language[]): ISelectedLanguages => {
  let selectedLanguages: string[] = [
    'Swahili',
    'French',
    'Japanese',
    'Spanish',
    'English',
    'Mandarin',
    'Turkish'
  ]
  return selectedLanguages.reduce((acc: any, currentLanguage: string) => {
    acc[currentLanguage] = allLanguages.find(
      language => language.language === currentLanguage
    )
    return acc
  }, {})
}

export default async () => {
  let connection = await createConnection('test')
  global.__POSTGRES__ = connection
  await connection.synchronize(true)
  const users: User[] = await createUsers('test')
  const languages: Language[] = await createLanguages()
  const selectedLanguages: ISelectedLanguages = getSelectedLanguages(languages)
  const chatGroups: IChatGroupSeed[] = await createChatGroups(
    users,
    selectedLanguages,
    'test'
  )

  await Promise.all([
    createUserLanguages(users, selectedLanguages, 'test'),
    createMessages(chatGroups, 'test')
  ])
}

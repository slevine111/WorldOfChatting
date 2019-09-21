import LanguageService from '../../src/server/languages/languages.service'
import { Language } from '../../src/entities'
import { createConnection, Repository, Connection } from 'typeorm'

describe('Language Service', () => {
  let languageService: LanguageService
  beforeAll(async () => {
    const connection: Connection = await createConnection('test')
    const languageRepo: Repository<Language> = connection.getRepository(
      Language
    )
    languageService = new LanguageService(languageRepo)
  })

  test('getAll returns all languages', () => {
    return languageService.getAll().then((languages: Language[]) => {
      expect(languages).toHaveLength(7)
      expect(languages[0].language).toBeDefined()
    })
  })
})

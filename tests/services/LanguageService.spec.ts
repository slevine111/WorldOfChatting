import LanguageService from '../../src/server/languages/languages.service'
import { Language } from '../../src/entities'
import { createConnection, Repository, Connection } from 'typeorm'

interface ICountObject {
  count: string
}

describe('Language Service', () => {
  let languageRepo: Repository<Language>
  let languageService: LanguageService
  beforeAll(async () => {
    const connection: Connection = await createConnection('test')
    languageRepo = connection.getRepository(Language)
    languageService = new LanguageService(languageRepo)
  })

  test('getAll returns all languages', async () => {
    const [numberLanguagesObject]: [ICountObject] = await languageRepo.query(
      'SELECT count(id) from language'
    )
    return languageService.getAll().then((languages: Language[]) => {
      expect(languages).toHaveLength(Number(numberLanguagesObject.count))
      expect(languages[0].language).toBeDefined()
    })
  })
})

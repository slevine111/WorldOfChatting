import LanguageService from '../../src/server/languages/languages.service'
import { Language } from '../../src/entities'
import { createConnection, Repository, Connection } from 'typeorm'

interface ICountObject {
  count: string
}

describe('Language Service', () => {
  let languageRepo: Repository<Language>
  let languageService: LanguageService
  let connection: Connection
  beforeAll(async () => {
    connection = await createConnection('test')
    languageRepo = connection.getRepository(Language)
    languageService = new LanguageService(languageRepo)
  })

  afterAll(async () => {
    await connection.close()
  })

  test('getAll returns all languages', async () => {
    const [numberLanguagesObject]: [ICountObject] = await languageRepo.query(
      'SELECT count(language) from language'
    )
    return languageService.getAll().then((languages: Language[]) => {
      expect(languages).toHaveLength(Number(numberLanguagesObject.count))
      expect(languages[0].language).toBeDefined()
    })
  })
})

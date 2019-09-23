import { Connection, createConnection, Repository, In } from 'typeorm'
import UserLanguageService from '../../src/server/userlanguages/userlanguages.service'
import { User, Language, UserLanguage } from '../../src/entities'
import { IUserLanguagePostDTO } from '../../src/server/userlanguages/userlanguages.dto'

describe('UserLanguageService', () => {
  let user: User
  let languages: Language[]
  let userLanguageRepo: Repository<UserLanguage>
  let userLanguageService: UserLanguageService
  beforeAll(async () => {
    const connection: Connection = await createConnection('test')
    userLanguageRepo = connection.getRepository(UserLanguage)
    const userRepo: Repository<User> = connection.getRepository(User)
    const languageRepo: Repository<Language> = connection.getRepository(
      Language
    )
    const [users, languagesTemp]: [User[], Language[]] = await Promise.all([
      userRepo.find(),
      languageRepo.find({
        language: In(['Swahili', 'French', 'English', 'Spanish'])
      })
    ])
    user = users[0]
    languages = languagesTemp
    userLanguageService = new UserLanguageService(userLanguageRepo)
  })

  test('addNewUserLanguages adds an array of userLanguages to database', async () => {
    const [, numberULs]: [
      UserLanguage[],
      number
    ] = await userLanguageRepo.findAndCount()

    const newULs: IUserLanguagePostDTO[] = [
      { type: 'learner', user, language: languages[0] },
      { type: 'teacher', user, language: languages[1] }
    ]
    await userLanguageService.addNewUserLanguages(newULs)
    const [, newNumberULs]: [
      UserLanguage[],
      number
    ] = await userLanguageRepo.findAndCount()
    expect(newNumberULs).toBe(numberULs + newULs.length)
  })

  test('addNewUserLanguages returns the new userLanguages added to database', () => {
    const newULs: IUserLanguagePostDTO[] = [
      { type: 'learner', user, language: languages[2] },
      { type: 'teacher', user, language: languages[3] }
    ]
    return userLanguageService
      .addNewUserLanguages(newULs)
      .then((userLanguages: UserLanguage[]) => {
        expect(userLanguages).toHaveLength(2)
        expect(userLanguages[0].type).toBeDefined()
        expect(userLanguages[0].active).toBeDefined()
        expect(userLanguages[0].user).toBeDefined()
        expect(userLanguages[0].language).toBeDefined()
      })
  })
})

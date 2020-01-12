import { Connection, createConnection, Repository, In } from 'typeorm'
import UserLanguageService from '../../src/server/userlanguages/userlanguages.service'
import { User, Language, UserLanguage } from '../../src/entities'
import { UserLanguageTypeFieldOptions } from '../../src/entities/UserLanguage'
import { IUserLanguagePostDTO } from '../../src/server/userlanguages/userlanguages.dto'

describe('UserLanguageService', () => {
  let user: User
  let languages: Language[]
  let userLanguageRepo: Repository<UserLanguage>
  let userLanguageService: UserLanguageService
  let connection: Connection
  beforeAll(async () => {
    connection = await createConnection('test')
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

  afterAll(async () => {
    await connection.close()
  })

  test('addNewUserLanguages adds an array of userLanguages to database', async () => {
    const [, numberULs]: [
      UserLanguage[],
      number
    ] = await userLanguageRepo.findAndCount()

    const { LEARNER, TEACHER } = UserLanguageTypeFieldOptions
    const newULs: IUserLanguagePostDTO[] = [
      { type: LEARNER, userId: user.id, language: languages[0].language },
      { type: TEACHER, userId: user.id, language: languages[1].language }
    ]
    await userLanguageService.addNewUserLanguages(newULs)
    const [, newNumberULs]: [
      UserLanguage[],
      number
    ] = await userLanguageRepo.findAndCount()
    expect(newNumberULs).toBe(numberULs + newULs.length)
  })

  test('addNewUserLanguages returns the new userLanguages added to database', () => {
    const { LEARNER, TEACHER } = UserLanguageTypeFieldOptions
    const newULs: IUserLanguagePostDTO[] = [
      { type: LEARNER, userId: user.id, language: languages[2].language },
      { type: TEACHER, userId: user.id, language: languages[3].language }
    ]
    return userLanguageService
      .addNewUserLanguages(newULs)
      .then((userLanguages: UserLanguage[]) => {
        expect(userLanguages).toHaveLength(2)
        expect(userLanguages[0].type).toBeDefined()
        expect(userLanguages[0].active).toBeDefined()
        expect(userLanguages[0].userId).toBeDefined()
        expect(userLanguages[0].language).toBeDefined()
      })
  })
})

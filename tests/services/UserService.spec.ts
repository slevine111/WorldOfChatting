import UserService from '../../src/server/users/users.service'
import { createConnection, Repository, Connection } from 'typeorm'
import { User } from '../../src/entities'
import { IUserPostDTO } from '../../src/server/users/users.dto'

describe('User Service', () => {
  let userRepo: Repository<User>
  let userService: UserService
  let connection: Connection
  beforeAll(async () => {
    connection = await createConnection('test')
    userRepo = connection.getRepository(User)
    userService = new UserService(userRepo)
  })

  afterAll(async () => {
    await connection.close()
  })

  test('addNewUser adds one user to database', async () => {
    const [, numberUsers]: [User[], number] = await userRepo.findAndCount()
    const newUser: IUserPostDTO = {
      firstName: 'larry',
      lastName: 'cooper',
      email: 'l@gmail.com',
      password: '12345y'
    }
    await userService.addNewUser(newUser)
    const [, newNumberUsers]: [User[], number] = await userRepo.findAndCount()
    expect(newNumberUsers).toBe(numberUsers + 1)
  })

  test('addNewUser returns the new user added to database', () => {
    return userService
      .addNewUser({
        firstName: 'kim',
        lastName: 'cooper',
        email: 'k@gmail.com',
        password: '12345x'
      })
      .then((user: User) => {
        expect(user.firstName).toBe('kim')
        expect(user.lastName).toBe('cooper')
        expect(user.email).toBe('k@gmail.com')
      })
  })
})

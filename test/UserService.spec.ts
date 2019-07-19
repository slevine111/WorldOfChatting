import UserService from '../src/server/users/users.service'
import { createConnection, Repository, Connection } from 'typeorm'
import { User } from '../src/server/db/entity'

describe('User Service', () => {
  let connection: Connection
  let userRepo: Repository<User>
  beforeAll(async () => {
    connection = await createConnection('test')
    await connection.synchronize(true)
    userRepo = connection.getRepository(User)
    await userRepo.save([
      {
        firstName: 'Joe',
        lastName: 'Roberts',
        username: 'jroberts',
        email: 'jroberts@gmail.com',
        password: '12345',
        loggedIn: true
      },
      {
        firstName: 'Kim',
        lastName: 'Levine',
        username: 'klevine',
        email: 'klevine@gmail.com',
        password: '1234',
        loggedIn: false
      }
    ])
  })

  afterAll(() => connection.close())

  test('findAll returns all users', () => {
    const userService: UserService = new UserService(userRepo)
    return userService.findAll().then(users => {
      expect(users).toHaveLength(2)
      expect(users[0].username).toBeDefined()
    })
  })
  test('findLoggedInUsers only returns users with loggedIn = true', () => {
    const userService: UserService = new UserService(userRepo)
    return userService.findLoggedInUsers().then(users => {
      expect(users.every(u => u.loggedIn)).toBe(true)
    })
  })
})

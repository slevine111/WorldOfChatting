import UserService from '../../src/server/users/users.service'
import { createConnection, Repository, Connection } from 'typeorm'
import { User } from '../../src/entities'

describe('User Service', () => {
  let connection: Connection
  let userRepo: Repository<User>
  beforeAll(async () => {
    connection = await createConnection('test')
    userRepo = connection.getRepository(User)
  })

  //afterAll(() => connection.close())

  test('getAll returns all users', () => {
    const userService: UserService = new UserService(userRepo)
    return userService.getAll().then(users => {
      expect(users).toHaveLength(3)
      expect(users[0].firstName).toBeDefined()
    })
  })
  test('findLoggedInUsers only returns users with loggedIn = true', () => {
    const userService: UserService = new UserService(userRepo)
    return userService.findLoggedInUsers().then(users => {
      expect(users.every(u => u.loggedIn)).toBe(true)
    })
  })
})

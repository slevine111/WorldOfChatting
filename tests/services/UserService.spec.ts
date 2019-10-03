import UserService from '../../src/server/users/users.service'
import { createConnection, Repository, Connection } from 'typeorm'
import { User } from '../../src/entities'
import { IUserPostDTO } from '../../src/server/users/users.dto'

describe('User Service', () => {
  let userRepo: RepositoryUser>
  let userService: UserService
  beforeAll(async () => {
    const connection: Connection = await createConnection('test')
    userRepo = connection.getRepository(User)
    userService = new UserService(userRepo)
  })

  test('getAll returns all users', async () => {
    const [, numberUsers]: [User[], number] = await userRepo.findAndCount()
    return userService.getAll().then(users => {
      expect(users).toHaveLength(numberUsers)
      expect(users[0].firstName).toBeDefined()
    })
  })
  test('findLoggedInUsers only returns users with loggedIn = true', () => {
    return userService.findLoggedInUsers().then(users => {
      expect(users.every(u => u.loggedIn)).toBe(true)
    })
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
        expect(user.password).toBe('12345x')
      })
  })
})

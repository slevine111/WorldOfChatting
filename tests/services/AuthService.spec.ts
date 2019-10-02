import { createConnection, Repository, Connection } from 'typeorm'
import { JwtService } from '@nestjs/jwt'
import AuthService from '../../src/server/auth/auth.service'
import { IGetTokenResult, ITokenAndUser } from '../../src/server/auth/auth.dto'
import UserService from '../../src/server/users/users.service'
import { User } from '../../src/entities'
import { config } from 'dotenv'

config()

describe('AuthService', () => {
  let userRepo: Repository<User>
  let joe: User
  let authService: AuthService
  let jwtService: JwtService
  beforeAll(async () => {
    userRepo = await createConnection('test').then((connection: Connection) => {
      return connection.getRepository(User)
    })
    joe = <User>await userRepo.findOne({ where: { firstName: 'Joe' } })
    const userService: UserService = new UserService(userRepo)
    jwtService = new JwtService({ secret: process.env.JWT_SECRET_TESTING })
    authService = new AuthService(jwtService, userService)
  })

  test('createToken creates a verified token', () => {
    let message: string = ''
    const token: string = authService.createToken(<User>joe)
    return jwtService
      .verifyAsync(token)
      .then(() => {
        message = 'success'
      })
      .catch(() => {
        message = 'failure'
      })
      .then(() => {
        expect(message).toBe('success')
      })
  })

  test('getToken returns token with payload with correct sub value', () => {
    return authService
      .getToken(joe.email, joe.password)
      .then(({ accessToken }: IGetTokenResult) => {
        const payload: any = jwtService.decode(accessToken)
        expect(payload.sub).toBe(joe.id)
      })
  })

  test('getTokenAndUser returns user associated with sub value in payload in token returned', async () => {
    const { email, password } = joe
    const {
      user,
      accessToken
    }: ITokenAndUser = await authService.getTokenAndUser(email, password)
    const payload: any = jwtService.decode(accessToken)
    const userOfAccessTokenId: User | undefined = await userRepo.findOne({
      where: { id: payload.sub }
    })
    expect(JSON.stringify(user)).toBe(JSON.stringify(userOfAccessTokenId))
  })

  test('exchangeTokenForUser returns token with same sub value as input token', () => {
    const { id } = joe
    const token: string = jwtService.sign({ sub: id }, { expiresIn: '1hr' })
    return authService
      .exchangeTokenForUser(token)
      .then(({ accessToken }: ITokenAndUser) => {
        expect(jwtService.decode(accessToken).sub).toBe(id)
      })
  })

  test('exchangeTokenForUser returns token with later iat and exp values than input token', () => {
    const { id } = joe
    const token: string = jwtService.sign({ sub: id }, { expiresIn: '1hr' })
    const inputTokenPayload: any = jwtService.decode(token)
    setTimeout(() => {
      return authService
        .exchangeTokenForUser(token)
        .then(({ accessToken }: ITokenAndUser) => {
          const { iat, exp }: any = jwtService.decode(accessToken)
          expect(iat).toBeGreaterThan(inputTokenPayload.iat)
          expect(exp).toBeGreaterThan(inputTokenPayload.exp)
        })
    }, 1000)
  })

  test('exchangeTokenForUser returns user associated with sub value in payload in token returned', async () => {
    const { id } = joe
    const token: string = jwtService.sign({ sub: id }, { expiresIn: '1hr' })
    const {
      user,
      accessToken
    }: ITokenAndUser = await authService.exchangeTokenForUser(token)
    const payload: any = jwtService.decode(accessToken)
    const userOfAccessTokenId: User | undefined = await userRepo.findOne({
      where: { id: payload.sub }
    })
    expect(JSON.stringify(user)).toBe(JSON.stringify(userOfAccessTokenId))
  })

  test("exchangeTokenForUser with invalid sub (user id) value returns error with 'authorization token invalid' message", () => {
    const token: string = jwtService.sign(
      { sub: `${joe.id.slice(0, joe.id.length - 1)}1` },
      { expiresIn: '1hr' }
    )
    let response: any
    return authService
      .exchangeTokenForUser(token)
      .then(() => {
        response = 'Nooooooo'
      })
      .catch((err: Error) => {
        response = err
      })
      .then(() => {
        expect(response).toBeInstanceOf(Error)
        expect(response.message).toBe('authorization token invalid')
        expect(response.statusCode).toBe(401)
      })
  })
})

import { createConnection, Repository, Connection } from 'typeorm'
import { JwtService } from '@nestjs/jwt'
import AuthService from '../../src/server/auth/auth.service'
import {
  IGetTokenResult,
  ITokenAndUser,
  ITokenAndRelatedInfo
} from '../../src/server/auth/auth.dto'
import UserService from '../../src/server/users/users.service'
import { User } from '../../src/entities'
import { caching } from 'cache-manager'
import { config } from 'dotenv'
import RedisStore from 'cache-manager-redis-store'

if (process.env.LOAD_CONFIG_FILE === 'true') {
  config()
}

describe('AuthService', () => {
  let userRepo: Repository<User>
  let joe: User
  const JOE_PASSWORD: string = <const>'12345'
  let authService: AuthService
  let jwtService: JwtService
  beforeAll(async () => {
    userRepo = await createConnection('test').then((connection: Connection) => {
      return connection.getRepository(User)
    })
    joe = <User>await userRepo.findOne({ where: { firstName: 'Joe' } })
    const userService: UserService = new UserService(userRepo)
    jwtService = new JwtService({ secret: process.env.JWT_SECRET_TESTING })
    authService = new AuthService(
      jwtService,
      userService,
      caching({
        store: RedisStore,
        ttl: Number.POSITIVE_INFINITY,
        host: process.env.REDIS_SERVCE_SERVICE_HOST,
        port: process.env.REDIS_SERVICE_SERVICE_PORT,
        password: process.env.REDIS_PASSWORD
      })
    )
  })

  test('createToken creates a verified token', () => {
    let message: string = ''
    const token: string = authService.createToken(<User>joe)
    const SUCCESS_MESSAGE: string = <const>'success'
    const FAILURE_MESSAGE: string = <const>'failure'
    return jwtService
      .verifyAsync(token)
      .then(() => {
        message = SUCCESS_MESSAGE
      })
      .catch(() => {
        message = FAILURE_MESSAGE
      })
      .then(() => {
        expect(message).toBe(SUCCESS_MESSAGE)
      })
  })

  test('getToken returns token with payload with correct sub value', () => {
    return authService
      .getToken(joe.email, JOE_PASSWORD)
      .then(({ accessToken }: IGetTokenResult) => {
        const payload: any = jwtService.decode(accessToken)
        expect(payload.sub).toBe(joe.id)
      })
  })

  test('getTokenAndUser returns user associated with sub value in payload in token returned', async () => {
    const { email } = joe
    const {
      user,
      accessToken
    }: ITokenAndUser = await authService.loginUserAndCreateToken(
      email,
      JOE_PASSWORD
    )
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
      .exchangeTokenForUser(token, true)
      .then(({ accessToken }: ITokenAndRelatedInfo) => {
        expect(jwtService.decode(accessToken)!.sub).toBe(id)
        expect(1).toBe(1)
      })
  })

  test('exchangeTokenForUser returns token with later iat and exp values than input token', () => {
    const { id } = joe
    const token: string = jwtService.sign(
      { sub: id, iat: Math.ceil(Date.now() / 1000) - 120 },
      { expiresIn: '1hr' }
    )
    const inputTokenPayload: any = jwtService.decode(token)
    return authService
      .exchangeTokenForUser(token, true)
      .then(({ accessToken }: ITokenAndUser) => {
        const { iat, exp }: any = jwtService.decode(accessToken)
        expect(iat).toBeGreaterThan(inputTokenPayload.iat)
        expect(exp).toBeGreaterThan(inputTokenPayload.exp)
      })
  })

  test('exchangeTokenForUser returns user associated with sub value in payload in token returned', async () => {
    const { id } = joe
    const token: string = jwtService.sign({ sub: id }, { expiresIn: '1hr' })
    const {
      user,
      accessToken
    }: ITokenAndUser = await authService.exchangeTokenForUser(token, true)
    const payload: any = jwtService.decode(accessToken)
    const userOfAccessTokenId: User | undefined = await userRepo.findOne({
      where: { id: payload.sub }
    })
    expect(JSON.stringify(user)).toBe(JSON.stringify(userOfAccessTokenId))
  })

  test("exchangeTokenForUser with invalid sub (user id) value returns error with 'authorization token invalid' message", () => {
    const joeIdLastCharacter: string = joe.id[joe.id.length - 1]
    let replacement: string = ''
    for (let i: number = 0; i <= 9; ++i) {
      if (String(i) !== joeIdLastCharacter) {
        replacement = String(i)
        break
      }
    }
    const token: string = jwtService.sign(
      { sub: `${joe.id.slice(0, joe.id.length - 1)}${replacement}` },
      { expiresIn: '1hr' }
    )
    let response: any
    return authService
      .exchangeTokenForUser(token, true)
      .then(() => {
        response = 'Nooooooo'
      })
      .catch((err: Error) => {
        response = err
      })
      .then(() => {
        expect(response).toBeInstanceOf(Error)
        expect(response.message).toBe('authorization token invalid')
      })
  })
})

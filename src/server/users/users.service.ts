import { Repository } from 'typeorm'
import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../../entities'
import { IReduxStoreUserFields } from '../../types-for-both-server-and-client'
import { OnlineStatuses } from '../../entities/User'
import { IUserPostDTO } from './users.dto'
import { compare, hash } from 'bcrypt'

@Injectable()
export default class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  findSingleUser(
    email: string,
    inputPassword: string,
    returnPassword: boolean
  ): Promise<User> {
    return this.userRepository
      .findOne({
        select: [
          'id',
          'firstName',
          'lastName',
          'email',
          'password',
          'onlineStatus',
        ],
        where: { email },
      })
      .then(async (user: User | undefined) => {
        if (user === undefined)
          throw new HttpException('username invalid', HttpStatus.UNAUTHORIZED)
        const passwordCorrect: boolean = await compare(
          inputPassword,
          user.password!
        )
        if (!passwordCorrect)
          throw new HttpException('password invalid', HttpStatus.UNAUTHORIZED)
        if (returnPassword) return user
        const { password, ...otherUserFields } = user
        return otherUserFields
      })
  }

  loginUser(email: string, inputPassword: string): Promise<User> {
    return this.findSingleUser(email, inputPassword, true).then(
      async (user: User) => {
        user.onlineStatus = OnlineStatuses.ONLINE
        const { password, ...otherUserFields } = await this.userRepository.save(
          user
        )
        return otherUserFields
      }
    )
  }

  findSingleUserById(id: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { id } })
  }

  findLoggedInSingleUserById(id: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { id, loggedIn: true } })
  }

  getUsersLinked(userId: string): Promise<IReduxStoreUserFields[]> {
    return this.userRepository.query(
      `
    SELECT A.id,
       A."firstName",
       A."lastName",
       CONCAT(A."firstName",' ',A."lastName") as "fullName",
 	   A.email,
 	   A."onlineStatus",
      ROUND(B."similarityScore",1) AS "similarityScore",
       C."userId" IS NOT NULL AS "directChat"
FROM "user" A
JOIN
(SELECT A."userId",
	    SUM(CASE WHEN (A.type = 'Learner' AND B.type = 'Teacher') OR (A.type = 'Teacher' AND B.type = 'Learner') THEN 1
	             ELSE .5 END) AS "similarityScore"
 FROM user_language A
 JOIN (SELECT * FROM user_language WHERE "userId" = $1) B
 ON A.language = B.language
 WHERE A."userId" != $2
 GROUP BY A."userId") B ON A.id = B."userId"
 LEFT JOIN
(
SELECT DISTINCT "userId"
FROM chat_group A
JOIN (SELECT "chatGroupId" FROM user_chat_group WHERE "userId" = $3) B
ON A.id = B."chatGroupId"
JOIN user_chat_group C ON A.id = C."chatGroupId"
WHERE "directChat" = true) C ON A.id = C."userId"
 ORDER BY "similarityScore" DESC
    `,
      [userId, userId, userId]
    )
  }

  async addNewUser(user: IUserPostDTO): Promise<User> {
    const { password, ...otherUserFields } = user
    const hashedPassword: string = await hash(password, 5)
    const { id, onlineStatus } = await this.userRepository.save({
      ...otherUserFields,
      password: hashedPassword,
    })
    return { ...otherUserFields, id, onlineStatus }
  }

  updateUser(userId: string, updatedUser: Partial<User>): Promise<User> {
    return this.findSingleUserById(userId).then((user: User | undefined) => {
      if (user === undefined)
        throw new HttpException('username invalid', HttpStatus.BAD_REQUEST)
      return this.userRepository.save({ ...user, ...updatedUser })
    })
  }
}

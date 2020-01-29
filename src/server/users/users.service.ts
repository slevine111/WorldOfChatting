import { Repository } from 'typeorm'
import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../../entities'
import {
  IUserAndChatGroupGetReturn,
  IReduxStoreUserFields
} from '../../types-for-both-server-and-client'
import { OnlineStatusesEnum } from '../../entities/User'
import { IUserPostDTO, IUserUpdateDTO } from './users.dto'
import { compare, hash } from 'bcrypt'

export enum EntityGetUsersLinkedTo {
  NOTIFICATION = 'notification',
  USER_LANGUAGE = 'user_language'
}

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
          'loggedIn'
        ],
        where: { email }
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
        user.loggedIn = true
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

  getUsersAndTheirChatGroups(
    userId: string
  ): Promise<IUserAndChatGroupGetReturn[]> {
    return this.userRepository.query(
      `SELECT u.id as "userTableId",
              u."firstName",
              u."lastName",
              CONCAT(u."firstName",' ',u."lastName") as "fullName",
              u."loggedIn",
              CASE WHEN u."loggedIn" = true THEN '${OnlineStatusesEnum.Online}'
                   ELSE '${OnlineStatusesEnum.Offline}' END AS "loggedInAsString",
              u.email,
              ucg.id as "userChatGroupId",
              ucg."userId",
              ucg."chatGroupId",
              ucg.favorite
              ucg."lastMessageSeenId"
      FROM user_chat_group ucg
      JOIN (SELECT "chatGroupId" FROM user_chat_group WHERE "userId" = $1) filter
      ON ucg."chatGroupId" = filter."chatGroupId"
      JOIN "user" u ON ucg."userId" = u.id
      WHERE ucg."userId" != $2
    `,
      [userId, userId, userId]
    )
  }

  getUsersLinked(
    entityValue: string,
    entity: EntityGetUsersLinkedTo
  ): Promise<IReduxStoreUserFields[]> {
    let endQuery: string = ''
    if (entity === EntityGetUsersLinkedTo.NOTIFICATION) {
      endQuery = `JOIN notification B ON A.id = B."senderId"
                  WHERE "targetUserId" = $1`
    } else {
      endQuery = `JOIN user_language B ON A.id = B."userId"
                 WHERE language = $1`
    }

    return this.userRepository.query(
      `SELECT A.id,
              A."firstName",
              A."lastName",
              CONCAT(A."firstName",' ',A."lastName") as "fullName",
              A.email,
              A."loggedIn",
              CASE WHEN A."loggedIn" = true THEN '${OnlineStatusesEnum.Online}'
                   ELSE '${OnlineStatusesEnum.Offline}' END AS "loggedInAsString"
       FROM "user" A
       ${endQuery}
      `,
      [entityValue]
    )
  }

  async addNewUser(user: IUserPostDTO): Promise<User> {
    const { password, ...otherUserFields } = user
    const hashedPassword: string = await hash(password, 5)
    const { id, loggedIn } = await this.userRepository.save({
      ...otherUserFields,
      password: hashedPassword
    })
    return { ...otherUserFields, id, loggedIn }
  }

  updateUser(userId: string, updatedUser: IUserUpdateDTO): Promise<User> {
    return this.findSingleUserById(userId).then((user: User | undefined) => {
      if (user === undefined)
        throw new HttpException('username invalid', HttpStatus.BAD_REQUEST)
      return this.userRepository.save({ ...user, ...updatedUser })
    })
  }
}

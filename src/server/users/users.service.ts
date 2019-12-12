import { Repository } from 'typeorm'
import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../../entities'
import { IUserAndChatGroupGetReturn, IUserFieldsForStore } from '../../shared-types'
import { IUserPostDTO, IUserUpdateDTO } from './users.dto'
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
          'loggedIn'
        ],
        where: { email }
      })
      .then(async (user: User | undefined) => {
        if (user === undefined)
          throw new HttpException('username invalid', HttpStatus.BAD_REQUEST)
        const passwordCorrect: boolean = await compare(
          inputPassword,
          user.password!
        )
        if (!passwordCorrect)
          throw new HttpException('password invalid', HttpStatus.BAD_REQUEST)
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

  getUsersAndTheirChatGroups(
    userId: string
  ): Promise<IUserAndChatGroupGetReturn[]> {
    return this.userRepository.query(
      `SELECT u.id as "userTableId",
              u."firstName",
              u."lastName",
              CONCAT(u."firstName",' ',u."lastName") as "fullName",
              u."loggedIn",
              u.email,
              ucg.id as "userChatGroupId",
              ucg."userId",
              ucg."chatGroupId",
              ucg.favorite
      FROM user_chat_group ucg
      JOIN (SELECT "chatGroupId" FROM user_chat_group WHERE "userId" = $1) filter
      ON ucg."chatGroupId" = filter."chatGroupId"
      JOIN "user" u ON ucg."userId" = u.id
      WHERE ucg."userId" != $2
    `,
      [userId, userId]
    )
  }

  getUsersLinkedToLanguage(language: string): Promise<IUserFieldsForStore[]> {
    return this.userRepository.query(
      `SELECT A.id,
              A."firstName",
              A."lastName",
              CONCAT(A."firstName",' ',A."lastName") as "fullName",
              A.email,
              A."loggedIn"
       FROM "user" A
       JOIN user_language B ON A.id = B."userId"
       WHERE language = $1
      `,
      [language]
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

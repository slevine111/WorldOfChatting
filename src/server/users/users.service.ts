import { Repository, In } from 'typeorm'
import { Injectable, HttpException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../../entities'
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
        if (user === undefined) throw new HttpException('username invalid', 400)
        const passwordCorrect: boolean = await compare(
          inputPassword,
          user.password!
        )
        if (!passwordCorrect) throw new HttpException('password invalid', 400)
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

  getLoggedInSpecifiedUsers(userIds: string): Promise<User[]> {
    return this.userRepository.find({
      loggedIn: true,
      id: In(userIds.split(','))
    })
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

  updateUser(
    userId: string,
    updatedUser: IUserUpdateDTO
  ): Promise<User | undefined> {
    return this.userRepository.update(userId, updatedUser).then(() => {
      return this.findSingleUserById(userId)
    })
  }
}

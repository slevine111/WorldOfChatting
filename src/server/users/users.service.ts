import { Repository } from 'typeorm'
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

  getAll(): Promise<User[]> {
    return this.userRepository.find()
  }

  findSingleUser(email: string, inputPassword: string): Promise<User> {
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
        const { password, ...otherUserFields } = user
        return otherUserFields
      })
  }

  findSingleUserById(id: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { id } })
  }

  findLoggedInUsers(): Promise<User[]> {
    return this.userRepository.find({ loggedIn: false })
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

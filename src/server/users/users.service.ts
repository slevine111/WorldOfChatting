import { Repository } from 'typeorm'
import { Injectable, HttpException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../../entities'
import { IUserPostDTO } from './users.dto'

@Injectable()
export default class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  getAll(): Promise<User[]> {
    return this.userRepository.find()
  }

  findSingleUser(email: string, password: string): Promise<User> {
    return this.userRepository
      .findOne({ where: { email } })
      .then((user: User | undefined) => {
        if (user === undefined) throw new HttpException('username invalid', 400)
        if (user.password !== password)
          throw new HttpException('password invalid', 400)
        return user
      })
  }

  findSingleUserById(id: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { id } })
  }

  findLoggedInUsers(): Promise<User[]> {
    return this.userRepository.find({ loggedIn: true })
  }

  addNewUser(user: IUserPostDTO): Promise<User> {
    return this.userRepository.save(user)
  }
}

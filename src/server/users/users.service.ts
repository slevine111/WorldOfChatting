import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
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

  findSingleUser(username: string, password: string): Promise<User> {
    return this.userRepository.findOneOrFail({ where: { username, password } })
  }

  findLoggedInUsers(): Promise<User[]> {
    return this.userRepository.find({ loggedIn: true })
  }

  addNewUser(user: IUserPostDTO): Promise<User> {
    return this.userRepository.save(user)
  }
}

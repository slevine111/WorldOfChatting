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

  findSingleUser(email: string, password: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email, password } })
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

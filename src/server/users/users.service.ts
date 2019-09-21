import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../../entities'

@Injectable()
export default class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  getAll(): Promise<User[]> {
    return this.userRepository.find()
  }

  findLoggedInUsers(): Promise<User[]> {
    return this.userRepository.find({ loggedIn: true })
  }
}

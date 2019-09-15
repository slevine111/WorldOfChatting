import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../db/entity'

@Injectable()
export default class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find()
  }

  findLoggedInUsers(): Promise<User[]> {
    return this.userRepository.find({ loggedIn: false })
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async findOrCreate(personalNumber: string) {
    let user = await this.usersRepo.findOne({ where: { personalNumber } });
    if (!user) {
      user = this.usersRepo.create({ personalNumber });
      await this.usersRepo.save(user);
    }
    return user;
  }
}

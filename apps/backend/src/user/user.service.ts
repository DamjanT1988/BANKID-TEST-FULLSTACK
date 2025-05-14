import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async findOrCreate(personNumber: string) {
    let user = await this.repo.findOne({ where: { personNumber } });
    if (!user) {
      user = this.repo.create({ personNumber });
      user = await this.repo.save(user);
    }
    return user;
  }
}

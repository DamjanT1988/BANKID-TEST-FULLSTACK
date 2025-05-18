// apps/backend/src/user/user.service.ts

import { Injectable } from '@nestjs/common'               // Marks the class as a provider for dependency injection
import { InjectRepository } from '@nestjs/typeorm'         // Allows injecting a TypeORM repository
import { Repository } from 'typeorm'                       // Generic repository interface
import { User } from './user.entity'                       // User entity definition

@Injectable()
export class UserService {
  constructor(
    // Inject the repository for the User entity
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  /**
   * Finds an existing user by personal number or creates a new one.
   * @param personalNumber - The unique personal number identifier
   * @returns The found or newly created User entity
   */
  async findOrCreate(personalNumber: string): Promise<User> {
    // Try to find a user with the given personalNumber
    let user = await this.usersRepo.findOne({ where: { personalNumber } })

    // If no user exists, create and save a new one
    if (!user) {
      // Instantiate a new User entity object
      user = this.usersRepo.create({ personalNumber })
      // Persist the new User record to the database
      await this.usersRepo.save(user)
    }

    // Return the existing or newly saved user
    return user
  }
}

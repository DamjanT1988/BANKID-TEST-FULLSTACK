// apps/backend/src/user/user.module.ts

import { Module } from '@nestjs/common'                    // NestJS decorator to define a module
import { TypeOrmModule } from '@nestjs/typeorm'            // Module to integrate TypeORM repositories
import { UserService } from './user.service'                // Service handling user business logic
import { User } from './user.entity'                        // User entity definition for ORM

/**
 * UserModule encapsulates everything related to User management.
 * It registers the User entity repository and exposes UserService.
 */
@Module({
  // Import the User repository so that it can be injected into UserService
  imports: [TypeOrmModule.forFeature([User])],
  // Declare providers (services) that belong to this module
  providers: [UserService],
  // Export providers so they can be used in other modules (e.g., AuthModule)
  exports: [UserService],
})
export class UserModule {}

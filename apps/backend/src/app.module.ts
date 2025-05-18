// apps/backend/src/app.module.ts

import { Module } from '@nestjs/common'  
import { ConfigModule } from '@nestjs/config'            // For loading environment variables
import { TypeOrmModule } from '@nestjs/typeorm'          // For database ORM integration
import { AuthModule } from './auth/auth.module'          // BankID authentication feature module
import { UserModule } from './user/user.module'          // User management feature module
import { BankIdSession } from './auth/entities/bankid-session.entity' // Entity for persisting BankID sessions
import { User } from './user/user.entity'                // Entity for persisting users
import { I18nModule, AcceptLanguageResolver } from 'nestjs-i18n' // Internationalization support
import * as path from 'path'                             // Node.js path utilities

@Module({
  imports: [
    // 1) Load and expose environment variables globally
    ConfigModule.forRoot({ isGlobal: true }),

    // 2) Internationalization setup
    I18nModule.forRoot({
      fallbackLanguage: 'sv',                           // Default language if none matched
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),           // Folder where JSON translation files live
        watch: false,                                   // Disable watching for file changes in prod
      },
      resolvers: [AcceptLanguageResolver],              // Determine language from Accept-Language header
    }),

    // 3) TypeORM database connection
    TypeOrmModule.forRoot({
      type: 'postgres',                                 // Database type
      url: process.env.DATABASE_URL,                    // Connection string from .env
      entities: [BankIdSession, User],                  // Entities to map to DB tables
      synchronize: true,                                // Auto-create/update tables in dev (disable in prod)
    }),

    // 4) Application feature modules
    AuthModule,                                         // Contains controllers & services for /auth routes
    UserModule,                                         // Contains controllers & services for /user routes
  ],
})
export class AppModule {}

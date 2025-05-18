// apps/backend/src/main.ts

import { NestFactory } from '@nestjs/core'              // Creates a Nest application instance
import { AppModule } from './app.module'                // Root module of the application
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger' // Swagger tools for API docs

/**
 * Bootstraps the Nest application.
 */
async function bootstrap() {
  // Create the Nest application using the root AppModule
  const app = await NestFactory.create(AppModule)

  // Enable CORS to allow requests from the frontend
  // Here we allow only http://localhost:3000, adjust as needed for other environments
  app.enableCors({ origin: 'http://localhost:3000' })

  // Configure Swagger/OpenAPI documentation
  const config = new DocumentBuilder()
    .setTitle('BankID Auth API')                       // Title shown in the docs UI
    .setDescription('API for BankID authentication')   // Short description
    .setVersion('1.0')                                 // API version
    .build()

  // Create the Swagger document based on the application and config
  const document = SwaggerModule.createDocument(app, config)

  // Serve the Swagger UI at the /api-docs endpoint
  SwaggerModule.setup('api-docs', app, document)

  // Start listening for incoming HTTP requests on port 3001
  await app.listen(3001)
}

// Run the bootstrap function to start the app
bootstrap()

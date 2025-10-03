# Embarka Backend - AI Coding Instructions

## Architecture Overview

This is a **NestJS backend API** following modular architecture with PostgreSQL database and JWT authentication. The codebase uses TypeORM for database operations and follows NestJS best practices.

### Key Structural Patterns

- **Modular Design**: Each feature is organized in `/src/modules/` with dedicated controllers, services, DTOs, and entities
- **Dependency Injection**: Heavy use of NestJS DI container - always inject services in constructors
- **TypeORM Entities**: Database models use decorators and are located in `entities/` subdirectories
- **Configuration**: Centralized config in `/src/config/` using `@nestjs/config` with environment-based settings

## Essential Development Workflows

### Database Operations
```bash
# Generate migration after entity changes
npm run migration:generate -- src/migrations/MigrationName

# Run pending migrations
npm run migration:run

# For development: auto-sync (configured in database.config.ts)
# Set DB_SYNC=true in .env for development only
```

### Development Server
```bash
npm run start:dev    # Watch mode with hot reload
npm run start:debug  # Debug mode on port 9229
```

### API Documentation
- Swagger UI automatically available at `/api/docs`
- Use `@ApiProperty()` decorators on DTOs for proper documentation
- Use `@ApiOperation()` and `@ApiResponse()` on controller methods

## Project-Specific Conventions

### Authentication & Authorization
- JWT tokens issued via `/auth/login` and `/auth/register`
- Protected routes use `@UseGuards(JwtAuthGuard)` decorator
- User context available via `@User()` decorator in protected routes
- Passwords auto-hashed in User entity `@BeforeInsert()` and `@BeforeUpdate()` hooks

### Error Handling
- Use NestJS built-in exceptions: `NotFoundException`, `UnauthorizedException`, etc.
- Service layer throws exceptions, controllers handle them automatically
- Global validation pipe configured in `main.ts` for DTO validation

### Database Patterns
- All entities extend base patterns with `id`, `createdAt`, `updatedAt`
- Soft deletes implemented via `isActive` boolean field
- Repository pattern: inject with `@InjectRepository(Entity)`
- Use TypeORM query builders for complex queries

### File Organization Rules
```
modules/
├── feature-name/
│   ├── feature-name.module.ts
│   ├── feature-name.controller.ts
│   ├── feature-name.service.ts
│   ├── dto/
│   │   ├── create-feature.dto.ts
│   │   └── update-feature.dto.ts
│   └── entities/
│       └── feature.entity.ts
```

## Integration Patterns

### Adding New Modules
1. Create module structure following the pattern above
2. Export service from module for cross-module usage
3. Import module in `app.module.ts`
4. Register entities in TypeORM config if needed

### Environment Configuration
- Never hardcode values - use `ConfigService` injection
- Add new config sections in `/src/config/` following existing patterns
- Reference config with dot notation: `configService.get('database.host')`

### Testing Approach
- Unit tests alongside source files with `.spec.ts` extension
- Mock external dependencies using Jest
- E2E tests in `/test/` directory for API endpoints
- Use `@nestjs/testing` utilities for module testing

When implementing new features, follow the existing authentication and module patterns. Always use proper TypeScript typing and NestJS decorators for dependency injection and route handling.
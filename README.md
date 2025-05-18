# BankID Implementation

## Overview
This project is a simple test integration with BankID for authentication. It includes a backend (NestJS), a frontend (Next.js), and a documentation section with Docusaurus.

## Project Structure
```
/
├── apps
│   ├── backend        NestJS app with TypeORM, Zod, and i18n
│   │   ├── src        Source code (controllers, services, entities)
│   │   └── certs      Test certificates (placeholder)
│   └── frontend       Next.js app with React, Tailwind CSS, and i18next
│       ├── pages      Pages (login, callback)
│       └── public     Static assets
├── docs               Docusaurus documentation and OpenAPI
├── docker-compose.yml Docker Compose for all services (db [PostgreSQL], redis, backend, frontend)
├── .env.example       Example environment variables (copy to .env and adjust as needed)
└── README.md          This file
```

## Technologies Used
- **Docker & Docker Compose**: Service orchestration
- **PostgreSQL & Redis**: Database and session management
- **NestJS**: Backend framework (TypeScript, Swagger/OpenAPI, i18n)
- **TypeORM**: ORM for User and BankIdSession entities
- **Zod**: Incoming data validation
- **Next.js & React**: Frontend framework
- **Tailwind CSS**: Utility-first CSS
- **i18next & next-i18next**: Internationalization (Swedish/English)
- **Docusaurus**: Documentation website

## Getting Started
1. **Clone or extract** the project
2. **Copy** `.env.example` to `.env` and adjust as needed
3. **Place** your BankID test certificate and key in `apps/backend/certs`
4. **Build and start** all services with Docker Compose:
   ```bash
   docker-compose up --build
   ```
   - **db** (PostgreSQL) on port 5432
   - **redis** on port 6379
   - **backend** on port 3001
   - **frontend** on port 3000
5. **Open the frontend** in your browser:
   ```
   http://localhost:3000
   ```
6. **Test authentication**
   - Enter a dummy personal number in `YYYYMMDDNNNN` format (e.g., `198507092417`)
   - Click **Login**, scan the QR code with the BankID app
7. **Callback page**
   - After signing, you will be redirected to `/callback` to follow the status

## Development

### Start Turbo Pipeline

(Set up your env file for DB connection)

1. npm install
2. npx turbo run dev

### Start Backend
1. Navigate to the backend directory:
   ```bash
   cd apps/backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start NestJS in watch mode:
   ```bash
   npm run start:dev
   ```
   - Runs at http://localhost:3001
   - Live-reload on `src/` changes

### Start Frontend
1. Navigate to the frontend directory:
   ```bash
   cd apps/frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start Next.js in dev mode:
   ```bash
   npm run dev
   ```
   - Runs at http://localhost:3000
   - Hot-reload on `pages/` and `public/` changes

## Documentation
- API specification (Swagger/OpenAPI):
  ```
  http://localhost:3001/api-docs
  ```
- Docusaurus documentation:
  ```
  http://localhost:3000/
  ```

## Comparison to Specification

### Stakeholder Requirements
- **Desktop-first design**: Implemented in the frontend; tested down to 13″ screens.
- **Test certificates**: Example test certificates are provided under `apps/backend/certs` and used as per `.env.example`.
- **5-minute timer**: A timer exists (300 s) but lacks a UI option to restart when <30 s remain.
- **Early cancel**: The “Cancel” button calls `POST /auth/cancel` and terminates the session server-side.
- **Concurrent logins**: Each session has its own `orderRef` (UUID) and operates independently.
- **Custom BankID text**: The markdown header in the autostart payload is missing.
- **Polished UI**: Next.js, React, and TailwindCSS are used consistently.
- **Post-login state**: Displays a “Logged in” message; logout/re-login can be extended.
- **Accessibility**: React Aria imports are present but the QR component lacks full ARIA labels.

### Technical Requirements
- **Frontend stack**: TypeScript, Next.js, React, TailwindCSS, Zod, Zustand, React Aria, i18n – implemented.
- **Backend stack**: TypeScript, Nest.js, Zod, Turborepo, PostgreSQL (TypeORM), i18n – implemented.
- **Redis/ValKey**: Integration missing; sessions are stored only in Postgres.
- **Polling every second**: `GET /auth/status` is called every second.
- **QR + autostart restart**: No logic to regenerate the QR/autostart URL during the flow.
- **Error/timeout messaging**: The backend does not emit a “failed” state after full timeout.
- **Stateless & multi-instance**: All session state in Postgres supports stateless operation.
- **Local dev (Postgres+Redis)**: Docker Compose includes Postgres, but Redis is not enabled.
- **Documentation**: Docusaurus and OpenAPI specs are present under `docs/`.
- **User creation/linking**: `UserService` handles creation/fetching of users based on personal number.

### Summary of Gaps
1. Timer restart & QR regeneration when <30 s remain
2. Injection of custom markdown text into the BankID app challenge
3. Redis/ValKey integration
4. Backend emission of “failed” state on full timeout
5. Complete ARIA labels and screen-reader support for the QR code

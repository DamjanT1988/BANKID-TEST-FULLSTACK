# BankID Test Fullstack

A full-stack BankID login system implemented as a Turborepo monorepo with:

- **Frontend**: Next.js (React, TypeScript, TailwindCSS, Zustand state, Zod, i18n, QR-code generation)
- **Backend**: NestJS (TypeScript, Zod, TypeORM/Postgres, Redis, i18n, OpenAPI/Swagger)
- **Shared packages**: DTOs and config utilities
- **Docker Compose**: Postgres & Redis
- **Documentation**: Docusaurus + OpenAPI (Swagger UI)

---

## Project structure

```
monorepo/
├── apps/
│   ├── frontend/             # Next.js app
│   └── backend/              # NestJS app
├── packages/
│   ├── dto/                  # Zod DTOs
│   └── config/               # Shared config (env, etc.)
├── docker/
│   └── docker-compose.yml    # Postgres & Redis
├── docusaurus/               # Documentation site
├── .env                      # Environment variables
├── turbo.json                # Turborepo config
└── package.json              # Workspace root
```

---

## Prerequisites (Windows)

- **Node.js** v16+ (install from https://nodejs.org/)
- **npm** (bundled with Node.js) or **Yarn**
- **Docker Desktop for Windows** with **WSL2** enabled
- (Optional) BankID test certificate for real API calls

---

## Setup & Installation

1. **Unzip or clone** the project:
   ```powershell
   git clone https://github.com/DamjanT1988/BANKID-TEST-FULLSTACK.git
   cd BANKID-TEST-FULLSTACK
   ```

2. **Copy & configure** environment variables:
   ```powershell
   copy .env.example .env
   # Open .env in Notepad or your editor:
   # Set DATABASE_URL, REDIS_URL, BANKID_RP_ID, BANKID_RP_NAME,
   # BANKID_CERT_PATH, BANKID_KEY_PATH (use Windows paths if needed)
   ```

3. **Start services** (Postgres & Redis) in PowerShell:
   ```powershell
   cd docker
   docker-compose up -d
   cd ..
   ```

4. **Install dependencies** and bootstrap the monorepo:
   ```powershell
   npm install
   ```

---

## Running in Development

From the monorepo root in PowerShell or CMD:

```powershell
npx turbo run dev
```

- **Frontend**: http://localhost:3000  
- **Backend API**: http://localhost:4000  
- **Swagger UI**: http://localhost:4000/docs  
- **Docusaurus docs**: http://localhost:3000/docs (if you’ve also started the docs app)

---

## Build & Production

```powershell
# Build all packages
npx turbo run build

# Start backend in production mode
cd apps/backend
npm run start:prod

# Start frontend in production mode
cd ..frontend
npm run start
```

---

## Features

- **BankID login flow** with QR-code and polling
- 5-minute timeout with “Restart” button when <30 s remain
- Cancel login at any time
- Multiple concurrent sessions (stateless backend + Redis)
- i18n support (Swedish & English)
- Auto-generated OpenAPI docs (Swagger)
- Dockerized Postgres & Redis

---
# BankID Implementation

## Översikt
Detta projekt är en enkel testintegration mot BankID för autentisering. Det innehåller både en backend (NestJS) och en frontend (Next.js), samt en dokumentationsdel med Docusaurus.

## Projektstruktur
```
/
├── apps
│   ├── backend        NestJS-app med TypeORM, Zod och i18n
│   │   ├── src        Källkod (controllers, services, entities)
│   │   └── certs      Testcertifikat (placeholder)
│   └── frontend       Next.js-app med React, Tailwind CSS och i18next
│       ├── pages      Sidor (login, callback)
│       └── public     Static assets
├── docs               Docusaurus-dokumentation
├── docker-compose.yml Docker Compose för alla tjänster (db, redis, backend, frontend)
├── .env.example       Exempel på miljövariabler
└── README.md          Denna fil
```

## Använda teknologier
- **Docker & Docker Compose**: Orkestrering av tjänster  
- **PostgreSQL & Redis**: Databas och sessionshantering  
- **NestJS**: Backend-ramverk (TypeScript, Swagger/OpenAPI, i18n)  
- **TypeORM**: ORM för User- och BankIdSession-entiteter  
- **Zod**: Validering av inkommande data  
- **Next.js & React**: Frontend-ramverk  
- **Tailwind CSS**: Utility-first CSS  
- **i18next & next-i18next**: Internationellisering (svenska/engelska)  
- **Docusaurus**: Dokumentationswebbplats  

## Kom igång
1. **Klona eller packa upp** projektet  
2. **Kopiera** `.env.example` till `.env` och justera vid behov  
3. **Lägg in** ditt BankID-testcertifikat och nyckel i `apps/backend/certs`  
4. **Bygg och starta** alla tjänster med Docker Compose:
   ```bash
   docker-compose up --build
   ```
   - **db** (PostgreSQL) på port 5432  
   - **redis** på port 6379  
   - **backend** på port 3001  
   - **frontend** på port 3000  
5. **Öppna frontend** i webbläsaren:
   ```
   http://localhost:3000
   ```
6. **Testa inloggning**  
   - Ange ett dummy-personnummer i formatet `YYYYMMDDNNNN` (t.ex. `198507092417`)  
   - Klicka **Logga in**, skanna QR-koden i BankID-appen  
7. **Callback-sida**  
   - Efter signering omdirigeras du till `/callback` för statusuppföljning  

## Utveckling

### Starta backend
1. Gå till backend-katalogen:
   ```bash
   cd apps/backend
   ```
2. Installera beroenden:
   ```bash
   npm install
   ```
3. Starta NestJS i watch-läge:
   ```bash
   npm run start:dev
   ```
   - Kör på http://localhost:3001  
   - Live-reload vid ändringar i `src/`

### Starta frontend
1. Gå till frontend-katalogen:
   ```bash
   cd apps/frontend
   ```
2. Installera beroenden:
   ```bash
   npm install
   ```
3. Starta Next.js i dev-läge:
   ```bash
   npm run dev
   ```
   - Kör på http://localhost:3000  
   - Hot-reload vid ändringar i `pages/` och `public/`

## Dokumentation
- API-specifikation (Swagger/OpenAPI):  
  ```
  http://localhost:3001/api-docs
  ```
- Docusaurus-dokumentation:  
  ```
  http://localhost:3000/
  ```

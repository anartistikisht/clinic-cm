# Clinic CMS (MVP) – Dr. Florent Dauti
Full‑stack projekt (API + Web) për menaxhimin e terminetve dhe pasaportave shëndetësore, me dokumentim të terminit dhe raporte bazike.

## Stack
- API: Node.js + Express + Prisma + SQLite (lokalisht)
- Web: Next.js (Pages) + React

## Si të startohet lokalisht (pa Docker)
1) Kërkesa: Node 18+
2) Konfigurimi i API:
```bash
cd api
cp .env.example .env
npm i
npx prisma migrate dev --name init
npm run seed
npm run dev
```
API do të hapet në `http://localhost:4000`.

3) Konfigurimi i Web:
```bash
cd ../web
npm i
# Edito lib/api.ts nëse API nuk është në localhost:4000
npm run dev
```
Web do të hapet në `http://localhost:3000`.

### Kredencialet default (seed)
- Email: admin@clinic.local
- Password: admin123

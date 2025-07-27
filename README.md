# Hello Prisma

This is a sample REST API project built with NestJS.  
The main goal is to explore and practice with Prisma ORM and Puppeteer in a real-world backend setup.

## 🔧 Technologies Used

- [NestJS](https://nestjs.com/) – Node.js framework for scalable server-side applications  
- [Prisma ORM](https://www.prisma.io/) – Type-safe database access  
- [Puppeteer](https://pptr.dev/) – Headless browser automation  
- [Puppeteer Extra + Stealth Plugin](https://github.com/berstend/puppeteer-extra) – Anti-bot detection plugin

## 🧱 Project Structure

- `src/` → NestJS backend code (Controllers, Services, DTOs, etc.)
- `prisma/schema.prisma` → Prisma schema for DB models
- `puppeteer/` _(optional)_ → Puppeteer scripts and automation tests

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Start development server
npm run start:dev



# DB .env
DATABASE_URL="postgresql://username:password@localhost:5432/dbname"

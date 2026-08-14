@echo off
echo 🚀 Starting NEXORA Multi-Vendor E-Commerce Platform...

echo 📦 Generating Prisma Client...
call npx prisma generate

if not exist "prisma\dev.db" (
    echo 🗄️ Initializing SQLite Database ^& Seeding Data...
    call npx prisma db push
    call npm run db:seed
)

echo ✨ Launching Next.js Development Server on http://localhost:3000...
call npm run dev

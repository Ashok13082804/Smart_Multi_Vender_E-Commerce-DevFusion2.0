#!/bin/bash
echo "🚀 Starting NEXORA Multi-Vendor E-Commerce Platform..."

# Generate Prisma client
echo "📦 Generating Prisma Client..."
npx prisma generate

# Check if SQLite database exists, initialize & seed if missing
if [ ! -f "prisma/dev.db" ]; then
    echo "🗄️ Initializing SQLite Database & Seeding Data..."
    npx prisma db push
    npm run db:seed
fi

echo "✨ Launching Next.js Development Server on http://localhost:3000..."
npm run dev

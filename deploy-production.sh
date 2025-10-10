#!/bin/bash

# Production Deployment Script for Cinema App
# This script deploys the Cinema app in production mode

set -e  # Exit on error

echo "🎬 Cinema App - Production Deployment"
echo "======================================"
echo ""

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo "❌ Error: .env.production file not found!"
    echo "Please create .env.production with required variables:"
    echo "  - POSTGRES_PASSWORD"
    echo "  - AUTH_SECRET"
    exit 1
fi

# Load environment variables from .env.production
export $(grep -v '^#' .env.production | xargs)

echo "📦 Step 1: Building Docker images..."
docker-compose -f docker-compose.prod.yaml build

echo ""
echo "🚀 Step 2: Starting containers..."
docker-compose -f docker-compose.prod.yaml up -d

echo ""
echo "⏳ Step 3: Waiting for database to be ready..."
sleep 10

echo ""
echo "🗄️  Step 4: Running database migrations..."
docker exec cinema-nextjs-prod npx prisma migrate deploy

echo ""
echo "🌱 Step 5: Seeding database (optional)..."
read -p "Do you want to seed the database with sample movies? (y/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker exec cinema-nextjs-prod npx tsx prisma/seed.ts
    echo "✅ Database seeded!"
else
    echo "⏭️  Skipping database seed."
fi

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📊 Container status:"
docker-compose -f docker-compose.prod.yaml ps

echo ""
echo "🌐 Your app is now running at: http://localhost:3000"
echo ""
echo "📝 Useful commands:"
echo "  - View logs:    docker-compose -f docker-compose.prod.yaml logs -f"
echo "  - Stop app:     docker-compose -f docker-compose.prod.yaml down"
echo "  - Restart:      docker-compose -f docker-compose.prod.yaml restart"
echo ""


# 🎬 Cinema App - Next.js + PostgreSQL

A modern movie management web application built with Next.js 15, TypeScript, Prisma, and PostgreSQL.

## 🚀 Features

- ✅ **Full CRUD Operations** - Create, Read, Update, Delete movies
- ✅ **Modern UI** - Beautiful card-based interface with pagination
- ✅ **TypeScript** - Full type safety throughout the application
- ✅ **Prisma ORM** - Type-safe database access
- ✅ **PostgreSQL Database** - Robust data storage
- ✅ **Docker Support** - Production-ready containerization
- ✅ **Clean Architecture** - Separated components, hooks, and API routes

## 📋 Prerequisites

- **Node.js** 20 or higher
- **pnpm** package manager
- **Docker** (for containerized deployment)
- **PostgreSQL** 15 (if running locally without Docker)

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 15 | React framework with App Router |
| TypeScript | Type safety |
| Prisma | Database ORM |
| PostgreSQL | Database |
| Tailwind CSS | Styling |
| Docker | Containerization |

## 📦 Installation

### Development Setup

1. **Clone the repository**
   ```bash
   git clone git@github.com:gunash-portfolio/api-call-nextjs.git
   cd api-call-nextjs
   ```

2. **Install dependencies**
   ```bash
   cd my-app
   pnpm install
   ```

3. **Start the database**
   ```bash
   # From project root
   docker-compose up -d
   ```

4. **Set up environment variables**
   ```bash
   cd my-app
   echo 'DATABASE_URL="your database url"
   ```

5. **Run migrations**
   ```bash
   pnpm exec prisma migrate dev
   ```

6. **Start the development server**
   ```bash
   pnpm dev
   ```

7. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🐳 Docker Production Deployment

### Quick Start
```bash
# Build and start all services
docker-compose -f docker-compose.prod.yaml up --build -d

# View logs
docker-compose -f docker-compose.prod.yaml logs -f

# Stop services
docker-compose -f docker-compose.prod.yaml down
```

### Access the Application
- **Web App**: http://localhost:3000
- **API**: http://localhost:3000/api/movies
- **Database**: localhost:5432

For detailed Docker deployment instructions, see [`DEPLOYMENT_SUCCESS.md`](./DEPLOYMENT_SUCCESS.md) and [`my-app/DOCKER_DEPLOYMENT.md`](./my-app/DOCKER_DEPLOYMENT.md).

## 📁 Project Structure

```
api-call-nextjs/
├── my-app/                          # Next.js application
│   ├── src/
│   │   ├── app/                     # Next.js App Router
│   │   │   ├── api/movies/          # API routes
│   │   │   ├── movies/              # Movie pages
│   │   │   ├── page.tsx             # Home page
│   │   │   └── layout.tsx           # Root layout
│   │   ├── components/              # React components
│   │   │   ├── MovieCard.tsx        # Movie display card
│   │   │   └── AddMovieCard.tsx     # Add movie card
│   │   ├── hooks/                   # Custom React hooks
│   │   │   └── useMovies.ts         # Movies data fetching
│   │   ├── pagination/              # Pagination components
│   │   │   └── Pagination.tsx
│   │   ├── types/                   # TypeScript types
│   │   │   └── movie.ts
│   │   └── lib/                     # Utility functions
│   │       └── prisma.ts            # Prisma client
│   ├── prisma/                      # Database schema & migrations
│   │   ├── schema.prisma            # Database schema
│   │   ├── migrations/              # Migration files
│   │   └── seed.ts                  # Database seeding
│   ├── Dockerfile                   # Production Docker image
│   └── package.json
├── docker-compose.yaml              # Development database
├── docker-compose.prod.yaml         # Production deployment
└── README.md                        # This file
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/movies` | Get all movies |
| `GET` | `/api/movies/[id]` | Get movie by ID |
| `POST` | `/api/movies` | Create new movie |
| `PUT` | `/api/movies/[id]` | Update movie |
| `DELETE` | `/api/movies/[id]` | Delete movie |

### Example API Usage

```bash
# Get all movies
curl http://localhost:3000/api/movies

# Get specific movie
curl http://localhost:3000/api/movies/1

# Create movie
curl -X POST http://localhost:3000/api/movies \
  -H "Content-Type: application/json" \
  -d '{"title":"Inception","release_date":"2010-07-16","imdb_rating":8.8}'

# Update movie
curl -X PUT http://localhost:3000/api/movies/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"The Dark Knight","release_date":"2008-07-18","imdb_rating":9.0}'

# Delete movie
curl -X DELETE http://localhost:3000/api/movies/1
```

## 🗄️ Database Schema

```prisma
model movies {
  id           Int      @id @default(autoincrement())
  title        String   @unique
  release_date DateTime @unique
  imdb_rating  Float    @unique
}
```

## 🧪 Development

### Running Prisma Studio
```bash
cd my-app
DATABASE_URL="your_database_url" pnpm exec prisma studio
```

### Generate Prisma Client
```bash
pnpm exec prisma generate
```

### Create New Migration
```bash
# For development database
DATABASE_URL="your-database-url" pnpm exec prisma migrate dev --name your_migration_name

# For production database
DATABASE_URL="your-database-url" pnpm exec prisma migrate deploy
```

### Run Migrations in Docker
```bash
# Note: Migrations should be run from your local machine, NOT inside Docker container
# For production database:
cd my-app
DATABASE_URL="your-database-url" pnpm exec prisma migrate deploy
```

## 🎨 Code Structure Highlights

### Clean Architecture
- **Components**: Reusable UI components (`MovieCard`, `AddMovieCard`, `Pagination`)
- **Hooks**: Custom hooks for data fetching (`useMovies`)
- **API Routes**: RESTful API with proper error handling
- **Type Safety**: Full TypeScript coverage

### Best Practices
- ✅ Server components for optimal performance
- ✅ Client components only where needed
- ✅ Proper error handling and loading states
- ✅ Type-safe database access with Prisma
- ✅ Docker multi-stage builds for production
- ✅ Non-root user in Docker for security

## 🔒 Security

- Non-root user in Docker containers
- Environment variables for sensitive data
- Input validation in API routes
- Prepared statements via Prisma (SQL injection protection)

## 📝 Scripts

```bash
# Development
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run linter

# Database
pnpm prisma:generate  # Generate Prisma client
pnpm prisma:migrate   # Run migrations
pnpm prisma:studio    # Open Prisma Studio
```

## 🐛 Troubleshooting

### Port already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Database connection issues
```bash
# Check if PostgreSQL is running
docker-compose ps

# Restart database
docker-compose restart postgres
```

### Prisma Client not found
```bash
# Regenerate Prisma client
cd my-app
pnpm exec prisma generate
```

### Cannot run migrations in Docker
```bash
# ❌ This won't work:
docker exec cinema-nextjs-prod npx prisma migrate deploy
# Error: Cannot find module '@prisma/engines'

# ✅ Run migrations from your local machine instead:
cd my-app
DATABASE_URL="your-database-url" \
  pnpm exec prisma migrate deploy
```




## 📚 Documentation

- [Detailed Docker Documentation](./my-app/DOCKER_DEPLOYMENT.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)

## 🤝 Contributing

1. Create a new branch (`git checkout -b feature/amazing-feature`)
2. Make your changes
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request



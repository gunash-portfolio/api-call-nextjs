# 🎬 Cinema App - Next.js + PostgreSQL + Authentication

A modern, secure movie management web application with authentication, built with Next.js 15, TypeScript, Prisma, PostgreSQL, and NextAuth.

## ✨ Features

### 🎥 Movie Management
- ✅ **Full CRUD Operations** - Create, Read, Update, Delete movies
- ✅ **Pagination** - Browse movies with smooth pagination
- ✅ **Movie Details** - Detailed view for each movie with poster, rating, and release date

### 🔐 Authentication & Security
- ✅ **User Registration** - Sign up with email and password
- ✅ **Secure Login** - NextAuth.js with credential-based authentication
- ✅ **Password Hashing** - bcrypt encryption for secure password storage
- ✅ **Session Management** - JWT-based sessions
- ✅ **Role-Based Access** - User roles support for future authorization

### 🎨 Modern UI/UX
- ✅ **Dark Theme** - Professional dark gradient design
- ✅ **Fixed Navigation** - Sticky header with auth status
- ✅ **Responsive Design** - Mobile-first, works on all devices
- ✅ **Loading States** - Smooth loading animations
- ✅ **Error Handling** - User-friendly error messages

### 🛠️ Developer Experience
- ✅ **TypeScript** - Full type safety throughout
- ✅ **Prisma ORM** - Type-safe database access
- ✅ **Docker Support** - Production-ready containerization
- ✅ **Clean Architecture** - Separated components, hooks, and API routes
- ✅ **Automated Deployment** - One-command production deployment

## 📋 Prerequisites

- **Node.js** 20 or higher
- **pnpm** package manager
- **Docker** (for containerized deployment)
- **PostgreSQL** 15 (if running locally without Docker)

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 15** | React framework with App Router |
| **React 19** | UI library |
| **TypeScript** | Type safety |
| **NextAuth.js** | Authentication framework |
| **Prisma ORM** | Database ORM with type safety |
| **PostgreSQL 15** | Relational database |
| **bcryptjs** | Password hashing |
| **Tailwind CSS** | Utility-first CSS framework |
| **Docker** | Containerization & deployment |
| **pnpm** | Fast, efficient package manager |

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
   # Create .env file
   echo 'DATABASE_URL="postgresql://username:password@localhost:5432/database_name"' > .env
   echo 'AUTH_SECRET="your-generated-secret-here"' >> .env
   
   # Generate secure AUTH_SECRET
   openssl rand -base64 32
   # Copy the output and update AUTH_SECRET in .env
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

### Automated Deployment (Recommended)

1. **Configure production secrets**
   ```bash
   nano .env.production
   ```
   Update with your secure values:
   ```env
   POSTGRES_PASSWORD=YourSecurePassword123!
   AUTH_SECRET=generate_using_openssl_rand_base64_32
   ```

2. **Run deployment script**
   ```bash
   chmod +x deploy-production.sh
   ./deploy-production.sh
   ```

### Manual Deployment

```bash
# 1. Export environment variables
export $(grep -v '^#' .env.production | xargs)

# 2. Build and start services
docker-compose -f docker-compose.prod.yaml build
docker-compose -f docker-compose.prod.yaml up -d

# 3. Run migrations
docker exec cinema-nextjs-prod npx prisma migrate deploy

# 4. Seed database (optional)
docker exec cinema-nextjs-prod npx tsx prisma/seed.ts
```

### Useful Commands
```bash
# View logs
docker-compose -f docker-compose.prod.yaml logs -f

# Check status
docker-compose -f docker-compose.prod.yaml ps

# Restart services
docker-compose -f docker-compose.prod.yaml restart

# Stop services
docker-compose -f docker-compose.prod.yaml down
```

### Access the Application
- **Web App**: http://localhost:3000
- **Authentication**: 
  - Register: http://localhost:3000/auth/register
  - Login: http://localhost:3000/auth/login
- **API**: http://localhost:3000/api/movies
- **Database**: localhost:5432

### Production Security
- ✅ `AUTH_SECRET` configured
- ✅ Password authentication enabled
- ✅ Environment variables protected (`.env*` in `.gitignore`)
- ✅ Non-root user in Docker containers

## 📁 Project Structure

```
api-call-nextjs/
├── my-app/                          # Next.js application
│   ├── src/
│   │   ├── app/                     # Next.js App Router
│   │   │   ├── api/                 # API routes
│   │   │   │   ├── auth/            # Authentication API
│   │   │   │   │   ├── [...nextauth]/  # NextAuth handler
│   │   │   │   │   └── register/    # User registration
│   │   │   │   └── movies/          # Movies CRUD API
│   │   │   ├── auth/                # Auth pages
│   │   │   │   ├── login/           # Sign in page
│   │   │   │   └── register/        # Sign up page
│   │   │   ├── movies/              # Movie pages
│   │   │   │   ├── [id]/            # Movie detail & edit
│   │   │   │   └── add/             # Add new movie
│   │   │   ├── page.tsx             # Home page
│   │   │   ├── layout.tsx           # Root layout
│   │   │   └── globals.css          # Global styles (dark theme)
│   │   ├── components/              # React components
│   │   │   ├── MovieCard.tsx        # Movie display card
│   │   │   ├── AddMovieCard.tsx     # Add movie card
│   │   │   └── Providers.tsx        # NextAuth session provider
│   │   ├── hooks/                   # Custom React hooks
│   │   │   └── useMovies.ts         # Movies data fetching
│   │   ├── pagination/              # Pagination components
│   │   ├── services/                # Business logic
│   │   │   ├── authService.ts       # Authentication service
│   │   │   └── movieService.ts      # Movie service
│   │   ├── types/                   # TypeScript types
│   │   │   ├── movie.ts
│   │   │   ├── service.ts
│   │   │   └── next-auth.d.ts       # NextAuth type extensions
│   │   └── lib/                     # Utility functions
│   │       ├── prisma.ts            # Prisma client
│   │       └── auth.ts              # NextAuth configuration
│   ├── prisma/                      # Database
│   │   ├── schema.prisma            # Schema (movies + User)
│   │   ├── migrations/              # Migration files
│   │   └── seed.ts                  # Database seeding
│   ├── Dockerfile                   # Production Docker image
│   └── package.json
├── docker-compose.yaml              # Development setup
├── docker-compose.prod.yaml         # Production deployment
├── deploy-production.sh             # Deployment script
├── .env.production                  # Production secrets (not in git)
└── README.md                        # This file
```

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/[...nextauth]` | NextAuth handler (sign in/out) |

### Movies
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/movies` | Get all movies |
| `GET` | `/api/movies/[id]` | Get movie by ID |
| `POST` | `/api/movies` | Create new movie |
| `PUT` | `/api/movies/[id]` | Update movie |
| `DELETE` | `/api/movies/[id]` | Delete movie |

### Example API Usage

```bash
# Register new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secure123","name":"John Doe"}'

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
// Movies table
model movies {
  id           Int      @id @default(autoincrement())
  title        String   @unique
  release_date DateTime @unique
  imdb_rating  Float    @unique
}

// User authentication table
model User {
  id          Int      @id @default(autoincrement())
  email       String   @unique
  name        String?
  password    String   // bcrypt hashed
  role        String   @default("user")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  createdById Int?
}
```

### Database Relationships
- **Users** can be assigned different roles (default: "user")
- **Password** field stores bcrypt-hashed passwords
- Ready for future features like user-created movies

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
- **Components**: Reusable UI components (`MovieCard`, `AddMovieCard`, `Pagination`, `Providers`)
- **Hooks**: Custom hooks for data fetching (`useMovies`, `useSession`)
- **Services**: Separated business logic (`AuthService`, `MovieService`)
- **API Routes**: RESTful API with proper error handling
- **Type Safety**: Full TypeScript coverage with custom type definitions

### Authentication Flow
```
Register → Hash Password (bcrypt) → Store in DB → Redirect to Login
  ↓
Login → Verify Password → Create JWT Session → Store in Cookie
  ↓
Authenticated → Access Protected Routes → Auto-refresh Session
  ↓
Logout → Clear Session → Redirect to Home
```

### Best Practices
- ✅ Server components for optimal performance
- ✅ Client components only where needed (`'use client'`)
- ✅ Suspense boundaries for loading states
- ✅ Proper error handling and validation
- ✅ Type-safe database access with Prisma
- ✅ Secure password hashing with bcrypt
- ✅ JWT session management with NextAuth
- ✅ Docker multi-stage builds for production
- ✅ Non-root user in Docker for security
- ✅ Environment variables for secrets

## 🔒 Security

### Authentication Security
- ✅ **bcrypt password hashing** - Passwords never stored in plain text
- ✅ **JWT sessions** - Secure, stateless authentication
- ✅ **AUTH_SECRET** - Cryptographic secret for token signing
- ✅ **Session encryption** - All session data encrypted
- ✅ **CSRF protection** - Built into NextAuth

### Application Security
- ✅ **SQL injection protection** - Prepared statements via Prisma
- ✅ **Input validation** - Server-side validation in API routes
- ✅ **Environment variables** - Secrets not in code
- ✅ **Non-root Docker user** - Limited container permissions
- ✅ **`.gitignore` protection** - Secrets never committed

### Production Recommendations
- 🔒 Use HTTPS/SSL in production
- 🔒 Set strong `POSTGRES_PASSWORD`
- 🔒 Generate unique `AUTH_SECRET` per environment
- 🔒 Enable rate limiting for auth endpoints
- 🔒 Implement account lockout after failed attempts
- 🔒 Add email verification for new accounts

## 📝 Available Scripts

### Development
```bash
pnpm dev          # Start dev server (http://localhost:3000)
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

### Database
```bash
pnpm exec prisma generate       # Generate Prisma client
pnpm exec prisma migrate dev    # Create & apply migration
pnpm exec prisma migrate deploy # Apply migrations (production)
pnpm exec prisma studio         # Open Prisma Studio GUI
npx tsx prisma/seed.ts          # Seed database
```

### Docker
```bash
# Development
docker-compose up -d            # Start dev database
docker-compose down             # Stop dev database

# Production
./deploy-production.sh          # Full production deployment
docker-compose -f docker-compose.prod.yaml up -d    # Start production
docker-compose -f docker-compose.prod.yaml down     # Stop production
docker-compose -f docker-compose.prod.yaml logs -f  # View logs
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

### Authentication not working
```bash
# Check if AUTH_SECRET is set
docker exec cinema-nextjs-prod env | grep AUTH_SECRET

# Regenerate AUTH_SECRET if needed
openssl rand -base64 32

# Update .env.production and restart
export $(grep -v '^#' .env.production | xargs)
docker-compose -f docker-compose.prod.yaml restart nextjs-app
```

### "useSearchParams" error during build
```bash
# This is fixed in the codebase
# Component is wrapped in <Suspense> boundary
# If you see this error, make sure you're using the latest code
```

## 🎯 Key Features Explained

### Dark Theme
The entire app uses a modern dark gradient theme:
- Background: `gradient(gray-900 → black → gray-900)`
- Navigation: Fixed header with blur effect
- Cards: Semi-transparent dark backgrounds
- Buttons: White primary actions, gray secondary

### Authentication Flow
1. **Sign Up** → User creates account with email/password
2. **Password Hashing** → bcrypt hashes password (never stored plain)
3. **Sign In** → NextAuth verifies credentials
4. **Session** → JWT token stored in encrypted cookie
5. **Protected Routes** → Session checked on each request
6. **Sign Out** → Session cleared, redirect to home

### Pagination
- Client-side pagination for smooth UX
- Customizable items per page
- Previous/Next navigation
- Direct page number selection

## 📚 Documentation & Resources

### Project Documentation
- **Deployment Script**: `deploy-production.sh` - Automated deployment
- **Environment Config**: `.env.production` - Production secrets
- **Docker Compose**: Production-ready containerization

### External Documentation
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React 19 Documentation](https://react.dev/)

## 🎓 Learning Resources

This project demonstrates:
- Modern Next.js 15 App Router
- Server & Client Components
- NextAuth.js authentication
- Prisma ORM with PostgreSQL
- Docker containerization
- TypeScript best practices
- RESTful API design
- Dark theme UI/UX

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit (`git commit -m 'Add amazing feature'`)
5. Push to branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request


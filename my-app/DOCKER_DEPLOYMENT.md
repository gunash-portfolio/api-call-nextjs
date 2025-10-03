# Docker Deployment Guide for Next.js Cinema App

This guide explains how to deploy your Next.js application with PostgreSQL in Docker containers for production.

## 📋 Table of Contents
- [Overview](#overview)
- [Files Explanation](#files-explanation)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Detailed Setup](#detailed-setup)
- [Architecture](#architecture)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

Your application now has a complete Docker setup that:
- ✅ Runs Next.js in production mode
- ✅ Uses PostgreSQL database in a separate container
- ✅ Automatically runs database migrations
- ✅ Implements multi-stage builds for smaller image size
- ✅ Includes health checks for reliability
- ✅ Follows security best practices (non-root user)

---

## 📁 Files Explanation

### 1. **Dockerfile** (in `my-app/`)
This file defines how to build your Next.js application into a Docker image.

**It has 3 stages:**

#### **Stage 1: Dependencies**
```dockerfile
FROM node:20-alpine AS deps
```
- Installs `pnpm` (package manager)
- Copies `package.json` and `pnpm-lock.yaml`
- Installs all dependencies
- **Why?** Separating this stage allows Docker to cache dependencies and speed up rebuilds

#### **Stage 2: Builder**
```dockerfile
FROM node:20-alpine AS builder
```
- Copies dependencies from Stage 1
- Generates Prisma Client (database ORM)
- Builds Next.js application (`pnpm run build`)
- **Why?** This creates the optimized production build

#### **Stage 3: Runner**
```dockerfile
FROM node:20-alpine AS runner
```
- Creates a minimal image with only production files
- Creates a non-root user `nextjs` for security
- Copies built files from builder stage
- Exposes port 3000
- Includes health check to monitor app status
- **Why?** Final image is small (~150MB vs ~1GB) and secure

### 2. **.dockerignore** (in `my-app/`)
Lists files that Docker should NOT copy into the image.

**Key exclusions:**
- `node_modules/` - Will be installed fresh in Docker
- `.next/` - Will be built inside Docker
- `.env` files - Prevents leaking secrets
- Development files (README, .git, etc.)

**Why?** Reduces image size and build time, prevents security issues

### 3. **docker-compose.prod.yaml** (in root)
Orchestrates multiple containers (database + app) to work together.

**Services defined:**

#### **postgres service:**
```yaml
postgres:
  image: postgres:15-alpine
  ports: "5432:5432"
```
- Uses PostgreSQL 15 (lightweight Alpine version)
- Exposes database on port 5432
- Stores data in persistent volume `postgres_data_prod`
- Health check ensures database is ready before starting app

#### **nextjs-app service:**
```yaml
nextjs-app:
  build: ./my-app
  ports: "3000:3000"
  depends_on: postgres
```
- Builds from your Dockerfile
- Exposes web app on port 3000
- Waits for database to be healthy
- Runs migrations automatically on startup
- **Why depends_on?** Ensures database starts before the app

### 4. **next.config.ts** (updated)
Added `output: 'standalone'` configuration.

**What it does:**
- Creates a minimal standalone build
- Includes only necessary files for production
- Reduces deployment size by ~50%
- Required for Docker deployment

---

## ⚙️ Prerequisites

1. **Docker Desktop** installed ([Download](https://www.docker.com/products/docker-desktop))
2. **Docker Compose** (included with Docker Desktop)
3. Your database migrations ready in `prisma/migrations/`

---

## 🚀 Quick Start

### 1. **Create environment file**
```bash
# In my-app folder, create .env file
echo 'DATABASE_URL="postgresql://gunashfarzaliyev:secure_password_here@postgres:5432/Cinama"' > my-app/.env
```

### 2. **Build and start containers**
```bash
# From project root
docker-compose -f docker-compose.prod.yaml up --build
```

### 3. **Access your application**
- Web App: http://localhost:3000
- Database: localhost:5432

### 4. **Stop containers**
```bash
docker-compose -f docker-compose.prod.yaml down
```

---

## 🔧 Detailed Setup

### Step 1: Set Environment Variables

Create `.env` file in project root:
```bash
POSTGRES_PASSWORD=your_secure_password
POSTGRES_AUTH=scram-sha-256
```

### Step 2: Build Images

```bash
# Build without cache (fresh build)
docker-compose -f docker-compose.prod.yaml build --no-cache

# Or build specific service
docker-compose -f docker-compose.prod.yaml build nextjs-app
```

### Step 3: Start Services

```bash
# Start in foreground (see logs)
docker-compose -f docker-compose.prod.yaml up

# Start in background (detached mode)
docker-compose -f docker-compose.prod.yaml up -d

# View logs
docker-compose -f docker-compose.prod.yaml logs -f
docker-compose -f docker-compose.prod.yaml logs -f nextjs-app
```

### Step 4: Run Database Migrations

Migrations run automatically on startup, but you can also run manually:

```bash
# Access the container
docker exec -it cinema-nextjs-prod sh

# Run migrations
npx prisma migrate deploy

# Seed database (if needed)
npx prisma db seed
```

### Step 5: Verify Health

```bash
# Check container status
docker ps

# Check health
docker-compose -f docker-compose.prod.yaml ps

# Test health endpoint
curl http://localhost:3000/api/movies
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│         Docker Host                     │
│                                         │
│  ┌──────────────────┐  ┌─────────────┐ │
│  │  nextjs-app      │  │  postgres   │ │
│  │  (Port 3000)     │──│  (Port 5432)│ │
│  │                  │  │             │ │
│  │  - Next.js       │  │  - Database │ │
│  │  - Prisma Client │  │  - Volumes  │ │
│  └──────────────────┘  └─────────────┘ │
│           │                    │        │
│           └──── Network ───────┘        │
│                                         │
└─────────────────────────────────────────┘
         │                    │
    Port 3000             Port 5432
         │                    │
    ┌────▼────────────────────▼────┐
    │      Your Browser/Client     │
    └──────────────────────────────┘
```

**Network Communication:**
- Containers communicate via Docker network `app-network`
- Next.js connects to database using hostname `postgres` (container name)
- External access via exposed ports (3000, 5432)

---

## 🔐 Environment Variables

### Database Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@postgres:5432/Cinama` |
| `POSTGRES_USER` | Database username | `gunashfarzaliyev` |
| `POSTGRES_PASSWORD` | Database password | `secure_password` |
| `POSTGRES_DB` | Database name | `Cinama` |

### Application Variables
| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | App port | `3000` |
| `HOSTNAME` | Bind address | `0.0.0.0` |

---

## 🐛 Troubleshooting

### Problem: "Connection refused" error

**Cause:** App tries to connect before database is ready

**Solution:**
```bash
# Check database health
docker-compose -f docker-compose.prod.yaml ps

# Wait for postgres to be "healthy" status
```

### Problem: "Module not found" error

**Cause:** Dependencies not installed correctly

**Solution:**
```bash
# Rebuild without cache
docker-compose -f docker-compose.prod.yaml build --no-cache nextjs-app
```

### Problem: Prisma Client errors

**Cause:** Generated Prisma client not found

**Solution:**
```bash
# Regenerate Prisma client
docker exec -it cinema-nextjs-prod sh
npx prisma generate
exit
docker-compose -f docker-compose.prod.yaml restart nextjs-app
```

### Problem: Port already in use

**Cause:** Another service using port 3000 or 5432

**Solution:**
```bash
# Check what's using the port
lsof -i :3000
lsof -i :5432

# Kill the process or change ports in docker-compose.prod.yaml
```

### Problem: Database data lost after restart

**Cause:** Volume not persisted

**Solution:**
```bash
# Check volumes
docker volume ls

# Ensure volume exists
docker-compose -f docker-compose.prod.yaml up -d
```

---

## 📦 Production Deployment

### For Cloud Deployment (AWS, GCP, Azure):

1. **Push image to registry:**
```bash
# Tag image
docker tag cinema-nextjs-prod your-registry.com/cinema-app:latest

# Push to registry
docker push your-registry.com/cinema-app:latest
```

2. **Use managed database** (recommended):
- AWS RDS
- Google Cloud SQL
- Azure Database for PostgreSQL

Update `DATABASE_URL` to point to managed database.

3. **Use secrets management:**
- AWS Secrets Manager
- Azure Key Vault
- Google Secret Manager

### Performance Optimization:

```bash
# Check image size
docker images cinema-nextjs-prod

# Optimize: Currently ~150MB with alpine base
```

---

## 🎯 Development vs Production

### Development (current setup):
```bash
docker-compose up  # Uses docker-compose.yaml
```
- Hot reload enabled
- Debug mode
- Detailed error messages

### Production (new setup):
```bash
docker-compose -f docker-compose.prod.yaml up
```
- Optimized build
- Standalone mode
- Health checks
- Security hardening

---

## 📚 Useful Commands

```bash
# View all running containers
docker ps

# View logs
docker-compose -f docker-compose.prod.yaml logs -f

# Restart specific service
docker-compose -f docker-compose.prod.yaml restart nextjs-app

# Stop all services
docker-compose -f docker-compose.prod.yaml down

# Stop and remove volumes (⚠️ deletes data)
docker-compose -f docker-compose.prod.yaml down -v

# Execute command in container
docker exec -it cinema-nextjs-prod sh

# View resource usage
docker stats

# Clean up unused images/containers
docker system prune -a
```

---

## ✅ Checklist for Production

- [ ] Set strong `POSTGRES_PASSWORD`
- [ ] Use environment variables for secrets
- [ ] Run database backups regularly
- [ ] Monitor container health
- [ ] Set up logging (e.g., ELK stack)
- [ ] Configure reverse proxy (Nginx/Traefik)
- [ ] Enable HTTPS/SSL
- [ ] Set up CI/CD pipeline
- [ ] Test rollback procedures
- [ ] Document recovery process

---

## 🆘 Need Help?

Common issues and solutions are in the [Troubleshooting](#troubleshooting) section.

For Docker-specific issues: https://docs.docker.com/
For Next.js deployment: https://nextjs.org/docs/deployment
For Prisma in production: https://www.prisma.io/docs/guides/deployment


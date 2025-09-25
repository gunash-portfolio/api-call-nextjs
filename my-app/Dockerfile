# Use an official Node.js runtime that matches your local version.
# '22-alpine' is the perfect choice for Node.js v22.x.
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Enable pnpm using corepack, the official method for managing package managers
RUN corepack enable

# Copy the dependency definition files
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm.
# The --frozen-lockfile flag is a best practice for reproducible builds.
RUN pnpm install --frozen-lockfile

# Copy the rest of your application's source code
COPY . .

# Make port 3000 available outside this container
EXPOSE 3000

# The command to run when the container starts
CMD ["pnpm", "run", "dev"]
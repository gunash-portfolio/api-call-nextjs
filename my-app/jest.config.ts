import type { Config } from 'jest';
import nextJest from 'next/jest';

// Provide the path to your Next.js app to load next.config.ts and .env files
const createJestConfig = nextJest({
  dir: './',
});

// Add custom Jest config
const config: Config = {
  // Setup files BEFORE Jest is initialized (for polyfills)
  setupFiles: ['<rootDir>/jest.polyfills.js'],
  
  // Setup files to run after Jest is initialized
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  
  // Test environment for React components
  testEnvironment: 'jest-environment-jsdom',
  
  // Module path aliases (match your tsconfig.json paths)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  
  // Where to find test files
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/__tests__/**/*.test.tsx',
  ],
  
  // Transform ES modules from node_modules
  transformIgnorePatterns: [
    'node_modules/(?!(next-auth)/)',
  ],
  
  // Coverage options (optional)
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/types/**',
    '!src/generated/**',
  ],
};

// createJestConfig is exported to ensure next/jest can load the Next.js config (async)
export default createJestConfig(config);
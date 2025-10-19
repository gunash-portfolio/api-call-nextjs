import '@testing-library/jest-dom';

// Polyfill for Web APIs needed by Next.js
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

// Mock environment variables
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://test:test@localhost:5432/test';
process.env.AUTH_SECRET = process.env.AUTH_SECRET || 'test-secret-for-testing';
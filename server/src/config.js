import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: Number(process.env.PORT || 5000),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  frontendApiUrl: process.env.VITE_API_URL || 'http://localhost:5000',
  jwtSecret: process.env.JWT_SECRET || 'repairlens-dev-secret-change-me',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/repairlens?schema=public',
};

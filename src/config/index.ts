import { ClientConfig } from "pg";

process.loadEnvFile();

export const PORT = parseInt(process.env.PORT ?? "") || 4000;

export const secretToken = process.env.JWT_SECRET!;

export const algoritmic = "HS256";

export const production = false;

export const DATABASE = {
  user: process.env.DATABASE_USER!,
  database: process.env.DATABASE_USER!,
  host: process.env.DATABASE_HOST!,
  password: process.env.DATABASE_PASSWORD!,
  port: parseInt(process.env.DATABASE_PORT ?? "") || 5432,
} satisfies ClientConfig;

export const apiKeyDemo = process.env.ALPHA_API_KEY_DEMO;

export const apikeyProduction = process.env.ALPHA_VANTAGE_API_KEY;

export const apiUrl = process.env.ALPHA_VANTAGE_API_URL;

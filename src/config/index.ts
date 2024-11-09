process.loadEnvFile();

export const PORT = parseInt(process.env.PORT!) | 4000;

export const secretToken = process.env.JWT_SECRET!;

export const algoritmic = "HS256";

export const production = false;

export const DATABASE = {
  user: process.env.DATABASE_USER!,
  database: process.env.DATABASE_USER!,
  host: process.env.DATABASE_HOST,
  password: process.env.DATABASE_PASSWORD,
  port: parseInt(process.env.DATABASE_PORT!),
};

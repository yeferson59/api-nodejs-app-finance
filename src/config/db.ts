import pg from "pg";

const { Pool } = pg;

const db = new Pool({
  user: "postgres",
  database: "postgres",
  host: "localhost",
  password: "1127357",
  port: 5432,
});

export default db;

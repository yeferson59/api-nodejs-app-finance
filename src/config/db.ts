import pg from "pg";
import { DATABASE } from "./index";

const { Pool } = pg;

const db = new Pool(DATABASE);

export default db;

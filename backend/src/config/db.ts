import { Pool } from "pg";
import ENV from "./env.js";

const pool = new Pool({
  connectionString: ENV.DB_URI,
  ssl: ENV.NODE_ENV === "prod" ? { rejectUnauthorized: false } : false,
});

export const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log("Database connected successfully!");
    client.release();
  } catch (error) {
    console.error("Database connected failed", error);
    process.exit(1);
  }
};

export default pool;

import "dotenv/config";
import type { EnvConfig } from "../types/types.d.js";

const ENV: Partial<Readonly<EnvConfig>> = {
  PORT: process.env.PORT ? +process.env.PORT : 5000,
  NODE_ENV: (process.env.NODE_ENV as "dev" | "prod") ?? "dev",
  DB_URI: process.env.DB_URI ?? "",
};
export default ENV;

export interface EnvConfig {
  PORT: number;
  HOSTNAME: string;
  NODE_ENV: "dev" | "prod";
  DB_URI: string;
  JWT_SECRET: string;
  GEMINI_API_KEY: string;
}

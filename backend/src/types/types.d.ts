export interface EnvConfig {
  PORT: number;
  HOSTNAME: string;
  NODE_ENV: "dev" | "prod";
  DB_URI: string;
  JWT_SECRET: string;
  RESEND_API_KEY: string;
  RESEND_EMAIL: string;
  GOOGLE_CLIENT_ID: string;
}

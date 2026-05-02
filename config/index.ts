import "dotenv/config";

// Validation of required environment variables
const requiredEnvVars = ["JWT_SECRET"] as const;
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export const config = {
  mode: process.env.NODE_ENV || "development",
  jwtSecret: process.env.JWT_SECRET!, // now guaranteed to exist
  port: Number(process.env.PORT) || 3000,
  host: "0.0.0.0",
  refreshTokenCleanupIntervalMinutes: Number(
    process.env.REFRESH_TOKEN_CLEANUP_INTERVAL_MINUTES || 60,
  ),

  db: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_DATABASE || "tenda_back",
    storage: process.env.DB_STORAGE || "./database.sqlite",
  },

  mail: {
    host: process.env.SMTP_HOST || "smtp.mailtrap.io",
    port: Number(process.env.SMTP_PORT) || 2525,
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
    from: process.env.EMAIL_FROM || "",
  },
};

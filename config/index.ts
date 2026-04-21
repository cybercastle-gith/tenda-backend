import "dotenv/config";

// Validação de variáveis obrigatórias
const requiredEnvVars = ["SECRET"] as const;
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export const config = {
  mode: process.env.NODE_ENV || "development",
  secret: process.env.SECRET!, // agora é garantido que existe
  port: Number(process.env.PORT) || 3000,
  host: "0.0.0.0",

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

import dotenv from "dotenv";

process.env.NODE_ENV = process.env.NODE_ENV || "development";

if (process.env.NODE_ENV === "development") {
  dotenv.config();
}

export default {
  PORT: process.env.PORT || 5000,
  FCL_ENVIRONMENT: process.env.FCL_ENVIRONMENT || "testnet",
  DATABASE_URL: process.env.DATABASE_URL || "",
  MAX_PROCESS_HEIGHT_PER_BLOCK_ITERATION: process.env.MAX_PROCESS_HEIGHT_PER_BLOCK_ITERATION
    ? parseInt(process.env.MAX_PROCESS_HEIGHT_PER_BLOCK_ITERATION)
    : 500,
  MAX_BLOCK_SCAN_RANGE: process.env.MAX_BLOCK_SCAN_RANGE
    ? parseInt(process.env.MAX_BLOCK_SCAN_RANGE)
    : 40,
  SLEEP_INTERVAL: process.env.SLEEP_INTERVAL ? parseInt(process.env.SLEEP_INTERVAL) : 5000,
  BACKOFF_OPTIONS: {
    numOfAttempts: process.env.BACKOFF_ATTEMPTS ? parseInt(process.env.BACKOFF_ATTEMPTS) : 7,
  },
  AGENDA: {
    DB_COLLECTION: process.env.AGENDA_DB_COLLECTION,
    POOL_TIME: process.env.AGENDA_POOL_TIME,
    CONCURRENCY: parseInt(process.env.AGENDA_CONCURRENCY, 10),
  },
  NODEMAILER_HOST: process.env.NODEMAILER_HOST,
  NODEMAILER_PORT: process.env.NODEMAILER_PORT ? parseInt(process.env.NODEMAILER_PORT) : 2525,
  NODEMAILER_AUTH_TYPE: process.env.NODEMAILER_AUTH_TYPE,
  NODEMAILER_AUTH_USER: process.env.NODEMAILER_AUTH_USER,
  NODEMAILER_AUTH_SERVICE_CLIENT: process.env.NODEMAILER_AUTH_SERVICE_CLIENT,
  NODEMAILER_AUTH_PRIVATE_KEY: process.env.NODEMAILER_AUTH_PRIVATE_KEY,
  AUTH_BASIC_USER: process.env.AUTH_BASIC_USER,
  AUTH_BASIC_PASS: process.env.AUTH_BASIC_PASS,
};

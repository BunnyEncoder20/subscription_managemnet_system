import { config } from "dotenv";

config({
    path: `.env.${process.env.NODE_ENV || "development"}.local`,
});

export const {
    PORT,
    NODE_ENV,
    DB_URI,
    JWT_SECRET,
    JWT_EXPIRY_IN,
    ARCJET_KEY,
    ARCJET_ENV,
    QSTASH_URL,
    QSTASH_TOKEN,
    SERVER_URL,
    EMAIL,
    EMAIL_PASSWORD,
} = process.env;

import dotenv from 'dotenv';
dotenv.config();

export const CONFIGS = {
  PORT: process.env.PORT,
  SALT_ROUND: process.env.SALT_ROUND,
  JWT_SECRET: process.env.JWT_SECRET,
};

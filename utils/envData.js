const secret = process.env.secret;
const GOOGLE_ID = process.env.GOOGLE_ID;
const GOOGLE_SECRET = process.env.GOOGLE_SECRET;
const DATABASE_USER = process.env.DATABASE_USER;
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
const DATABASE_URL = process.env.DATABASE_URL;
const BASE_URL = process.env.BASE_URL;
const CLOUD_API_KEY = process.env.CLOUD_API_KEY;
const CLOUD_API_SECRET = process.env.CLOUD_API_SECRET;
const CLOUD_NAME = process.env.CLOUD_NAME;
const CLOUD_UPDATE_PRESET = process.env.CLOUD_UPDATE_PRESET;
const CLOUD_API = process.env.CLOUD_API;
const NEXTAUTH_URL = process.env.NEXTAUTH_URL;

module.exports = {
  CLOUD_NAME,
  CLOUD_API_KEY,
  CLOUD_API_SECRET,
  secret,
  GOOGLE_ID,
  GOOGLE_SECRET,
  DATABASE_PASSWORD,
  DATABASE_URL,
  DATABASE_USER,
  BASE_URL,
  CLOUD_UPDATE_PRESET,
  CLOUD_API,
  NEXTAUTH_URL,
};

require("dotenv").config();

const CONFIG = {
  PORT: process.env.PORT,
  DB_URL: process.env.DB_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  BCRYPT_SECRET: process.env.BCRYPT_SECRET,
};
module.exports = CONFIG;

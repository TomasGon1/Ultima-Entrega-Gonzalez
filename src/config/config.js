require("dotenv").config();

const config = {
  mongo_url: process.env.MONGO_URL,
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  callback_url: process.env.CALLBACK_URL,
};

module.exports = config;

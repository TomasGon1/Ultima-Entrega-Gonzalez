const dotenv = require("dotenv");
const program = require("../utils/commander.js");

const {mode} = program.opts();

dotenv.config({
  path: mode === "produccion" ? "./.env.produccion" : "./.env.desarrollo"
});

const config = {
  mongo_url: process.env.MONGO_URL,
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  callback_url: process.env.CALLBACK_URL,
  port: process.env.PORT,
  mode_env: process.env.MODE_ENV,
};

module.exports = config;

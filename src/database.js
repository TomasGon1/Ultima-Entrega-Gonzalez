const mongoose = require("mongoose");
const config = require("./config/config.js");
const {mongo_url} = config;

mongoose
  .connect(mongo_url)
  .then(() => console.log("Conexion exitosa"))
  .catch(() => console.log("Error en la conexion", error));

const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://xnicksyux:coder1234@cluster0.4c2ggph.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("Conexion exitosa"))
  .catch(() => console.log("Error en la conexion", error));

const express = require("express");
const router = express.Router();
const GeneratorDev = require("../controllers/mocking.controller.js");
const generatorDev = new GeneratorDev();
const restrictAccess = require("../middleware/modeMiddleware.js");
const config = require("../config/config.js");
const { mode_env } = config;

//Ruta generadora de productos:

router.get("/mockingproducts", restrictAccess, (req, res) => {
  const products = [];

  for (let i = 0; i < 15; i++) {
    products.push(generatorDev.productsGenerator());
  }
  res.json(products);
});

//Ruta generadora de usuarios:

router.get("/mockingusers", restrictAccess, (req, res) => {
  const users = [];

  for (let i = 0; i < 15; i++) {
    users.push(generatorDev.userGenerator());
  }
  res.json(users);
});

//Logger de errores

router.get("/loggertest", (req, res) => {
  req.logger.fatal("Error fatal!!");
  req.logger.error("Error grave!!");
  req.logger.warning("Esto es un warning!");
  req.logger.info("Esto es solo informacion!");
  req.logger.debug("Esto es un debug!");
  res.send(`Test de logs en modo ${config.mode_env}`);
});

module.exports = router;

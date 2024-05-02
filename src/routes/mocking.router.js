const express = require("express");
const router = express.Router();
const GeneratorDev = require("../controllers/mocking.controller.js");
const generatorDev = new GeneratorDev();

//Ruta generadora de productos:

router.get("/mockingproducts", (req, res) => {
  const products = [];

  for (let i = 0; i < 15; i++) {
    products.push(generatorDev.productsGenerator());
  }
  res.json(products);
});

//Ruta generadora de usuarios:

router.get("/mockingusers", (req, res) => {
  const users = [];

  for (let i = 0; i < 15; i++) {
    users.push(generatorDev.userGenerator());
  }
  res.json(users);
});

module.exports = router;

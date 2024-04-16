const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/product.controller.js");
const productController = new ProductController();

//Lista de productos
router.get("/", productController.getProducts);

//Producto por id
router.get("/:pid", productController.getProductsById);

//Agregar nuevo producto
router.post("/", productController.addProducts);

//Actualizar por id
router.put("/:pid", productController.updateProducts);

//Eliminar producto
router.delete("/:pid", productController.deleteProductsById);

module.exports = router;

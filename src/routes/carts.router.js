const express = require("express");
const router = express.Router();
const CartController = require("../controllers/cart.controller.js");
const cartController = new CartController();

//Creo carrito
router.post("/", cartController.newCart);

//Listado de productos
router.get("/:cid", cartController.getCartById);

//Agregar productos al carrito
router.post("/:cid/product/:pid", cartController.addProductToCart);

//Elimino un producto especifico
router.delete("/:cid/product/:pid", cartController.deleteProductToCart);

//Actualizo productos en el carrito
router.put("/:cid", cartController.updateCart);

//Actualizo cantidad de producto
router.put("/:cid/product/:pid", cartController.updateQuantityOfProduct);

//Vaciar carrito
router.delete("/:cid", cartController.emptyCart);

module.exports = router;

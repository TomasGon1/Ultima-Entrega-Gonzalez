const express = require("express");
const router = express.Router();

const CartManager = require("../controllers/cart-manager-db.js");
const CartModel = require("../models/cart.model.js");
const cartManager = new CartManager();

//Creo carrito
router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.json(newCart);
  } catch (error) {
    console.error("Error al crear carrito", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

//Listado de productos
router.get("/:cid", async (req, res) => {
  const cartId = req.params.cid;

  try {
    const cart = await CartModel.findById(cartId);

    if (!cart) {
      console.log("No existe carrito con ese id");
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    return res.json(cart.products);
  } catch (error) {
    console.error("Error al obtener carrito", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

//Agregar productos al carrito
router.post("/:cid/product/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity || 1;

  try {
    const updateCart = await cartManager.addProductToCart(
      cartId,
      productId,
      quantity
    );
    res.json(updateCart.products);
  } catch (error) {
    console.error("Error al agregar producto", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

//Elimino un producto especifico
router.delete("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    const updateCart = await cartManager.deleteProductToCart(cartId, productId);

    res.json({
      status: "success",
      message: "Producto eliminado del carrito exitosamente!",
      updateCart,
    });
  } catch (error) {
    console.error("Error al eliminar el producto del carrito", error);
    res.status(500).json({
      status: "error",
      error: "Error interno del servidor",
    });
  }
});

//Actualizo producto del carrito
router.put("/:cid", async (req, res) => {
  const cartId = req.params.cid;
  const updatedProducts = req.body;

  try {
    const updatedCart = await cartManager.updateCart(cartId, updatedProducts);
    res.json(updatedCart);
  } catch (error) {
    console.error("Error al actualizar el carrito", error);
    res.status(500).json({
      status: "error",
      error: "Error interno del servidor",
    });
  }
});

//Actualizo cantidad de producto
router.put("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const newQuantity = req.body.quantity;

    const updatedCart = await cartManager.updateQuantityOfProduct(
      cartId,
      productId,
      newQuantity
    );

    res.json({
      status: "success",
      message: "Cantidad del producto actualizada exitosamente!",
      updatedCart,
    });
  } catch (error) {
    console.error(
      "Error al actualizar la cantidad del producto en el carrito",
      error
    );
    res.status(500).json({
      status: "error",
      error: "Error interno del servidor",
    });
  }
});

//Vaciar carrito
router.delete("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;

    const updatedCart = await cartManager.emptyCart(cartId);

    res.json({
      status: "success",
      message:
        "Todos los productos del carrito fueron eliminados exitosamente!",
      updatedCart,
    });
  } catch (error) {
    console.error("Error al vaciar el carrito", error);
    res.status(500).json({
      status: "error",
      error: "Error interno del servidor",
    });
  }
});

module.exports = router;

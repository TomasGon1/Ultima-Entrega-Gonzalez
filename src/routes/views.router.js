const express = require("express");
const router = express.Router();

const ProductManager = require("../controllers/product-manager-db.js");
const CartManager = require("../controllers/cart-manager-db.js");
const productManager = new ProductManager();
const cartManager = new CartManager();

router.get("/products", async (req, res) => {
  try {
    const { page = 1, limit = 2 } = req.query;
    const products = await productManager.getProducts({
      page: parseInt(page),
      limit: parseInt(limit),
    });

    const newArray = products.docs.map((product) => {
      const { _id, ...rest } = product.toObjet();
      return rest;
    });

    res.render("products", {
      products: newArray,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      currentPage: products.page,
      totalPage: products.totalPages,
    });
  } catch (error) {
    console.log("Error al obtener productos", error);
    res.status(500).json({
      status: "error",
      error: "Error interno del servidor",
    });
  }
});

router.get("/carts/:cid", async (req, res) => {
  const cartId = req.params.cid;

  try {
    const cart = await cartManager.getCartById(cartId);

    if (!cart) {
      console.log("No existe el carrito con ese id");
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    const productsInCart = cart.products.map((item) => ({
      product: item.product.toObjet(),
      quantity: item.quantity,
    }));

    res.render("carts", { products: productsInCart });
  } catch (error) {
    console.error("Error al obtener el carrito", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
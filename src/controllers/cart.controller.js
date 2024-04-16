const CartServices = require("../services/cart.services.js");
const cartServices = new CartServices();

class CartController {
  async newCart(req, res) {
    try {
      const newCart = await cartServices.createCart();
      res.json(newCart);
    } catch (error) {
      console.log("Error al crear carrito", error);
      res.status(500).send("Error interno del servidor");
    }
  }

  async getCartById(req, res) {
    const cartId = req.params.cid;
    try {
      const cart = await cartServices.getCartById(cartId);
      if (!cart) {
        return res
          .status(400)
          .json({ error: "Error al encontrar carrito por ID" });
      }
      return res.json(cart);
    } catch (error) {
      console.error("Error al obtener carrito", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  async addProductToCart(req, res) {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;
    try {
      const updateCart = await cartServices.addProductToCart(
        cartId,
        productId,
        quantity
      );
      res.json(updateCart.products);
    } catch (error) {
      console.error("Error al agregar producto", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  async deleteProductToCart(req, res) {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    try {
      const updateCart = await cartServices.deleteProductToCart(
        cartId,
        productId
      );
      res.json({
        status: "success",
        message: "Producto eliminado del carrito exitosamente!",
        updateCart,
      });
    } catch (error) {
      console.error("Error al eliminar el producto del carrito", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  async updateCart(req, res) {
    const cartId = req.params.cid;
    const updatedProducts = req.body;
    try {
      const updatedCart = await cartServices.updateCart(
        cartId,
        updatedProducts
      );
      res.json(updatedCart);
    } catch (error) {
      console.error("Error al actualizar el carrito", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  async updateQuantityOfProduct(req, res) {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const newQuantity = req.body.quantity;
    try {
      const updatedCart = await cartServices.updateQuantityOfProduct(
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
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  async emptyCart(req, res) {
    const cartId = req.params.cid;
    try {
      const updatedCart = await cartServices.emptyCart(cartId);
      res.json({
        status: "success",
        message:
          "Todos los productos del carrito fueron eliminados exitosamente!",
        updatedCart,
      });
    } catch (error) {
      console.error("Error al vaciar el carrito", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
}

module.exports = CartController;
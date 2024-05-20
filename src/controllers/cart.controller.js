const TicketModel = require("../models/ticket.model.js");
const UserModel = require("../models/user.model.js");
const CartRepository = require("../repositories/cart.repository.js");
const cartRepository = new CartRepository();
const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository();
const { generateTicketCode, buyTotal } = require("../utils/cartutils.js");
const EmailManager = require("../services/email.js");
const emailManager = new EmailManager();

//Custom Errors:
const { cartInfoError } = require("../services/errors/info.js");
const { EErrors } = require("../services/errors/enums.js");
const CustomError = require("../services/errors/custom-error.js");

class CartController {
  async newCart(req, res) {
    try {
      const newCart = await cartRepository.createCart();
      res.json(newCart);
    } catch (error) {
      console.log("Error al crear carrito", error);
      res.status(500).send("Error interno del servidor");
    }
  }

  async getCartById(req, res) {
    const cartId = req.params.cid;
    try {
      const cart = await cartRepository.getCartById(cartId);
      if (!cart) {
        throw CustomError.createError({
          name: "Invalid cart ID",
          cause: cartInfoError(cart),
          message: "Error al encontrar carrito",
          code: EErrors.CART_ERROR,
        });
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
      const updateCart = await cartRepository.addProductToCart(
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
      const updateCart = await cartRepository.deleteProductToCart(
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
      const updatedCart = await cartRepository.updateCart(
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
      const updatedCart = await cartRepository.updateQuantityOfProduct(
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
      const updatedCart = await cartRepository.emptyCart(cartId);
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

  async endBuys(req, res) {
    const cartId = req.params.cid;
    try {
      const cart = await cartRepository.getCartById(cartId);
      const products = cart.products;

      const nonAvilableProducts = [];

      for (const item of products) {
        const productId = item.product;
        const product = await productRepository.getProductsById(productId);

        if (product.stock >= item.quantity) {
          product.stock -= item.quantity;
          await product.save();
        } else {
          nonAvilableProducts.push(productId);
        }
      }

      const userCart = await UserModel.findOne({ cart: cartId });

      const ticket = new TicketModel({
        code: generateTicketCode(),
        purchase_datetime: new Date(),
        amounth: buyTotal(cart.products),
        purchaser: userCart._id,
      });
      await ticket.save();

      cart.products = cart.products.filter((item) =>
        nonAvilableProducts.some((productId) => productId.equals(item.product))
      );

      await cart.save();

      await emailManager.sendMailBuy(userCart.email, userCart.first_name, ticket._id);

      res.render("checkout", {
        cliente: userCart.first_name,
        email: userCart.email,
        numTicket: ticket._id
      });
    } catch (error) {
      console.error("Error al procesar la compra:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
}

module.exports = CartController;

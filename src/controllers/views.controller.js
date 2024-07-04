const ProductModel = require("../models/product.model.js");
const UserModel = require("../models/user.model.js");
const CartRepository = require("../repositories/cart.repository.js");
const cartRepository = new CartRepository();

class ViewsController {
  async renderProducts(req, res) {
    try {
      const { page = 1, limit = 3 } = req.query;
      const skip = (page - 1) * limit;
      const products = await ProductModel.find().skip(skip).limit(limit);

      const totalProducts = await ProductModel.countDocuments();
      const totalPages = Math.ceil(totalProducts / limit);

      const hasPrevPage = page > 1;
      const hasNextPage = page < totalPages;

      const newArray = products.map((product) => {
        const { _id, ...rest } = product.toObject();
        return { id: _id, ...rest };
      });

      res.render("products", {
        products: newArray,
        hasPrevPage,
        hasNextPage,
        prevPage: page > 1 ? parseInt(page) - 1 : null,
        nextPage: page < totalPages ? parseInt(page) + 1 : null,
        currentPage: parseInt(page),
        totalPages,
      });
    } catch (error) {
      console.log("Error al obtener productos", error);
      res.status(500).json({
        status: "error",
        error: "Error interno del servidor",
      });
    }
  }

  async renderCart(req, res) {
    const cartId = req.params.cid;
    try {
      const cart = await cartRepository.getCartById(id);
      if (!cart) {
        console.log("No existe el carrito con ese id");
        return res.status(404).json({ error: "Carrito no encontrado" });
      }

      let totalBuys = 0;

      const productsInCart = cart.products.map((item) => {
        const product = item.product.toObject();
        const quantity = item.quantity;
        const totalPrice = product.price * quantity;

        totalBuys += totalPrice;

        return {
          product: { ...product, totalPrice },
          quantity,
          cartId,
        };
      });

      res.render("carts", { products: productsInCart, totalBuys, cartId });
    } catch (error) {
      console.error("Error al obtener el carrito", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async renderLogin(req, res) {
    if (req.session.login) {
      return res.redirect("/profile");
    }

    res.render("login");
  }

  async renderRegister(req, res) {
    if (req.session.login) {
      return res.redirect("/profile");
    }

    res.render("register");
  }

  async renderRealTimeProducts(req, res) {
    try {
      res.render("realtimeproducts");
    } catch (error) {
      console.log("error en la vista real time", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async renderChat(req, res) {
    res.render("chat");
  }

  async renderResetPassword(req, res) {
    res.render("passwordreset");
  }

  async renderPasswordChange(req, res) {
    res.render("passwordchange");
  }

  async renderConfirmation(req, res) {
    res.render("sendconfirmation");
  }

  async renderPanelPremium(req, res) {
    res.render("panel-premium");
  }

  async renderAllUser(req, res) {
    try {
      const users = await UserModel.find();

      const usersData = users.map((user) => {
        const {_id, first_name, last_name, email, role, last_connection} = user;
        return {
          id: _id,
          first_name,
          last_name,
          email,
          role,
          last_connection,
        };
      });

      res.render("all-users", {users: usersData});
    } catch (error) {
      console.log("error al obtener los usuarios:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
}

module.exports = ViewsController;

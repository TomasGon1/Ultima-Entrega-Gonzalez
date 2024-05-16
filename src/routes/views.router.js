const express = require("express");
const router = express.Router();
const ViewsController = require("../controllers/views.controller.js");
const viewsController = new ViewsController();
const authorize = require("../middleware/checkrole.js");


//Vista de productos:
router.get("/products", authorize(["usuario", "premium"]),viewsController.renderProducts);

//Vista de carrito:
router.get("/carts/:cid", viewsController.renderCart);

//Vista de login:
router.get("/login", viewsController.renderLogin);

//Vista de registro:
router.get("/register", viewsController.renderRegister);

//Vista perfil:
//router.get("/profile", viewsController.renderProfile);

//Vista chat:
router.get("/chat", authorize(["usuario", "premium"]),viewsController.renderChat);

//Vista real time products:
router.get("/realtimeproducts", authorize(["admin", "premium"]),viewsController.renderRealTimeProducts);

module.exports = router;

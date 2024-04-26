const express = require("express");
const router = express.Router();
const ViewsController = require("../controllers/views.controller.js");
const viewsController = new ViewsController();


//Vista de productos:
router.get("/products", viewsController.renderProducts);

//Vista de carrito:
router.get("/carts/:cid", viewsController.renderCart);

//Vista de login:
router.get("/login", viewsController.renderLogin);

//Vista de registro:
router.get("/register", viewsController.renderRegister);

//Vista perfil:
//router.get("/profile", viewsController.renderProfile);

//Vista chat:
router.get("/chat", viewsController.renderChat);

//Vista real time products:
router.get("/realtimeproducts", viewsController.renderRealTimeProducts);

module.exports = router;

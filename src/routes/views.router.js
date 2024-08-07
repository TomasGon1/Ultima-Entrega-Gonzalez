const express = require("express");
const router = express.Router();
const ViewsController = require("../controllers/views.controller.js");
const viewsController = new ViewsController();
const authorize = require("../middleware/checkrole.js");
const passport = require("passport");

//Vista de productos:
router.get(
  "/products",
  authorize(["usuario", "premium"]),
  viewsController.renderProducts
);

//Vista de carrito:
router.get("/carts/:cid", viewsController.renderCart);

//Vista de login:
router.get("/login", viewsController.renderLogin);

//Vista de registro:
router.get("/register", viewsController.renderRegister);

//Vista chat:
router.get(
  "/chat",
  authorize(["usuario", "premium"]),
  viewsController.renderChat
);

//Vista real time products:
router.get(
  "/realtimeproducts",
  authorize(["admin"]),
  viewsController.renderRealTimeProducts
);

//Restablecimiento de Contraseña
router.get("/reset-password", viewsController.renderResetPassword);
router.get("/password", viewsController.renderPasswordChange);
router.get("/confirmacion-envio", viewsController.renderConfirmation);

//Panel usuario premium
router.get(
  "/panel-premium",
  authorize(["premium"]),
  viewsController.renderPanelPremium
);

//Obtengo todos los usuarios
router.get("/all-users", authorize(["admin"]), viewsController.renderAllUser);

//Perfil
router.get("/profile", viewsController.profile);

module.exports = router;

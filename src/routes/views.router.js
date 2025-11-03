const express = require("express");
const router = express.Router();
const ViewsController = require("../controllers/views.controller.js");
const viewsController = new ViewsController();
const authorizeRoles = require("../middleware/checkrole.js");


//Vista de productos:
router.get(
  "/products",
  authorizeRoles("user", "premium"),
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
  authorizeRoles("user", "premium"),
  viewsController.renderChat
);

//Vista real time products:
router.get(
  "/realtimeproducts",
  authorizeRoles("admin"),
  viewsController.renderRealTimeProducts
);

//Restablecimiento de Contraseña
router.get("/reset-password", viewsController.renderResetPassword);
router.get("/password", viewsController.renderPasswordChange);
router.get("/confirmacion-envio", viewsController.renderConfirmation);

//Panel usuario premium
router.get(
  "/panel-premium",
  authorizeRoles("premium"),
  viewsController.renderPanelPremium
);

//Obtengo todos los usuarios
router.get("/all-users", authorizeRoles("admin"), viewsController.renderAllUser);

//Perfil
router.get("/profile", viewsController.profile.bind(viewsController));

router.get("/", viewsController.home)

module.exports = router;

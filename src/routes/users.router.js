const express = require("express");
const router = express.Router();

const UserController = require("../controllers/user.controller.js");
const passport = require("passport");
const userController = new UserController();
const upload = require("../middleware/multer.js");
const UserRepository = require("../repositories/user.repository.js");
const userRepository = new UserRepository();
const authorize = require("../middleware/checkrole.js");

//Registro
router.post(
  "/register",
  userController.register
);

//Login
router.post(
  "/login",
  /* passport.authenticate("local"), */
  userController.login
);



//Logout
router.post("/logout", userController.logout.bind(userController));

//Github
router.get("/github", userController.loginGitHub);
router.get("/githubcallback", userController.loginGitHubCallback);

//Admin
router.get("/admin", passport.authenticate("local"), authorize(["admin"]), userController.admin);

//Restablecimiento de Contraseña
router.post("/requestPasswordReset", userController.requestPasswordReset);
router.post("/reset-password", userController.resetPassword);

//Usuario Premium
router.put("/premium/:uid", authorize(["premium"]), userController.changeRolPremium);
router.post(
  "/:uid/documents",
  upload.fields([
    { name: "document" },
    { name: "products" },
    { name: "profile" },
  ]), authorize(["premium"]),
  async (req, res) => {
    const { uid } = req.params;
    const uploadedDocuments = req.files;

    try {
      const user = await userRepository.findById(uid);
      if (!user) {
        return res.status(404).send("Usuario no encontrado");
      }

      if (uploadedDocuments) {
        if (uploadedDocuments.document) {
          user.documents = user.documents.concat(
            uploadedDocuments.document.map((doc) => ({
              name: doc.originalname,
              reference: doc.path,
            }))
          );
        }
        if (uploadedDocuments.prodcuts) {
          user.documents = user.documents.concat(
            uploadedDocuments.products.map((doc) => ({
              name: doc.originalname,
              reference: doc.path,
            }))
          );
        }
        if (uploadedDocuments.profile) {
          user.documents = user.documents.concat(
            uploadedDocuments.profile.map((doc) => ({
              name: doc.originalname,
              reference: doc.path,
            }))
          );
        }
      }

      await user.save();

      res.status(200).send("Documentos subidos con exito!");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error interno del servidor");
    }
  }
);

//Obtengo todos los usuarios
router.get("/all-users", authorize(["user", "premium"]), userController.getAllUsers);

//Eliminar usuarios inactivos
router.delete("/delete/:uid", authorize(["admin"]), userController.deleteInactiveUser);

module.exports = router;

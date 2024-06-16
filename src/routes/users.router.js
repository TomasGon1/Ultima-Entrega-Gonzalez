const express = require("express");
const router = express.Router();

const UserController = require("../controllers/user.controller.js");
const passport = require("passport");
const userController = new UserController();
const upload = require("../middleware/multer.js");
const UserRepository = require("../repositories/user.repository.js");
const userRepository = new UserRepository();

//Registro
router.post(
  "/register",
  passport.authenticate("local"),
  userController.register
);

//Login
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
  }),
  userController.login
);

//Perfil
router.get("/profile", passport.authenticate("local"), userController.profile);

//Logout
router.post("/logout", userController.logout.bind(userController));

//Github
router.get("/github", userController.loginGitHub);
router.get("/githubcallback", userController.loginGitHubCallback);

//Admin
router.get("/admin", passport.authenticate("local"), userController.admin);

//Restablecimiento de Contraseña
router.post("/requestPasswordReset", userController.requestPasswordReset);
router.post("/reset-password", userController.resetPassword);

//Usuario Premium
router.put("/premium/:uid", userController.changeRolPremium);
router.post(
  "/:uid/documents",
  upload.fields([
    { name: "document" },
    { name: "products" },
    { name: "profile" },
  ]),
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

module.exports = router;

const express = require("express");
const router = express.Router();

const UserController = require("../controllers/user.controller.js");
const passport = require("passport");
const userController = new UserController();

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

module.exports = router;

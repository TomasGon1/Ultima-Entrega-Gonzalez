const express = require("express");
const router = express.Router();
const passport = require("passport");
const UserController = require("../controllers/user.controller.js");
const userController = new UserController();

//Registro
router.post("/register", passport.authenticate("register", { failureRedirect: "/failedregister" }), userController.register);
router.get("/failedregister", (req, res) => {
  res.send({ error: "Registro fallido" });
});

//Login
router.post("/login", passport.authenticate("login",{ failureRedirect: "/faillogin" }), userController.login);
router.get("/faillogin", (req, res) => {
  res.send({ error: "Fallo todo el login" });
});

//Perfil
router.get("/profile", passport.authenticate("local", {session: false} ), userController.profile);

//Logout
router.get("/logout", userController.logout);

//Github
router.get("/github", passport.authenticate("github", {scope: ["user:email"]}), async (req, res) => {});
router.get("/githubcallback", passport.authenticate("github", { failureRedirect: "login" }), userController.github);


module.exports = router;

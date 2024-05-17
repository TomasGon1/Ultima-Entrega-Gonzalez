const express = require("express");
const router = express.Router();
const passport = require("passport");

const UserController = require("../controllers/user.controller.js");
const userController = new UserController();

//Registro
router.post("/register", userController.register);

//Login
router.post("/login", userController.login);

//Perfil
router.get("/profile", passport.authenticate("local", {session: false}), userController.profile);

//Logout
router.post("/logout", userController.logout.bind(userController));

//Github


//Admin
router.get("/admin", userController.admin);

module.exports = router;

const express = require("express");
const router = express.Router();
const passport = require("passport");
const UserDTO = require("../dto/user.dto.js");

//Comentado hasta arreglar
//const UserController = require("../controllers/user.controller.js");
//const userController = new UserController();

//Registro
router.post(
  "/",
  passport.authenticate("register", { failureRedirect: "/failedregister" }),
  async (req, res) => {
    if (!req.user) return res.status(400).send({ status: "error" });

    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      age: req.user.age,
      email: req.user.email,
    };

    req.session.login = true;

    res.redirect("/profile");
  }
);

router.get("/failedregister", (req, res) => {
  res.send({ error: "Registro fallido" });
});

//Login
router.post(
  "/login",
  passport.authenticate(
    "login",
    { failureRedirect: "/api/sessions/faillogin" },
    async (req, res) => {
      if (!req.user) return res.status(400).send({ status: "error" });

      req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email,
      };

      req.session.login = true;

      res.redirect("/profile");
    }
  )
);

router.get("/faillogin", (req, res) => {
  res.send({ error: "Fallo todo el login" });
});

//Perfil
router.get("/profile", (req, res) => {
  const userDTO = new UserDTO(
    req.user.first_name,
    req.user.last_name,
    req.user.role
  );

  const admin = req.user.role === "admin";

  if (!req.session.login) {
    return res.redirect("/login");
  }
  res.render("profile", { user: req.session.login, userDTO, admin });
});

//Logout
router.get("/logout", (req, res) => {
  if (req.session.login) {
    req.session.destroy();
  }
  res.redirect("/login");
});

//Github
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "login" }),
  async (req, res) => {
    req.session.user = req.user;
    req.session.login = true;
    req.redirect("/profile");
  }
);

module.exports = router;

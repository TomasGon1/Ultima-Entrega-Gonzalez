const UserDTO = require("../dto/user.dto.js");
const UserModel = require("../models/user.model.js");
const CartModel = require("../models/cart.model.js");
const passport = require("passport");
const { createHash, isValidPassword } = require("../utils/hashbcrypt.js");

//Errores custom
const {
  registerInfoError,
  loginInfoError,
} = require("../services/errors/info.js");
const { EErrors } = require("../services/errors/enums.js");
const CustomError = require("../services/errors/custom-error.js");

class UserController {
  async register(req, res) {
    const { first_name, last_name, email, password, age } = req.body;
    try {
      const existingUser = await UserModel.finndOne({ email });
      if (existingUser) {
        throw CustomError.createError({
          name: "Register fail",
          cause: registerInfoError({ first_name, last_name, email, age }),
          message: "Error al registrarse",
          code: EErrors.REGISTER_FAIL,
        });
      }

      const newCart = new CartModel();
      await newCart.save();

      const newUser = new UserModel({
        first_name,
        last_name,
        email,
        cart: newCart._id,
        password: createHash(password),
        age,
      });
      await newUser.save();

      res.redirect("/api/users/profile");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error interno del servidor");
    }
  }

  async login(req, res) {
    const { email, password } = req.body;
    try {
      const userFound = await UserModel.findOne({ email });
      if (!userFound) {
        throw CustomError.createError({
          name: "Login fail",
          cause: loginInfoError({ email, password }),
          message: "Error al intentar logearse, usuario invalido!",
          code: EErrors.USER_IVALID,
        });
      }

      const isValid = isValidPassword(password, userFound);
      if (!isValid) {
        throw CustomError.createError({
          name: "Login fail",
          cause: loginInfoError({ email, password }),
          message: "Error al intentar logearse, contraseña invalida!",
          code: EErrors.USER_IVALID,
        });
      }

      res.redirect("/api/users/profile");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error interno del servidor");
    }
  }

  async profile(req, res) {
    const userDTO = new UserDTO(
      req.user.first_name,
      req.user.last_name,
      req.user.role
    );
    const isAdmin = req.user.role === "admin";
    res.render("profile", { user: userDTO, isAdmin });
  }

  async logout(req, res) {
    req.logout();
    res.redirect("/login");
  }

  async loginGitHub(req, res) {
    passport.authenticate("github", { scope: ["user:email"] })(req, res, next);
  }

  async loginGitHubCallback(req, res) {
    passport.authenticate("github", (err, user) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.redirect("/login");
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.redirect("/api/users/profile");
      });
    })(req, res, next);
  }

  async admin(req, res) {
    if (req.user.user.role !== "admin") {
      return res.status(403).send("Acceso denegado");
    }
    res.render("admin");
  }
}

module.exports = UserController;

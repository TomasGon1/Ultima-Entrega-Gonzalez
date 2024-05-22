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

//Email Manager y Token
const EmailManager = require("../services/email.js");
const emailManager = new EmailManager();
const { resetToken } = require("../utils/tokenreset.js");

class UserController {
  async register(req, res) {
    const { first_name, last_name, email, password, age } = req.body;
    try {
      const existingUser = await UserModel.findOne({ email });
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
    try {
      const userDTO = new UserDTO(
        req.user.first_name,
        req.user.last_name,
        req.user.role
      );
      const isAdmin = req.user.role === "admin";
      const isPremium = req.user.role === "premium";
      res.render("profile", { user: userDTO, isAdmin, isPremium });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error interno del servidor");
    }
  }

  async logout(req, res) {
    req.logout();
    res.redirect("/login");
  }

  async loginGitHub(req, res, next) {
    passport.authenticate("github", { scope: ["user:email"] })(req, res, next);
  }

  async loginGitHubCallback(req, res, next) {
    passport.authenticate("github", (err, user) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.redirect("/api/users/login");
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

  async requestPasswordReset(req, res) {
    const { email } = req.body;

    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(404).send("Usuario no encontrado");
      }

      const token = resetToken();

      user.resetToken = {
        token: token,
        expiresAt: new Date(Date.now() + 3600000),
      };
      await user.save();

      await emailManager.restorePassword(email, user.first_name, token);

      res.redirect("/confirmacion-envio");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error interno del servidor");
    }
  }

  async resetPassword(req, res) {
    const { email, password, token } = req.body;

    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.render("passwordchange", { error: "Usuario no encontrado" });
      }

      const resetToken = user.resetToken;
      if (!resetToken || resetToken.token !== token) {
        return res.render("passwordreset", {
          error: "El codigo de restablecimiento es invalido",
        });
      }

      const now = new Date();
      if (now > resetToken.expiresAt) {
        return res.render("passwordreset", {
          error: "El codigo de restablecimiento ha expirado",
        });
      }

      if (isValidPassword(password, user)) {
        return res.render("passwordchange", {
          error: "La nueva contraseña no puede ser igual a la anterior",
        });
      }

      user.password = createHash(password);
      user.resetToken = undefined;
      await user.save();

      return res.redirect("/login");
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .render("passwordreset", { error: "Error interno del servidor" });
    }
  }

  async changeRolPremium(req, res) {
    try {
      const { uid } = req.params;

      const user = await UserModel.findById(uid);
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      const newRol = user.role === "usuario" ? "premium" : "usuario";

      const updatedRol = await UserModel.findByIdAndUpdate(
        uid,
        { role: newRol },
        { new: true }
      );
      res.json(updatedRol);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error interno del servidor");
    }
  }
}

module.exports = UserController;

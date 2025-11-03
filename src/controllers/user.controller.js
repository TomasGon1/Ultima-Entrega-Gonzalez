const UserModel = require("../models/user.model.js");
const CartModel = require("../models/cart.model.js");
const passport = require("passport");
const { createHash, isValidPassword } = require("../utils/hashbcrypt.js");
const UserRepository = require("../repositories/user.repository.js");
const userRepository = new UserRepository();

//Middleware
const assignCartToUser = require("../middleware/assignCart.js");

//Errores custom
const {
  registerInfoError,
  allUsersError,
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
      const existingUser = await userRepository.findByEmail(email);
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
      await userRepository.create(newUser);

      res.redirect("/login");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error interno del servidor");
    }
  }

  async login(req, res) {
    const { email, password } = req.body;
    try {
      const userFound = await userRepository.findByEmail(email);
      if (!userFound) {
        return res.status(400).send("Usuario no encontrado");
      }

      const isValid = isValidPassword(password, userFound);
      if (!isValid) {
        return res.status(400).send("Contraseña incorrecta");
      }

      userFound.last_connection = new Date();

      await assignCartToUser(userFound);

      await userFound.save();

      req.session.user = {
        id: userFound._id,
        first_name: userFound.first_name,
        last_name: userFound.last_name,
        email: userFound.email,
        age: userFound.age,
        role: userFound.role,
        cart: userFound.cart,
      };

      res.redirect("/profile");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error interno del servidor");
    }
  }

  async logout(req, res) {
    try {
      if (req.session.user) {
        const userFound = await UserModel.findById(req.session.user.id);
        if (userFound) {
          userFound.last_connection = new Date();
          await userFound.save();
        }
      }

      req.session.destroy((err) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error al cerrar sesion");
        }
        res.redirect("/login");
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error interno del servidor");
    }
  }

  async loginGitHub(req, res, next) {
    passport.authenticate("github", { scope: ["user:email"] })(req, res, next);
  }

  async loginGitHubCallback(req, res, next) {
    passport.authenticate("github", (err, user) => {
      if (err) return next(err);
      if (!user) return res.redirect("/api/users/login");

      req.logIn(user, async (err) => {
        if (err) return next(err);

        try {
          await assignCartToUser(user);

          req.session.user = {
            id: user._id,
            first_name: user.first_name || "GitHubUser",
            last_name: user.last_name || "",
            email: user.email,
            age: user.age || 0,
            role: user.role || "user",
            cart: user.cart,
          };

          return res.redirect("/profile");
        } catch (error) {
          console.error("Error al asignar carrito:", error);
          res.status(500).send("Error interno del servidor");
        }
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
      const user = await userRepository.findByEmail(email);
      if (!user) {
        return res.status(404).send("Usuario no encontrado");
      }

      const token = resetToken();

      user.resetToken = {
        token: token,
        expiresAt: new Date(Date.now() + 3600000),
      };
      await userRepository.save(user);

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
      const user = await userRepository.findByEmail(email);
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

      const user = await userRepository.findById(uid);
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      const requiredDocuments = [
        "Identificación",
        "Comprobante de domicilio",
        "Comprobante de estado de cuenta",
      ];
      const userDocuments = user.documents.map((doc) => doc.name);

      const hasRequiredDocuments = requiredDocuments.every((doc) =>
        userDocuments.includes(doc)
      );

      if (!hasRequiredDocuments) {
        return res.status(400).json({
          message:
            "El usuario debe cargar los siguientes documentos: Identificación, Comprobante de domicilio, Comprobante de estado de cuenta",
        });
      }

      const newRol = user.role === "usuario" ? "premium" : "usuario";

      const updatedRol = await userRepository.updateUserRole(uid, newRol);
      res.json(updatedRol);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error interno del servidor");
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await UserModel.find(
        {},
        { first_name: 1, last_name: 1, email: 1, role: 1, last_connection: 1 }
      );

      if (!users) {
        throw CustomError.createError({
          name: "Get all users fail",
          cause: allUsersError(),
          message: "Error al obtener todos los usuarios",
          code: EErrors.USER_IVALID,
        });
      }

      res.json({ status: "success", payload: users });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error interno del servidor");
    }
  }

  async deleteInactiveUser(req, res) {
    try {
      const inactiveUsers = await UserModel.find({
        last_connection: {
          $lt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
      });

      inactiveUsers.forEach(async (user) => {
        await emailManager.sendMailInactiveUser(user.email, user.first_name);

        await UserModel.findByIdAndDelete(user._id);
      });

      res
        .status(200)
        .send({ message: "Usuarios inactivos eliminados correctamente" });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error interno del servidor");
    }
  }
}

module.exports = UserController;

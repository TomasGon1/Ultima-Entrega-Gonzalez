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
    const {email, password} = req.body;
    try {
      const userFound = await UserModel.findOne({email});
      if(!userFound) {
        
      }
    } catch (error) {
      
    }
  }
}

module.exports = UserController;

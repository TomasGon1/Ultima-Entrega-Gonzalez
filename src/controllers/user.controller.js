const UserDTO = require("../dto/user.dto.js");
const UserModel = require("../models/user.model.js");
const CartModel = require("../models/cart.model.js");
const passport = require("passport");
const {createHash, isValidPassword} = require("../utils/hashbcrypt.js");

//Errores custom
const {
  registerInfoError,
  loginInfoError,
} = require("../services/errors/info.js");
const { EErrors } = require("../services/errors/enums.js");
const CustomError = require("../services/errors/custom-error.js");

class UserController {
  static async register(req, res) {
    try {
      const {first_name, last_name, email, password, age} = req.body;

      const existingUser = await UserModel.finndOne({email});
      if(existingUser) {
        
      }
    } catch (error) {
      
    }
  }
}

module.exports = UserController;
const UserModel = require("../models/user.model.js");

function authorize(role) {
  return async function (req, res, next) {
    try {
      const userId = req.userId;
      const userModel = await UserModel.findById(userId);

      if (userModel && user.role === role) {
        next();
      } else {
        return res.status(403).json({ message: "Acceso prohibido" });
      }
    } catch (error) {
      console.error("Error de autorización:", error);
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  };
}

module.exports = authorize;
const UserModel = require("../models/user.model.js");

function authorizeRoles(...allowedRoles) {
  return async function (req, res, next) {
    try {
      const userId = req.session.user?.id;
      if (!userId) {
        return req.status(401).json({ message: "Usuario no autorizado" });
      }

      const userModel = await UserModel.findById(userId);

      if (userModel && allowedRoles.includes(userModel.role)) {
        next();
      } else {
        return res.status(403).json({ message: "Acceso prohibido para tu rol" });
      }
    } catch (error) {
      console.error("Error de autorizacion:", error);
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  };
}

module.exports = authorizeRoles;

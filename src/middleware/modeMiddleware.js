const config = require("../config/config.js");
const { mode_env } = config;

const restrictAccess = (req, res, next) => {
  if (config.mode_env === "produccion") {
    return res
      .status(403)
      .json({ message: "Acceso prohibido en modo producción" });
  }

  next();
};

module.exports = restrictAccess;

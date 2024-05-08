const config = require("../config/config.js")
const {mode_env} = config;
const {loggerD, loggerP} = require("../utils/logger.js");

const logger = mode_env === "produccion" ? loggerP : loggerD;

const addLogger = (req, res, next) => {
    req.logger = logger;
    req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`);
    next();
}

module.exports = addLogger;
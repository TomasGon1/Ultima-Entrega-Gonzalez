const winston = require("winston");

//Configuro los niveles y colores:

const niveles = {
  nivel: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colores: {
    fatal: "red",
    error: "yellow",
    warning: "blue",
    info: "green",
    http: "magenta",
    debug: "white",
  },
};

//Logger desarrollo

const loggerD = winston.createLogger({
  levels: niveles.nivel,
  transports: [
    new winston.transports.Console({
      level: "debug",
    }),
  ],
});

//Logger produccion

const loggerP = winston.createLogger({
  levels: niveles.nivel,
  transports: [
    new winston.transports.File({
      filename: "./errors.log",
      level: "error",
    }),
  ],
});

module.exports = {
  loggerD,
  loggerP,
};

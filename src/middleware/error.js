const { EErrors } = require("../services/errors/enums.js");

const errorHandler = (error, req, res, next) => {
  console.log(error.cause);

  switch (error.code) {
    case EErrors.USER_IVALID:
      res.send({ status: "error", error: error.name });
      break;
    case EErrors.REGISTER_FAIL:
      res.send({ status: "error", error: error.name });
      break;
    case EErrors.CART_ERROR:
      res.send({ status: "error", error: error.name });
      break;
    case EErrors.PRODUCT_ERROR:
      res.send({ status: "error", error: error.name });
      break;
    case EErrors.DB_ERROR:
      res.send({ status: "error", error: error.name });
      break;
    default:
      res.send({ status: "error", error: "Unknown" });
  }
};

module.exports = errorHandler;
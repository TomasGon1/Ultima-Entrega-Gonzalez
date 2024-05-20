const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const MongoStore = require("connect-mongo");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const initializePassport = require("./config/passport.config.js");
const errorHandler = require("./middleware/error.js");
require("./database.js");

const config = require("./config/config.js");
const { mongo_url, port, mode_env } = config;
const addLogger = require("./middleware/errorLogger.js");
const authMiddleware = require("./middleware/authMiddleware.js");

const routerP = require("./routes/products.router.js");
const routerC = require("./routes/carts.router.js");
const routerU = require("./routes/users.router.js");
const routerV = require("./routes/views.router.js");
const routerMock = require("./routes/mocking.router.js");

//Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./src/public"));
app.use(cookieParser());
app.use(errorHandler);
app.use(
  session({
    secret: "secretCoder",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: mongo_url,
      ttl: 100,
    }),
  })
);
app.use(addLogger);
app.use(authMiddleware);

//Passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

//Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Uso de rutas
app.use("/api/products", routerP);
app.use("/api/carts", routerC);
app.use("/api/users", routerU);
app.use("/", routerV);

//Pruebas dev
app.use("/", routerMock);
app.use("/loggertest", (req, res) => {
  req.logger.fatal("Error fatal!!")
  req.logger.error("Error grave!!");
  req.logger.warning("Esto es un warning!");
  req.logger.info("Esto es solo informacion!");
  req.logger.debug("Esto es un debug!");
  console.log(config.mode_env);
  res.send("Test de logs");
})

//Listen
const httpServer = app.listen(port, () => {
  console.log(`Escuchando en el puerto: ${port}`);
});

//Websockets: 
const SocketManager = require("./sockets/socketmanager.js");
new SocketManager(httpServer);
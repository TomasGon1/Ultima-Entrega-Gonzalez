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
const routerDev = require("./routes/dev.router.js");

//swagger
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUiExpress = require("swagger-ui-express");

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
app.use("/", routerDev);

//Configuracion Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentacion de KeysGamers",
      description:
        "Web dedicada a compra y venta de Keys de videojuegos para Steam",
    },
  },
  apis: ["./src/docs/**/*.yaml"],
};

const specs = swaggerJSDoc(swaggerOptions);

app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

//Listen
const httpServer = app.listen(port, () => {
  console.log(`Escuchando en el puerto: ${port} en modo ${config.mode_env}`);
});

//Websockets:
const SocketManager = require("./sockets/socketmanager.js");
new SocketManager(httpServer);

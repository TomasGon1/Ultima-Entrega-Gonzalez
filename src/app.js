const express = require("express");
const app = express();
const PUERTO = 8080;
const exphbs = require("express-handlebars");
const MongoStore = require("connect-mongo");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const initializePassport = require("./config/passport.config.js");
require("./database.js");

const config = require("./config/config.js");
const { mongo_url } = config;

const routerP = require("./routes/products.router.js");
const routerC = require("./routes/carts.router.js");
const routerU = require("./routes/users.router.js");
const routerS = require("./routes/sessions.router.js");
const routerV = require("./routes/views.router.js");

//Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./src/public"));
app.use(cookieParser());
app.use(
  session({
    secret: "secretCoder",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: mongo_url,
      ttl: 100,
    }),
  })
);

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
app.use("/api/sessions", routerS);
app.use("/", routerV);

//Listen
app.listen(PUERTO, () => {
  console.log(`Escuchando en el puerto: ${PUERTO}`);
});

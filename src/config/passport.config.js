const passport = require("passport");
const local = require("passport-local");
const GitHubStrategy = require("passport-github2");

const UserModel = require("../models/user.model.js");
const { createHash, isValidPassword } = require("../utils/hashbcrypt.js");
const CartModel = require("../models/cart.model.js");
const config = require("./config.js");
const { client_id, client_secret, callback_url } = config;

const LocalStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;

        try {
          //Verifico si existe un registro con ese mail
          const userExist = await UserModel.findOne({ email });
          if (userExist) {
            return res.status(400).send("Usuario ya registrado");
          }

          //Carrito
          const newCart = new CartModel();
          await newCart.save();

          //Registro nuevo
          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            cart: newCart._id,
          };

          let resultado = await UserModel.create(newUser);

          return done(null, resultado);
        } catch (error) {
          console.error(error);
          res.status(500).send("Error interno del servidor");
        }
      }
    )
  );

  //Estrategia Login
  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (email, password, done) => {
        try {
          //Verifico si existe un usuario con ese email
          const user = await UserModel.findOne({ email });
          if (!user) {
            return res.status(401).send("Usuario no válido");
          }

          //verifico la contraseña
          if (!isValidPassword(password, user)) return done(null, false);
          return done(null, user);
        } catch (error) {
          console.error(error);
          res.status(500).send("Error interno del servidor");
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await UserModel.findById({ _id: id });
    done(null, user);
  });

  //Estrategia GitHub
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: client_id,
        clientSecret: client_secret,
        callbackURL: callback_url,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await UserModel.findOne({ email: profile._json.email });

          if (!user) {
            let newUser = {
              first_name: profile._json.name,
              last_name: "",
              age: "",
              email: profile._json.email,
              password: "",
            };

            let result = await UserModel.create(newUser);
            done(null, result);
          } else {
            done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

module.exports = initializePassport;

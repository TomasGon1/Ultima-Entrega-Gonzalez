const passport = require("passport");
const local = require("passport-local");
const GitHubStrategy = require("passport-github2");

const UserModel = require("../models/user.model.js");
const { createHash, isValidPassword } = require("../utils/hashbcrypt.js");

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
          let user = await UserModel.findOne({ email: email });
          if (user) return done(null, false);

          //Registro nuevo
          let newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
          };

          let resultado = await UserModel.create(newUser);

          return done(null, resultado);
        } catch (error) {
          return done(error);
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
            console.log("Este usuario no existe");
            return done(null, false);
          }
          //verifico la contraseña
          if (!isValidPassword(password, user)) return done(null, false);
          return done(null, user);
        } catch (error) {
          return done(error);
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
};

//Estrategia GitHub
passport.use(
  "github",
  new GitHubStrategy({
    clientID: "Iv1.63dddd80bb34a6f6",
    clientSecret: "d474fa68911b14f86ad9bc0d0801f7f507ff75e9",
    callbackURL: "http://localhost:8080/api/sessions/githubcallback",
  }),
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await UserModel.findOne({ email: profile._json.email });

      if (!user) {
        let newUser = {
          first_name: profile._json.name,
          last_name: "",
          age: profile._json.age,
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
);

module.exports = initializePassport;

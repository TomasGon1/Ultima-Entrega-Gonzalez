const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const UserModel = require("../models/user.model.js");
const { isValidPassword } = require("../utils/hashbcrypt.js");

const config = require("./config.js");
const { client_id, client_secret, callback_url } = config;

//Estrategia
const initializePassport = () => {
  //Local
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (email, password, done) => {
        try {
          const user = await UserModel.findOne({ email });

          if (!user) {
            return done(null, false, {
              message: "Correo electronico o contraseña incorrecta",
            });
          }

          if (!isValidPassword) {
            return done(null, false, {
              message: "Correo electronico o contraseña incorrecta",
            });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  //Github
  passport.use(
    new GitHubStrategy(
      {
        clientID: client_id,
        clientSecret: client_secret,
        callbackURL: callback_url,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await UserModel.findOne({
            email: profile.emails[0].value,
          });

          if (!user) {
            user = new UserModel({
              email: profile.emails[0].value,
            });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  //Serializar y deserializar
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await UserModel.findById({_id: id});
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};

module.exports = initializePassport;
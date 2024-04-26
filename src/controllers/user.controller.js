const UserDTO = require("../dto/user.dto.js");

class UserController {
  async register(req, res) {
    if (!req.user) return res.status(400).send({ status: "error" });

    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      age: req.user.age,
      email: req.user.email,
    };

    req.session.login = true;

    res.redirect("/api/users/profile");
  }

  async login(req, res) {
    if (!req.user) return res.status(400).send({ status: "error" });

    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      age: req.user.age,
      email: req.user.email,
    };

    req.session.login = true;

    res.redirect("/api/users/profile");
  }

  async profile(req, res) {
    const userDTO = new UserDTO(
      req.user.first_name,
      req.user.last_name,
      req.user.role
    );

    const admin = req.user.role === "admin";

    if (!req.session.login) {
      return res.redirect("/login");
    }

    res.render("profile", { user: req.session.login, userDTO, admin });
  }

  async logout(req, res) {
    if (req.session.login) {
        req.session.destroy();
      }
      res.redirect("/login");
  }

  async github(req, res) {
    req.session.user = req.user;
    req.session.login = true;
    req.redirect("/api/user/profile");
  }
}

module.exports = UserController;
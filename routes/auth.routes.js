const router = require("express").Router();
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const saltRounds = 10;

const User = require("../models/User.model");

router.get("/signup", (_, res) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const { username, email, password } = req.body;

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;

  if (!regex.test(password)) {
    res
      .status(500)
      .render("auth/signup", {
        errorMessage:
          "Your password needs at least 6 chars and least one number, one lowercase and one uppercase letter.",
      });
    return;
  }

  if (!username || !email || !password) {
    res.render("auth/signup", {
      errorMessage:
        "All fields are mandatory. Please provide your user name, email and password.",
    });
    return;
  }

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      return User.create({
        username,
        email,
        password: hashedPassword,
      });
    })
    .then((userFromDB) => {
      console.log(`New user created is`, userFromDB);
    })
    .then(() => res.redirect("/login"))
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render("auth/signup", { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(500).render("auth/signup", {
          errorMessage:
            "User name and email need to be unique. Either user name or email is already used.",
        });
      } else {
        next(error);
      }
    });
});

router.get("/login", (_, res) => {
  res.render("auth/login");
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username == "" || password == "") {
    res.render("auth/login", {
      errorMessage: "Please enter both user name and password to log in.",
    });
    return;
  }
  User.findOne({ username }).then((user) => {
    if (!user) {
      res.render("auth/login", {
        errorMessage: "Email or user name not registered",
      });
      return;
    } else if (bcryptjs.compare(password, user.password)) {
      req.session.currentUser = user;
      res.redirect("/my-cookbook");
    } else {
      res.render("auth/login", {
        errorMessage: "Either user or password are not correct!",
      });
    }
  });
});

module.exports = router;

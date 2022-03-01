const router = require("express").Router();
const bcryptjs = require("bcryptjs");
const saltRounds = 10;

const User = require("../models/User.model");

router.get("/signup", (_, res) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res) => {
  const { username, email, password } = req.body;

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
    .then(() =>
      res.redirect("/login"))
    .catch((error) => console.log(error));
});

router.get("/login", (_, res) => {
  res.render("auth/login");
});

router.post('/login', (req, res, next) => {
  const { username, password } = req.body;
//  console.log('SESSION =====> ', req.session);
  if (username == '' || password == '') {
    res.render('auth/login', {
      errorMessage: 'Please enter your user name and password to log in.'
    });
    return;
  }
  User.findOne( { username })
    .then(user => {
      if (!user) {
        res.render('auth/login', {
          errorMessage: 'User name not registered'
      }); return;
    } else if (bcryptjs.compareSync(password, user.password)) {
      res.render('user-views/my-cookbook')
    }
    })
});

module.exports = router;

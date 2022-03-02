const router = require("express").Router();

const isLoggedIn = (req, res, next) => {
  if(!req.session.currentUser) {
    res.redirect('/login');
  } else {
    next();
  }
}

router.get("/main", (_, res) => {
  res.render("user-views/main");
});

router.get("/my-cookbook", (_, res) => {
  res.render("user-views/my-cookbook");
});

module.exports = router;
module.exports = isLoggedIn;
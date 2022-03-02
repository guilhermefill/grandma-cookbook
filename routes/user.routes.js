const router = require("express").Router();

const isLoggedIn = (req, res, next) => {
  if (!req.session.currentUser) {
    res.redirect('/login');
  } else {
    next();
  }
}

router.get("/main", (_req, res) => {
  res.render("user-views/main");
});

router.get("/my-cookbook",isLoggedIn, (_req, res) => {
  res.render("user-views/my-cookbook");
});


module.exports = router;
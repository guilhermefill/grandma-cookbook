const router = require("express").Router();


const isLoggedIn = (req, res, next) => {
  if (!req.session.currentUser) {
    res.redirect('/login');
  } else {
    next();
  }
};

router.get("/search", isLoggedIn, (_, res) => {
  res.render("recipe-views/search");
});

router.get("/search-result", isLoggedIn, (_, res) => {
  res.render("recipe-views/search-result");
});

router.get("/create", isLoggedIn, (_, res) => {
  res.render("recipe-views/create");
});

router.get("/detail", isLoggedIn, (_, res) => {
    res.render("recipe-views/detail");
});

router.get("/edit", isLoggedIn, (_, res) => {
    res.render("recipe-views/edit");
});

module.exports = router;

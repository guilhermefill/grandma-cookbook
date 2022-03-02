const router = require("express").Router();


const isLoggedIn = require('./user.routes')

router.get("/search", (_, res) => {
  res.render("recipe-views/search");
});

router.get("/search-result", (_, res) => {
  res.render("recipe-views/search-result");
});

router.get("/create", (_, res) => {
  res.render("recipe-views/create");
});

router.get("/detail", (_, res) => {
    res.render("recipe-views/detail");
});

router.get("/edit", (_, res) => {
    res.render("recipe-views/edit");
});

module.exports = router;

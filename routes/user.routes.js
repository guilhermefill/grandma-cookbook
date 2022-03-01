const router = require("express").Router();

router.get("/main", (_, res) => {
  res.render("user-views/main");
});

router.get("/my-cookbook", (_, res) => {
  res.render("user-views/my-cookbook");
});

module.exports = router;

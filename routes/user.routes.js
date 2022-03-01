const router = require("express").Router();

router.get("/main", (_, res) => {
  res.render("user-views/main");
});

module.exports = router;

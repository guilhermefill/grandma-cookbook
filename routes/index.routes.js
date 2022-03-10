const router = require("express").Router();

/* GET home page */
router.get("/", (req, res) => {
  if (req.session.currentUser) {
    res.redirect('/my-cookbook')
  } else {
    res.render("index");
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy(error => {
      if(error) {
          console.log(error);
      } else {
          res.redirect('/');
      }
  });
});

module.exports = router;

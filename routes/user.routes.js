const router = require("express").Router();
const Recipe = require('../models/Recipe.model');



const isLoggedIn = (req, res, next) => {
  if (!req.session.currentUser) {
    res.redirect('/login');
  } else {
    next();
  }
};



router.get("/my-cookbook",isLoggedIn, (req, res) => {

  Recipe.find()
    .then(recipes => res.render("user-views/my-cookbook", { recipes }) )
    .catch(error => console.log(error));
});

module.exports = router;
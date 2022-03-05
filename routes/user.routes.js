const router = require("express").Router();
const Recipe = require("../models/Recipe.model");
const User = require("../models/User.model");

const isLoggedIn = (req, res, next) => {
  if (!req.session.currentUser) {
    res.redirect("/login");
  } else {
    next();
  }
};

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}

router.get("/discover", isLoggedIn, (req, res) => {
  const user = req.session.currentUser;
  Recipe.find()
    .populate("creator")
    .then((recipes) => {
      let shuffledRecipes = shuffle(recipes);
      res.render("user-views/discover", { shuffledRecipes });
    })
    .catch((error) => console.log(error));
});

router.get("/my-cookbook", isLoggedIn, (req, res) => {
  const user = req.session.currentUser;
  if (user.cookbook.length === 0) {
    res.redirect("/discover");
  } else {
    User.findById(user._id)
      .populate("cookbook")
      .then((userRecipes) => {
        res.render("user-views/my-cookbook", { recipes: userRecipes.cookbook});
      })
      .catch((error) => console.log(error));
  }
});

module.exports = router;

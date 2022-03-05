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
    Recipe.find({
      _id: { $in: user.cookbook },
    })
      .populate("creator")
      .then((recipes) => {
        res.render("user-views/my-cookbook", { recipes });
      })
      .catch((error) => console.log(error));
  }
});

router.get("/profile", isLoggedIn, (req, res) => {
  const user = req.session.currentUser;
  res.render("user-views/profile", user);
});

  router.post("/profile/delete", (req, res) => {
    const userID = req.session.currentUser._id;

    User.findByIdAndDelete(userID)
      .then(() => res.redirect("/signup"))
      .catch((error) => next(error));
  });

router.post("/profile/edit", (req, res) => {
  const userID = req.session.currentUser._id;

  User.findByIdAndUpdate(userID, { avatar, username, email })
    .then(() =>
      res.render("/profile", {
        confirmationMessage: "User information updated",
      })
    )
    .catch((error) => console.log(error));
});

module.exports = router;

const router = require("express").Router();
const Recipe = require("../models/Recipe.model");
const User = require("../models/User.model");
const fileUploader = require("../config/cloudinary.config");
const bcryptjs = require("bcryptjs");
const saltRounds = 10;

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
  const userID = req.session.currentUser._id;
  User.findById(userID)
    .then((user) => {
      res.render("user-views/profile", user);
    })
    .catch((error) => console.log(error));
});

router.post("/profile/delete", (req, res) => {
  const userID = req.session.currentUser._id;

  User.findByIdAndDelete(userID)
    .then(() => res.redirect("/signup"))
    .catch((error) => next(error));
});

router.post("/profile/update", fileUploader.single("avatar"), (req, res) => {
  const userID = req.session.currentUser._id;
  const { username, email } = req.body;

  if (req.file != undefined) {
    User.findByIdAndUpdate(userID, {
      avatar: req.file.path,
      username: username,
      email: email,
    })
      .then(() => res.redirect("/profile"))
      .catch((error) => console.log(error));
  } else {
    User.findByIdAndUpdate(userID, { username: username, email: email })
      .then(() => res.redirect("/profile"))
      .catch((error) => console.log(error));
  }
});

router.post('/profile/update-password', (req, res) => {
  const userID = req.session.currentUser._id
  const { currentPassword, newPassword } = req.body

  User.findById(userID)
  .then((user) => {
    if (bcryptjs.compare(currentPassword, user.password)) {
      bcryptjs.genSalt(saltRounds)
      .then((salt) => bcryptjs.hash(newPassword, salt))
      .then((hashedPassword) => {
        return User.findByIdAndUpdate(userID, {password: hashedPassword})
      })
        .catch(error => console.log(error))
    }
  })
  .then(res.redirect('/my-cookbook'))
  .catch(error => console.log(error))

})

module.exports = router;

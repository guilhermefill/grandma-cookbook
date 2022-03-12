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

// We need to exclude from this list the recipes that are in user.cookbook
router.get("/discover", isLoggedIn, async (req, res) => {
  const user = req.session.currentUser;
  try {
    const loggedUser = await User.findById(user._id)
    const foundRecipes = await Recipe.find({public: true}).populate('creator')
    const unseenRecipes = foundRecipes.filter(x => !loggedUser.cookbook.includes(x._id))
    let shuffledRecipes = shuffle(unseenRecipes)
    res.render("user-views/discover", { shuffledRecipes });
  } catch (error) {
    console.log(error);
  }
});

router.post('/discover', isLoggedIn, async (req, res) => {
  const { dietType, dishLevel, type } = req.body;
  const user = req.session.currentUser;
  const filters = {}
  filters.public = true
  if (dietType !== '') {
    filters.dietRestriction = dietType
  }
  if (dishLevel !== '') {
    filters.level = dishLevel
  }
  if (type !== '') {
    filters.dishType = type
  }
  try {
    const loggedUser = await User.findById(user._id)
    const foundRecipes = await Recipe.find(filters)
    const unseenRecipes = foundRecipes.filter(x => !loggedUser.cookbook.includes(x._id))
    let shuffledRecipes = shuffle(unseenRecipes)
    res.render("user-views/discover", { shuffledRecipes });
  } catch (error) {
    console.log(error);
  }
});

router.get("/my-cookbook", (req, res) => {
  const user = req.session.currentUser;
  if (user.cookbook.length === 0) {
    res.redirect("/discover");
  } else {
    User.findById(user._id)
      .populate({path: 'cookbook', populate: {path: 'creator'}})
      .then((userRecipes) => {
        res.render("user-views/my-cookbook", { recipes: userRecipes.cookbook });
      })
      .catch((error) => console.log(error));
  }
});

router.post('/my-cookbook', isLoggedIn, async (req, res) => {
  const { dietType, dishLevel, type, creator } = req.body;
  const user = req.session.currentUser;
  const filters = {}
  if (dietType !== '') {
    filters.dietRestriction = dietType
  }
  if (dishLevel !== '') {
    filters.level = dishLevel
  }
  if (type !== '') {
    filters.dishType = type
  }
  if (creator) {
    filters.creator = user._id
  }
  try {
    const foundUser = await User.findById(user._id)
    const foundRecipes = await Recipe.find(filters).populate('creator')
    const filterResults = foundRecipes.filter(recipe => foundUser.cookbook.includes(recipe._id))
    res.render("user-views/my-cookbook", { recipes: filterResults });
  } catch (error) {
    console.log(error);
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
            return User.findByIdAndUpdate(userID, { password: hashedPassword })
          })
          .catch(error => console.log(error))
      }
    })
    .then(res.redirect('/my-cookbook'))
    .catch(error => console.log(error))

})

module.exports = router;

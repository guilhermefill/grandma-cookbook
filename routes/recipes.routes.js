const router = require("express").Router();



const User = require("../models/User.model");
const Recipe = require("../models/Recipe.model");


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

router.post('/search', (req, res) => {
  const { searchValue, dietType, level } = req.body;
  if (searchValue === "") {
    res.render("recipe-views/search", { errorMessage: "Please provide a search value" })
  } else if (dietType !== "" && level !== "") {
    Recipe.find({ $and: [{ dietRestriction: dietType }, { $text: { $search: JSON.stringify(searchValue) } }, { level: level }] })
      .then(foundRecipe => {
        if (foundRecipe.lenght === 0) {
          res.render('recipe-views/search-result', { errorMessage: "Nothing was found" })
        } else {
          res.render('recipe-views/search-result', { recipes: foundRecipe })
        }
      })
      .catch(error => console.log(error));
  } else if (level !== "") {
    Recipe.find({ $and: [{ level: level }, { $text: { $search: JSON.stringify(searchValue) } }] })
      .then(foundRecipe => {
        if (foundRecipe.lenght === 0) {
          res.render('recipe-views/search-result', { errorMessage: "Nothing was found" })
        } else {
          res.render('recipe-views/search-result', { recipes: foundRecipe })
        }
      })
      .catch(error => console.log(error));
  } else if (dietType !== "") {
    Recipe.find({ $and: [{ dietRestriction: dietType }, { $text: { $search: JSON.stringify(searchValue) } }] })
      .then(foundRecipe => {
        if (foundRecipe.lenght === 0) {
          res.render('recipe-views/search-result', { errorMessage: "Nothing was found" })
        } else {
          res.render('recipe-views/search-result', { recipes: foundRecipe })
        }
      })
      .catch(error => console.log(error));
  } else {
    Recipe.find({ $text: { $search: JSON.stringify(searchValue) } })
      .then(foundRecipe => {
        if (foundRecipe.lenght === 0) {
          res.render('recipe-views/search-result', { errorMessage: "Nothing was found" })
        } else {
          res.render('recipe-views/search-result', { recipes: foundRecipe })
        }
      })
      .catch(error => console.log(error));
  }
});

router.get("/create", isLoggedIn, (_, res) => {
  res.render("recipe-views/create");
});

router.get("/detail/:id", isLoggedIn, (_, res) => {
  res.render("recipe-views/detail");
});

router.get("/edit/:id", isLoggedIn, (_, res) => {
  res.render("recipe-views/edit");
});

module.exports = router;

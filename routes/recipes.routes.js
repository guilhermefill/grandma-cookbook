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
    Recipe.find({ $and: [{ dietRestriction: dietType }, { $text: { $search: JSON.stringify(searchValue) } }, { level: level }, { public: true }] })
      .then(foundRecipe => {
        if (foundRecipe.length === 0) {
          res.render('recipe-views/search-result', { errorMessage: "Nothing was found" })
        } else {
          res.render('recipe-views/search-result', { recipes: foundRecipe })
        }
      })
      .catch(error => console.log(error));
  } else if (level !== "") {
    Recipe.find({ $and: [{ level: level }, { $text: { $search: JSON.stringify(searchValue) } }, { public: true }] })
      .then(foundRecipe => {
        if (foundRecipe.length === 0) {
          res.render('recipe-views/search-result', { errorMessage: "Nothing was found" })
        } else {
          res.render('recipe-views/search-result', { recipes: foundRecipe })
        }
      })
      .catch(error => console.log(error));
  } else if (dietType !== "") {
    Recipe.find({ $and: [{ dietRestriction: dietType }, { $text: { $search: JSON.stringify(searchValue) } }, { public: true }] })
      .then(foundRecipe => {
        if (foundRecipe.length === 0) {
          res.render('recipe-views/search-result', { errorMessage: "Nothing was found" })
        } else {
          res.render('recipe-views/search-result', { recipes: foundRecipe })
        }
      })
      .catch(error => console.log(error));
  } else {
    Recipe.find({ $and: [{ $text: { $search: JSON.stringify(searchValue) } }, { public: true }] })
      .then(foundRecipe => {
        if (foundRecipe.length === 0) {
          res.render('recipe-views/search-result', { errorMessage: "Nothing was found" })
        } else {
          res.render('recipe-views/search-result', { recipes: foundRecipe })
        }
      })
      .catch(error => console.log(error));
  }
});

router.get("/create", isLoggedIn, (req, res) => {
  res.render("recipe-views/create");
});

router.get("/detail/:id", isLoggedIn, (req, res) => {
  const user = req.session.currentUser;
  const { id } = req.params;
  Recipe.findById(id).populate('creator').populate('comments.author')
    .then(recipe => {
      if (user.username === recipe.creator[0].username) {
        res.render("recipe-views/detail", { recipe: recipe, userMatch: true }); 
      } else {
        res.render("recipe-views/detail", { recipe: recipe }); //TODO add a else if for if user comment creator === user view comments
      }
    })
    .catch(error => console.log(error));
});

router.post('/add-comment/:id', isLoggedIn, (req, res) => {
  const user = req.session.currentUser;
  const { id } = req.params;
  const { title, comment } = req.body;
  const update = { author: user._id, title, comment }
  if (title !== '' && comment !== '') {
    Recipe.findByIdAndUpdate(id, { $push: { comments: update } })
      .then(recipe => res.redirect(`/recipe/detail/${recipe._id}`))
      .catch(error => console.log(error));
  } else {
    res.redirect(`/recipe/detail/${id}`);
  }

})

router.get("/edit/:id", isLoggedIn, (req, res) => {
  res.render("recipe-views/edit");
});

module.exports = router;

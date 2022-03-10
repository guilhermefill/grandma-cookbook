const router = require("express").Router();



const User = require("../models/User.model");
const Recipe = require("../models/Recipe.model");
const Note = require("../models/Note.model");


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
      .populate('creator')
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
      .populate('creator')
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
      .populate('creator')
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
      .populate('creator')
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

router.get("/detail/:id", isLoggedIn, async (req, res) => {
  const user = req.session.currentUser;
  const { id } = req.params;
  try {
    const foundNotes = await Note.find({ $and: [{ user: user._id }, { recipe: id }] });
    const recipe = await Recipe.findById(id).populate('creator');
    const userCookbook = await User.findById(user._id)
    if (user.username === recipe.creator[0].username) {
      res.render("recipe-views/detail", { recipe: recipe, userMatch: true, note: foundNotes });
    } else if (userCookbook.cookbook.includes(id)) {
      res.render("recipe-views/detail", { recipe: recipe, cookbookMatch: true, note: foundNotes });
    } else {
      res.render("recipe-views/detail", { recipe: recipe, note: foundNotes });
    }
  } catch (error) {
    console.log(error)
  }
});

router.post('/add-note/:id', isLoggedIn, (req, res) => {
  const user = req.session.currentUser;
  const { id } = req.params;
  const { note } = req.body;
  Note.create({ notes: note, user: user._id, recipe: id })
    .then(createdNote => res.redirect(`/recipe/detail/${id}`))
    .catch(error => console.log(error));
});

router.post('/delete-note/:id', isLoggedIn, (req, res) => {
  const user = req.session.currentUser;
  const { id } = req.params;
  const { noteId } = req.body;
  Note.findByIdAndDelete(noteId)
    .then(() => res.redirect(`/recipe/detail/${id}`))
    .catch(error => console.log(error));
});

router.post('/add-to-cookbook/:id', isLoggedIn, (req, res) => {
  const user = req.session.currentUser;
  const { id } = req.params;
  User.findByIdAndUpdate(user._id, { $push: { cookbook: id } })
    .then(() => res.redirect(`/my-cookbook`))
    .catch(error => console.log(error));
});

router.post('/remove-from-cookbook/:id', isLoggedIn, (req, res) => {
  const user = req.session.currentUser;
  const { id } = req.params;
  User.findByIdAndUpdate(user._id, { $pull: { cookbook: id } })
    .then(() => res.redirect(`/my-cookbook`))
    .catch(error => console.log(error));
});

router.get("/edit/:id", isLoggedIn, async (req, res) => {
  const user = req.session.currentUser;
  const { id } = req.params;
  try {
    const foundRecipe = await Recipe.findById(id).populate('creator');
    if (user.username === foundRecipe.creator[0].username) {
      res.render('recipe-views/edit', { recipe: foundRecipe })
    } else {
      res.redirect(`/recipe/detail/${id}`);
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/delete/:id", isLoggedIn, (req, res) => {
  res.redirect('/my-cookbook')
})

module.exports = router;

const router = require("express").Router();

const User = require("../models/User.model");
const Recipe = require("../models/Recipe.model");
const Note = require("../models/Note.model");
const { create } = require("connect-mongo");
const fileUploader = require("../config/cloudinary.config");

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
    Recipe.find({ $and: [{ dietRestriction: dietType }, { $text: { $search: JSON.stringify(searchValue) } }, { level: level }, { public: true }] }).populate('creator')
      .then(foundRecipe => {
        if (foundRecipe.length === 0) {
          res.render('recipe-views/search-result', { errorMessage: "Nothing was found" })
        } else {
          res.render('recipe-views/search-result', { recipes: foundRecipe })
        }
      })
      .catch(error => console.log(error));
  } else if (level !== "") {
    Recipe.find({ $and: [{ level: level }, { $text: { $search: JSON.stringify(searchValue) } }, { public: true }] }).populate('creator')
      .then(foundRecipe => {
        if (foundRecipe.length === 0) {
          res.render('recipe-views/search-result', { errorMessage: "Nothing was found" })
        } else {
          res.render('recipe-views/search-result', { recipes: foundRecipe })
        }
      })
      .catch(error => console.log(error));
  } else if (dietType !== "") {
    Recipe.find({ $and: [{ dietRestriction: dietType }, { $text: { $search: JSON.stringify(searchValue) } }, { public: true }] }).populate('creator')
      .then(foundRecipe => {
        if (foundRecipe.length === 0) {
          res.render('recipe-views/search-result', { errorMessage: "Nothing was found" })
        } else {
          res.render('recipe-views/search-result', { recipes: foundRecipe })
        }
      })
      .catch(error => console.log(error));
  } else {
    Recipe.find({ $and: [{ $text: { $search: JSON.stringify(searchValue) } }, { public: true }] }).populate('creator')
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

router.get("/edit/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const foundRecipe = await Recipe.findById(id).populate('creator');
  res.render("recipe-views/edit", { recipe: foundRecipe });
});

router.post('/edit/:id', fileUploader.single('imageUrl'), async (req, res) => {
  const { title, level, cuisine, dishtType, public, ingredientsList, stepsList, vegan, vegetarian, glutenFree, shortDescription, currentImg } = req.body;
  const obj = JSON.parse(JSON.stringify(req.body)); // req.body = [Object: null prototype] { title: 'product' }
  obj.ingredientsList = ingredientsList.split('*split,')
  obj.ingredientsList[obj.ingredientsList.length - 1] = obj.ingredientsList[obj.ingredientsList.length - 1].replace('*split', '')
  obj.stepsList = stepsList.split('*split,')
  obj.stepsList[obj.stepsList.length - 1] = obj.stepsList[obj.stepsList.length - 1].replace('*split', '')
  obj.dietRestriction = []
  if (public) { obj.public = true } else { obj.public = false }
  if (vegan) { obj.dietRestriction.push(vegan) }
  if (vegetarian) { obj.dietRestriction.push(vegetarian) }
  if (glutenFree) { obj.dietRestriction.push(glutenFree) }
  const {id} = req.params;
  const userID = req.session.currentUser._id;

  try {
    if (req.file != undefined) {
      obj.imageUrl = req.file.path
      const updatedRecipe = await Recipe.findByIdAndUpdate(id, {
        title: title,
        ingredients: obj.ingredientsList,
        creator: userID,
        shortDescription: shortDescription,
        imageUrl: req.file.path,
        cookingSteps: obj.stepsList,
        dietRestriction: obj.dietRestriction, //how do I do this?
        level: level,
        cuisine: cuisine,
        dishtType: dishtType,
        public: obj.public
      }, { new: true })
      res.redirect(`/recipe/detail/${id}`)
    } else {
      obj.imageUrl = currentImg
      const updatedRecipe = await Recipe.findByIdAndUpdate(id, {
        title: title,
        ingredients: obj.ingredientsList,
        creator: userID,
        shortDescription: shortDescription,
        cookingSteps: obj.stepsList,
        dietRestriction: obj.dietRestriction, //how do I do this?
        level: level,
        cuisine: cuisine,
        dishtType: dishtType,
        public: obj.public
      }, { new: true })
      res.redirect(`/recipe/detail/${id}`)
      // res.send(obj)
    }
  } catch (error) {
    console.log(error);
  }
})

router.post("/delete/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const foundRecipe = await Recipe.findByIdAndDelete(id)
  res.redirect('/my-cookbook')
});

router.post('/create-recipe', fileUploader.single("imageUrl"), (req, res) => {
  const { title, level, cuisine, dishtType, public, ingredientsList, stepsList, vegan, vegetarian, glutenFree, shortDescription } = req.body;
  const obj = JSON.parse(JSON.stringify(req.body)); // req.body = [Object: null prototype] { title: 'product' }
  obj.ingredientsList = ingredientsList.split('*split,')
  obj.ingredientsList[obj.ingredientsList.length - 1] = obj.ingredientsList[obj.ingredientsList.length - 1].replace('*split', '')
  obj.stepsList = stepsList.split('*split,')
  obj.stepsList[obj.stepsList.length - 1] = obj.stepsList[obj.stepsList.length - 1].replace('*split', '')
  obj.dietRestriction = []
  if (public) { obj.public = true } else { obj.public = false }
  if (vegan) { obj.dietRestriction.push(vegan) }
  if (vegetarian) { obj.dietRestriction.push(vegetarian) }
  if (glutenFree) { obj.dietRestriction.push(glutenFree) }

  const userID = req.session.currentUser._id;

  if (req.file != undefined) {
    Recipe.create({
      title: title,
      ingredients: obj.ingredientsList,
      creator: userID,
      shortDescription: shortDescription,
      imageUrl: req.file.path,
      cookingSteps: obj.stepsList,
      dietRestriction: obj.dietRestriction, //how do I do this?
      level: level,
      cuisine: cuisine,
      dishtType: dishtType,
      public: obj.public
    })
      .then(recipe => {
        return User.findByIdAndUpdate(userID, { $push: { cookbook: recipe._id } })
      })
      .then(() => res.redirect('/my-cookbook'))
      .catch(error => console.log(error))
  } else {
    Recipe.create({
      title: title,
      ingredients: obj.ingredientsList,
      creator: userID,
      shortDescription: shortDescription,
      cookingSteps: obj.stepsList,
      dietRestriction: obj.dietRestriction, //how do I do this?
      level: level,
      cuisine: cuisine,
      dishtType: dishtType,
      public: obj.public
    })
      .then(recipe => {
        return User.findByIdAndUpdate(userID, { $push: { cookbook: recipe._id } })
      })
      .then(() => res.redirect('/my-cookbook'))
      .catch(error => console.log(error))
  }


});

module.exports = router;

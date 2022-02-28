const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  ingredients: [String],
  creator: String, //Need to link the user here
  shortDescription: String,
  image: {
    type: String,
    default: "https://img.freepik.com/free-photo/frying-pan-empty-with-various-spices-black-table_1220-561.jpg?t=st=1646052931~exp=1646053531~hmac=6bb2c3c79673febfb82d1725483fab082dc8e1d50885e64bf8ef9e8b607a9d5c&w=1380"
  },
  cookingSteps: {
    type: String,
    required: true
  },
  dietRestriction: {
      type: String,
      enum: ['Vegan', 'Vegetarian', 'Gluten-free']
  },
  level: {
    type: String,
    enum: ['Easy', 'Medium', 'Fancy']
  },
  cuisine: {
    type: String,
    required: true
  },
  dishType: {
    type: String,
    enum: ['Breakfast', 'Main course', 'Soup', 'Snack', 'Drink', 'Dessert', 'Salad', 'Appetizer', 'Starter', 'Other']
  },
  duration: {
    type: Number,
    min: 0
  }
},
{
    timestamps: true
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
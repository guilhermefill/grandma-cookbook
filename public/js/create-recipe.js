const prevBtns = document.querySelectorAll(".btn-prev");
const nextBtns = document.querySelectorAll(".btn-next");
const progress = document.getElementById("progress");
const formSteps = document.querySelectorAll(".form-step");
const progressSteps = document.querySelectorAll(".progress-step");

let formStepsNumber = 0;

nextBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    formStepsNumber++;
    updateFormSteps();
    updateProgressBar();
  });
});

prevBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    formStepsNumber--;
    updateFormSteps();
    updateProgressBar();
  });
});

function updateFormSteps() {
  formSteps.forEach((formStep) => {
    formStep.classList.contains("form-step-active") &&
      formStep.classList.remove("form-step-active");
  });
  formSteps[formStepsNumber].classList.add("form-step-active");
}

function updateProgressBar() {
  progressSteps.forEach((progressStep, index) => {
    if (index < formStepsNumber + 1) {
      progressStep.classList.add("progress-step-active");
    } else {
      progressStep.classList.remove("progress-step-active");
    }
  });
  const progressActive = document.querySelectorAll(".progress-step-active");
  progress.style.width =
    ((progressActive.length - 1) / (progressSteps.length - 1)) * 100 + "%";
}

// Add ingredients to array
// create a variable with an empty array
// On click/enter
// 1. create a new <li> with text area input, add new ingredient button, and go back button
// 2. Turn input into string, push it into empty array, change previous <textarea> to <li>
// When the user saves the recipe, add this array to Recipe.ingredients

let ingredientsArray = [];
let ingredientButton = document.querySelectorAll(".add-step-btn");
const ingList = document.getElementById("ingredients-list");
const newButton = document.getElementsByTagName('button')

ingredientButton.forEach((btn) => {
  btn.addEventListener("click", () => {
    let ingredient = document.getElementsByClassName("ingredient-textarea")[0].value;
    ingList.innerHTML = ingList.innerHTML + `<li>${ingredient}</li>`
    ingredientsArray.push(ingredient)
  });
});

let stepsArray = [];


// function addStep(array) {
//   let li = document.createElement("li");
//   li.innerHTML(`${ingredient}`);
//   document.createElement("textarea");
//   let newButton = document.createElement("button");
//   newButton.innerHTML("Add ingredient");
//   newButton.id("add-ingredient-btn");
// }

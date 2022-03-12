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
let stepsArray = [];
let addIngredientBtn = document.querySelectorAll(".add-ingredient-btn");
let addStepBtn = document.querySelectorAll(".add-step-btn");
const ingList = document.querySelector(".list");
const stepList = document.querySelector(".stepList");
const deleteBtn = document.querySelector(".remove-li-btn");

addIngredientBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    let ingredient = document.getElementsByClassName("ingredientInput")[0].value;
    ingList.innerHTML =
      ingList.innerHTML +
      `<li onclick="deleteLi(event, ingredientsArray)"><p class="element-value">${ingredient}</p>    🗑️</li>`;
    ingredientsArray.push(ingredient);
    console.log(`ingredients: ${ingredientsArray}`);
  });
});

addStepBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    let step = document.getElementsByClassName("stepsInput")[0].value;
    stepList.innerHTML =
      stepList.innerHTML +
      `<li onclick="deleteLi(event, stepsArray)"><p class="element-value">${step}</p>    🗑️</li>`;
    stepsArray.push(step);
    console.log(`Steps: ${stepsArray}`);
  });
});

function deleteLi(event, arr) {
  let target = event.target.querySelector(".element-value").innerHTML;
  arr = arr.filter((e) => e !== target);
  event.target.remove();
  console.log(arr);
}

function createRecipeObject(input) {

  axios
    .post("http://localhost:3000/recipe/create-recipe", input)
    .then((w) => {
      console.log(w);
    })
    .catch((err) => {
      console.log("error", err);
    });
}


//problems to solve:
//1. add diet restrictions to array
//2. create form for picture and somehow add it to the object
//3. clear ingredient/steps input box after adding info
//4. add ingredient/steps with enter key
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
let addLiBtn = document.querySelectorAll(".add-step-btn");
const list = document.querySelector(".list");
const deleteBtn = document.querySelector(".remove-li-btn");

addLiBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    let element = document.getElementsByClassName("textarea")[0].value;
    list.innerHTML =
      list.innerHTML +
      `<li>${element}   <button class="btn remove-li-btn">🗑️</button></li>`;
    if (btn.id === 'ingredient-btn') {
      // the button has been clicked in the ingredients list (class ="list ingredients") =>
      ingredientsArray.push(element);
    } else if (btn.id === 'steps-btn') {
      // the button has been clicked in the cooking steps list (class="list steps"
      stepsArray.push(element);
    }
    console.log(`ingredients: ${ingredientsArray}`)
    console.log(`Steps: ${stepsArray}`)
  });
  
});

function deleteLi() {
  list.addEventListener("click", (event) => {
    if (event.target.tagName === "button") {
      const button = event.target;
      const li = button.parentNode;
      const ul = li.parentNode;
      if (button.id === "ingredient-btn") {
        ul.removeChild(li);
      }
    }
  });
}

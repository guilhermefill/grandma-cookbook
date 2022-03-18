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


let ingredientsArray = [];
let stepsArray = [];
let addIngredientBtn = document.querySelectorAll(".add-ingredient-btn");
let addStepBtn = document.querySelectorAll(".add-step-btn");
const ingList = document.querySelector(".list");
const stepList = document.querySelector(".stepList");
const deleteBtn = document.querySelector(".remove-li-btn");
const ingredientsList = document.getElementById('ingredientsList');
const stepsList = document.getElementById('stepsList')

function clearField(id) {
  document.getElementById(id).value = "";
}

function submitIngredient() {
  let ingredient = document.getElementsByClassName("ingredientInput")[0].value;
  console.log(ingredient)
    ingList.innerHTML =
      ingList.innerHTML +
      `<li onclick="deleteLi(event, ingredientsArray)"><p class="element-value">${ingredient}</p>🗑️</li>`;
    ingredientsArray.push(ingredient + '*split');
    ingredientsList.value = ingredientsArray;
    console.log(ingredientsArray)
    clearField('ingredients');
};

function submitStep() {
  let step = document.getElementsByClassName("stepsInput")[0].value;
    stepList.innerHTML =
      stepList.innerHTML +
      `<li onclick="deleteLi(event, stepsArray);"><p class="element-value">${step}</p> 🗑️</li>`;
    stepsArray.push(step + '*split');
    stepsList.value  = stepsArray;
    clearField('steps');
};

addIngredientBtn.forEach((btn) => {
  let input = document.getElementById('ingredients')
  input.addEventListener('keydown', (event) => {
    if(event.key === `Enter`) { 
      event.preventDefault();
      submitIngredient()    
    } 
  })
  btn.addEventListener("click", () => {
    submitIngredient()
  });
});

addStepBtn.forEach((btn) => {
  let input = document.getElementById('steps')
  input.addEventListener('keydown', (event) => {
    if(event.key === `Enter`) { 
      event.preventDefault();
      submitStep()
    }
  }) 
  btn.addEventListener("click", () => {
    submitStep()
  });
});

function deleteLi(event, arr) {
  let target = event.target.querySelector(".element-value").innerHTML;
    console.log(target)
  arr = arr.filter((e) => e !== target);
  event.target.remove();
  for (let i=0; i<= arr.length; i++){
  if (target + '*split' === arr[i]){
   arr.splice(i, 1)}
  }
  return arr
}

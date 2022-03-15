let ingArray = []
let stpArray = []


const addIngredientBtn = document.getElementById('add-ingredient-btn');
const ingredientsList = document.getElementById('ingredient-list');
const newIngredient = `<li onclick="deleteLi(event, ingArray)"><input class="ingredientInput remover" type="text"
id="ingredients" cols="50" rows="3" value=""></input> 🗑️</li>`
const addStepBtn = document.getElementById('add-step-button');
const stepList = document.getElementById('step-list');
const newStep = `<li onclick="deleteLi(event, stpArray)"><textarea class="ingredientInput remover" type="text" cols="75"
rows="4" id="ingredients"></textarea> 🗑️</li>`

addIngredientBtn.onclick = () => {
    ingredientsList.innerHTML = ingredientsList.innerHTML += newIngredient
}

addStepBtn.onclick = () => {
    stepList.innerHTML += newStep
}

function deleteLi(event, arr) {
    let target = event.target.querySelector(".remover").innerHTML;
    arr = arr.filter((e) => e !== target);
    event.target.remove();
}
  
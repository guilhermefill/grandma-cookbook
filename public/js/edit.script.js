window.addEventListener('load', (event) => {
    refreshIngArr();
    refreshStpArr();
})


const addIngredientBtn = document.getElementById('add-ingredient-btn');
const ingredientList = document.getElementById('ingredient-list col');
const newIngredient = `<li onclick="deleteLi(event, ingArray)" style="display: inline;" class="row"><input class="ingItem remover" type="text"
id="ingredients" cols="50" rows="3"></input> 🗑️</li>`
const addStepBtn = document.getElementById('add-step-button');
const stepList = document.getElementById('step-list col');
const newStep = `<li onclick="deleteLi(event, stpArray)" style="display: inline;" class="row"><textarea class="stpItem remover" type="text" cols="75"
rows="4" id="ingredients"></textarea> 🗑️</li>`
const saveBtn = document.getElementById('save-btn')


let ingredientsList = document.getElementById('ingredientsList');
let stepsList = document.getElementById('stepsList')


addIngredientBtn.onclick = () => {
    const newIng = document.createElement('li')
    newIng.innerHTML = newIngredient
    ingredientList.appendChild(newIng)
}

addStepBtn.onclick = () => {
    const newStp = document.createElement('li')
    newStp.innerHTML = newStep
    stepList.appendChild(newStp)
}

function deleteLi(event, arr) {
    let target = event.target.querySelector(".remover").innerHTML;
    arr = arr.filter((e) => e !== target);
    event.target.remove();
}

const refreshIngArr = () => {
    let ingArray = []
    let ingredients = document.querySelectorAll('.ingItem')
    ingredients.forEach((item) => {
        ingArray.push(item.value + '*split')
    })
    ingredientsList.value = ingArray
}

const refreshStpArr = () => {
    let stpArray = []
    let steps = document.querySelectorAll('.stpItem')
    steps.forEach((item) => {
        stpArray.push(item.value + '*split')
    })
    stepsList.value = stpArray
}

saveBtn.onclick = () => {
    refreshIngArr();
    refreshStpArr();
}
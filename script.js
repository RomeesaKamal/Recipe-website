const searchBox = document.querySelector(".search-box");
const searchBtn = document.querySelector(".search-btn");
const select = document.querySelector(" #select");
const recipeContainer = document.querySelector(".recipe-cards");
const recipeDetailsContent = document.querySelector(".recipe-details-content");
const recipeCloseBtn = document.querySelector(".recipe-close-btn");


// Function To get Recipes

const fetchRecipes = async (query) => {
  recipeContainer.innerHTML = "<h2>Fetching Recipe......</h2>";

  const data = await fetch(
    ` https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
  );
  const response = await data.json();
  recipeContainer.innerHTML = "";
  response.meals.forEach((meal) => {
    const recipeDiv = document.createElement("div");
    recipeDiv.classList.add("recipe-card");

    // Add the recipe image
    recipeDiv.innerHTML = `
  <img src="${meal.strMealThumb}">
`;

    // Create card content div

    const cardContent = document.createElement("div");
    cardContent.classList.add("card-content");
    cardContent.innerHTML = `
  <p>${meal.strArea}   Dish</p>
  <h2>${meal.strMeal}  <span>
                <i class="fa-solid fa-star" style="color: #ffd43b"></i>4.5
              </span></h2>
              <h3>
       ${ meal.strCategory}<span
                ><i class="fa-regular fa-heart"></i
                ><i class="fa-regular fa-comment"></i
              ></span>
            </h3>         
`;
    const button = document.createElement("button");
    button.textContent = 'View Recipe';
    cardContent.appendChild(button);


    button.addEventListener('click', ()=>{
        openRecipePopup(meal);
    });

    recipeDiv.appendChild(cardContent);
    recipeContainer.appendChild(recipeDiv);
  });
};


// Function to fetch ingredients and measurement

const fetchIngredients = (meal) => {
  let ingredientsList = "";
  for(let i = 1; i <= 20; i++){
    const ingredient = meal[`strIngredient${i}`];
    if(ingredient){
      const measure = meal[`strMeasure${i}`];
      ingredientsList += `<li>${measure || ''} ${ingredient}<li/>`
    }
    else{
      continue;
    }
  }
  return ingredientsList;
  
}

const openRecipePopup = (meal) => {

  // Set the content of the popup

  recipeDetailsContent.innerHTML = `
    <h2 class="recipeName">${meal?.strMeal || "No uName"}</h2>
    <h3>Ingredients: </h3>
    <ul class = "ingredientsList" >${fetchIngredients(meal) || "<li>No Ingredients Available</li>"}</ul>
    <div>
      <h3>Instructions:</h3>
      <p class = "recipeInstructions">${meal.strInstructions}</p>
    </div>
  `;
  console.log(recipeDetailsContent)
  
  // Show the recipe details container

  recipeDetailsContent.parentElement.style.display = 'none';
 
  
};


// Close button functionality

recipeCloseBtn.addEventListener("click", () => {
  recipeDetailsContent.parentElement.style.display = 'none';
});


searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const searchInput = searchBox.value.trim();
  fetchRecipes(searchInput);
});

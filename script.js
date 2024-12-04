// // Fuction to get Genrated Recipes

const searchBox = document.querySelector(".search-box");
const searchBtn = document.querySelector(".search-btn");
const recipeTitle = document.querySelector(".research-title");
const recipeDetails = document.querySelector(".recipe-details");
const resultCards = document.querySelector(".result-cards");

const fetchResultantRecipes = async (query) => {
  if (!query.trim()) {
    resultCards.innerHTML = "<h2>Please enter a search term.</h2>";
    recipeTitle.style.display = "none"; // Hide the title if no query
    return;
  }

  recipeTitle.style.display = "block";
  resultCards.innerHTML = "<h2>Fetching Recipe......</h2>";

  try {
    const data = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
    );
    const response = await data.json();

    resultCards.innerHTML = "";

    if (!response.meals) {
      resultCards.innerHTML = "<h2>No recipes found. Try another search!</h2>";
      return;
    }

    response.meals.forEach((meal) => {
      // Creating Result card Div
      const resultCard = document.createElement("div");
      resultCard.classList.add("result-card");

      // Add the recipe image
      resultCard.innerHTML = `
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      `;

      // Create card content div
      const cardContent = document.createElement("div");
      cardContent.classList.add("card-content");
      cardContent.innerHTML = `
        <p>${meal.strArea} Dish</p>
        <h2>${meal.strMeal}  
          <span>
            <i class="fa-solid fa-star" style="color: #ffd43b"></i>4.5
          </span>
        </h2>
        <h3>
          ${meal.strCategory}
          <span>
            <i class="fa-regular fa-heart"></i>
            <i class="fa-regular fa-comment"></i>
          </span>
        </h3>
      `;

      // Creating Button
      const button = document.createElement("button");
      button.textContent = "View Recipe";
      cardContent.appendChild(button);

      // Adding an event listener
      button.addEventListener("click", () => {
        openRecipePopup(meal);
      });

      resultCards.appendChild(resultCard);
      resultCard.appendChild(cardContent);
    });
  } catch (error) {
    resultCards.innerHTML = `<h2>Error fetching recipes. Please try again later.</h2>`;
    console.error("Error fetching recipes:", error);
  }
};

// Adding an event listener for the search button
searchBtn.addEventListener("click", () => {
  const query = searchBox.value;
  fetchResultantRecipes(query);
});


// Function To get  Recommended Recipes

const recipeContainer = document.querySelector(".recipe-cards");
const recipeDetailsContent = document.querySelector(".recipe-details-content");

const fetchRecipes = async (query) => {
  const data = await fetch(
    ` https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
  );
  const response = await data.json();
  recipeContainer.innerHTML = "";
  response.meals.forEach((meal) => {
    // Creating Recipe card div

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
       ${meal.strCategory}<span
                ><i class="fa-regular fa-heart"></i
                ><i class="fa-regular fa-comment"></i
              ></span>
            </h3>         
`;

    // Creating button

    const button = document.createElement("button");
    button.textContent = "View Recipe";
    cardContent.appendChild(button);

    button.addEventListener("click", () => {
      openRecipePopup(meal);
    });

    recipeContainer.appendChild(recipeDiv);
    recipeDiv.appendChild(cardContent);
  });
};

// Function to fetch ingredients and measurement

const fetchIngredients = (meal) => {
  let ingredientsList = "";
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    if (ingredient) {
      const measure = meal[`strMeasure${i}`];
      ingredientsList += `<li>${measure || ""} ${ingredient}</li>`;
    } else {
      continue;
    }
  }
  return ingredientsList;
};

const openRecipePopup = (meal) => {
	// Extract the YouTube video ID from the URL
	const youtubeEmbedUrl = meal.strYoutube
		? meal.strYoutube.replace('watch?v=', 'embed/')
		: '';

	recipeDetailsContent.innerHTML = `
    <h2 class="recipeName">${meal?.strMeal || 'No Name'}</h2>
    <h3 class="ingredientHeading">Ingredients:</h3>
    <ol class="ingredientsList">${
			fetchIngredients(meal) || '<li>No Ingredients Available</li>'
		}</ol>
    ${
			youtubeEmbedUrl
				? `<iframe width="600" height="315" src="${youtubeEmbedUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
				: '<p>No Video Available</p>'
		}
    <div class="recipeInstructions">
      <h3>Instructions:</h3>
      <p>${meal.strInstructions}</p>
    </div>
  `;
	// Show the recipe details container
	recipeDetails.style.display = 'block';
}; 

// Close button functionality

const recipeCloseBtn = document.querySelector(".recipe-close-btn");

recipeCloseBtn.addEventListener("click", () => {
  recipeDetails.style.display = "none";
});



//  Search Button Functionality

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const searchInput = searchBox.value.trim();
  fetchResultantRecipes(searchInput);
});

// FetchRecipes on page load

fetchRecipes("chicken");

// // Code for Recipe Button

const buttonReipes = document.querySelector(".button-recipes");
const menuCard = document.querySelector(".menu-card");
const menuCardContent = document.querySelector(".menu-card-content");
const featureButtons = document.querySelector(".feature-buttons");
const footerContent = document.querySelector(".footer-content");
const recommendedTitle = document.querySelector(".recommended-title");


// Function to open the menu popup and fetch recipes
const openMenuPopup = async () => {
  try {
    const data = await fetch(
      "https://www.themealdb.com/api/json/v1/1/search.php?s="
    );
    const response = await data.json();

    if (!response.meals) {
      menuCardContent.innerHTML = `
        <h2>Recipe Collection</h2>
        <p>No recipes found!</p>
      `;
      return;
    }

    // Group recipes by category
    const groupedRecipes = response.meals.reduce((acc, meal) => {
      if (!acc[meal.strCategory]) {
        acc[meal.strCategory] = [];
      }
      acc[meal.strCategory].push(meal);
      return acc;
    }, {});

    // Generate HTML content
    const recipeList = Object.entries(groupedRecipes)
      .map(
        ([category, meals]) => `
        <div class="menu-category-card">
          <h3 class="menu-category" onclick="toggleCategory(this)">${category}</h3>
          <ul class="recipe-list">
            ${meals
              .map(
                (meal) => `
              <li onclick="showSelectedRecipe('${meal.strMeal}', '${meal.strMealThumb}', '${meal.strInstructions}')">
                ${meal.strMeal}
              </li>`
              )
              .join("")}
          </ul>
        </div>
      `
      )
      .join("");

    // Render the content
    menuCardContent.innerHTML = `
      <h2>Recipe Collection</h2>
      ${recipeList}
    `;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    menuCardContent.innerHTML = `<p>Failed to load recipes. Please try again later.</p>`;
  }
};

// Toggle function for categories
function toggleCategory(categoryElement) {
  const ul = categoryElement.nextElementSibling;
  ul.style.display = ul.style.display === "none" ? "flex" : "none";
}

// Event listener for opening the menu
buttonReipes.addEventListener("click", (e) => {
  e.preventDefault();
  menuCard.style.display = "block";
  openMenuPopup();
});

const menuCloseBtn = document.querySelector(".menu-close-btn").addEventListener('click', () => {
  menuCard.style.display = "none";
  // openMenuPopup();
})

recipeCloseBtn.addEventListener("DOMContentLoaded", () => {
  menuCard.style.display = "none";
});

// Fumction for Load More Button

let currentPage = 1; // Start with page 1
const recipesPerPage = 10; // Number of recipes to fetch per page
const loadMoreBtn = document.querySelector(".load-more");

const fetchPaginatedRecipes = async (query, page) => {
  try {
    const data = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}&page=${page}&limit=${recipesPerPage}`
    );
    const response = await data.json();
    return response.meals || []; // Return empty array if no meals
  } catch (error) {
    console.error("Error fetching paginated recipes:", error);
    return [];
  }
};

loadMoreBtn.addEventListener("click", async () => {
  currentPage++; // Increment to fetch the next page
  const newRecipes = await fetchPaginatedRecipes(
    searchBox.value.trim(),
    currentPage
  );
  if (!newRecipes || newRecipes.length === 0) {
    loadMoreBtn.disabled = true;
    loadMoreBtn.textContent = "No More Recipes";
  } else {
    fetchPaginatedRecipes(newRecipes); // Assuming you have a renderRecipes function
  }
});


const select = document.querySelector("#select");
// const resultCards = document.querySelector(".result-cards");

// Function to fetch recipe categories
const fetchCategories = async () => {
  try {
    const response = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
    const data = await response.json();
    return data.categories || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

// Populate the select dropdown with categories
const populateCategories = async () => {
  const categories = await fetchCategories();

  // Clear existing options
  select.innerHTML = '<option value="">All Categories</option>';

  // Add categories dynamically
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.strCategory;
    option.textContent = category.strCategory;
    select.appendChild(option);
  });
};

async function getRecipeById(id) {
	try {
		const response = await fetch(
			`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`,
		);
		const data = await response.json();

		return data.meals[0];
	} catch (error) {
		console.error('Error fetching recipe details:', error);
		throw error;
	}
};


// Fetch and display recipes by selected category

const fetchAndDisplayRecipesByCategory = async (category) => {
  try {
    resultCards.innerHTML = "<h2>Loading Recipes...</h2>";

    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
    const data = await response.json();

    if (!data.meals || data.meals.length === 0) {
      resultCards.innerHTML = "<p>No recipes found for this category.</p>";
      return;
    }

    resultCards.innerHTML = ""; // Clear previous results

    data.meals.forEach((meal) => {
      // Create recipe card
      const resultCard = document.createElement("div");
      resultCard.classList.add("result-card");

      // Add meal content
      resultCard.innerHTML = `
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
        <div class="card-content">
          <p>${meal.strArea}   Dish</p>
          <h2>${meal.strMeal}
           <span>
                <i class="fa-solid fa-star" style="color: #ffd43b"></i>4.5
              </span>
          </h2>
            <h3>
                 ${category}<span
                ><i class="fa-regular fa-heart"></i
                ><i class="fa-regular fa-comment"></i
              ></span>
            </h3>   
          <button class="view-recipe-btn">View Recipe</button>
        </div>
      `;

    // Add event listener for "View Recipe" button
			resultCard
      .querySelector('.view-recipe-btn')
      .addEventListener('click', async () => {
        const mealDetails = await getRecipeById(meal.idMeal);
        openRecipePopup(mealDetails);
      });

      resultCards.appendChild(resultCard);
    });
  } catch (error) {
    console.error("Error fetching recipes:", error);
    resultCards.innerHTML = "<p>Failed to load recipes. Please try again later.</p>";
  }
};

// Add change event listener to select dropdown

select.addEventListener("change", (e) => {
  const selectedCategory = e.target.value;
  if (selectedCategory) {
    fetchAndDisplayRecipesByCategory(selectedCategory);
  } else {
    resultCards.innerHTML = "<p>Please select a category to view recipes.</p>";
  }
});



// Populate categories on page load

document.addEventListener("DOMContentLoaded", populateCategories);

const heroBannerContent = document.querySelector(".hero-banner-content");
const arrows = document.querySelectorAll(".arrows span");
const heroBanner = document.querySelector(".hero-banner");

// Trending recipes data
const trendingRecipes = [
  {
    title: "Chicken Biryani Karachi Style",
    author: "Zoha",
    image: "https://bakewithzoha.com/wp-content/uploads/2024/03/chicken-biryani-5-scaled.jpg",
  },
  {
    title: "Pasta Spaghetti",
    author: "Jane Doe",
    image: "https://as1.ftcdn.net/v2/jpg/09/21/84/96/1000_F_921849613_6mIHmQg12LUZpbpAfF6slvYheY6pNFIg.jpg",
  },
  {
    title: "KFC Zinger Burger",
    author: "Ibrahim Cafe",
    image: "https://media.istockphoto.com/id/1309352410/photo/cheeseburger-with-tomato-and-lettuce-on-wooden-board.jpg?s=2048x2048&w=is&k=20&c=wydysVEp52o1ULrj9XWI_f8M2lZ06qm8xlBl6GmjTSQ=",
  },
];

let currentRecipeIndex = 0;

// Function to update hero banner content
const updateHeroBanner = (index) => {
  const recipe = trendingRecipes[index];

  // Debugging: Log the recipe details to check if the data is correct
  console.log("Updating banner with recipe:", recipe);

  // Update hero banner content
  heroBannerContent.innerHTML = `
    <h3>Trending Now</h3>
    <h1>${recipe.title.split(" ").slice(0, 3).join(" ")}<br />${recipe.title.split(" ").slice(3).join(" ")}</h1>
    <p>By ${recipe.author}</p>
  `;

  // Update background image dynamically
  if (recipe.image) {
    heroBanner.style.backgroundImage = `url(${recipe.image})`;
  } else {
    console.error("Image URL is invalid or missing:", recipe.image);
    heroBanner.style.backgroundImage = ""; // Clear background if image is missing
  }
};

// Event listeners for navigation arrows

arrows[0].addEventListener("click", () => {
  // Navigate to the previous recipe
  currentRecipeIndex =
    (currentRecipeIndex - 1 + trendingRecipes.length) % trendingRecipes.length;
  updateHeroBanner(currentRecipeIndex);
});

arrows[1].addEventListener("click", () => {
  // Navigate to the next recipe
  currentRecipeIndex = (currentRecipeIndex + 1) % trendingRecipes.length;
  updateHeroBanner(currentRecipeIndex);
});

// Initialize hero banner with the first recipe

updateHeroBanner(currentRecipeIndex);



// Get the button element
const customMealPlanBtn = document.querySelector('#customMealPlanBtn');
const customMealPlanContainer = document.querySelector('.custom-meal-container');

// Add a click event listener

customMealPlanBtn.addEventListener('click', () => {
  customMealPlanContainer.style.display = "block"; 
});


document.querySelector(".custom-meal-container-close-btn").addEventListener('click', () => {
  customMealPlanContainer.style.display = "none"
})

// Meal options

// Meal options for each category
const meals = {
  vegetarian: {
    breakfast: "Avocado Toast with Fruits",
    lunch: "Grilled Vegetable Wrap",
    dinner: "Pasta Primavera"
  },
  vegan: {
    breakfast: "Smoothie Bowl",
    lunch: "Quinoa Salad",
    dinner: "Stir-Fried Tofu and Vegetables"
  },
  "non-vegetarian": {
    breakfast: "Egg and Cheese Sandwich",
    lunch: "Chicken Caesar Salad",
    dinner: "Grilled Salmon with Rice"
  }
};


// Get the meal plan container and diet select element
const dietSelect = document.querySelector("#diet");
const generateBtn = document.querySelector(".generate-plane");
const breakfastSpan = document.querySelector("#breakfast");
const lunchSpan = document.querySelector("#lunch");
const dinnerSpan = document.querySelector("#dinner");

// Event listener for selecting diet preference
dietSelect.addEventListener("change", () => {
  const selectedDiet = dietSelect.value;

  // Get the selected meal plan based on the diet
  const selectedMeals = meals[selectedDiet];

  // Display meal plan for selected diet
  breakfastSpan.textContent = selectedMeals.breakfast;
  lunchSpan.textContent = selectedMeals.lunch;
  dinnerSpan.textContent = selectedMeals.dinner;
});

generateBtn.addEventListener("click", () => {
  const selectedDiet = dietSelect.value;

  if (!meals[selectedDiet]) {
    alert("Invalid category selected. Please try again.");
    return;
  }
  // Display meal plan for selected diet

  const selectedMeals = meals[selectedDiet];
  breakfastSpan.textContent = selectedMeals.breakfast || "N/A";
  lunchSpan.textContent = selectedMeals.lunch || "N/A";
  dinnerSpan.textContent = selectedMeals.dinner || "N/A";
});

// === DOM Elements ===
const shareRecipeBtn = document.querySelector(".button-share-recipe"); // Button to open "Share Your Recipe" form
const shareRecipeContainer = document.querySelector(".share-recipe-container"); // Form container
const closeShareRecipeBtn = document.querySelector(".close-share-recipe"); // Button to close the form
const recipeForm = document.querySelector("#recipeForm"); // Recipe submission form
const recipesContainer = document.querySelector("#mealPlan"); // Where shared recipes will be displayed

// Optional UI Elements (for hiding/showing other parts of the page)
const socialMediaLinks = document.querySelector(".social-media-links");

// === Event Listeners ===

// 1. Open the "Share Recipe" Form
shareRecipeBtn.addEventListener("click", () => {
  // Show the form container
  shareRecipeContainer.style.display = "block";
});

// 2. Close the "Share Recipe" Form
closeShareRecipeBtn.addEventListener("click", () => {
  shareRecipeContainer.style.display = "none";
});

const instructionsError= document.querySelector(".instructions-error");
const ingredeintsError= document.querySelector(".ingredients-error");
const recipeNameError= document.querySelector(".recipe-name-error");

function errorMessage() {
 let hasError = false; // Initialize flag for tracking errors
 // Validate Instructions

 if (instructions.value.trim() === "") {
   instructionsError.textContent = "This field is required";
   instructionsError.style.color = "red";
   hasError = true;
  } else if (instructions.value.length > 10) {
  instructionsError.textContent = "Instructions should at least 10 characters long";
  hasError = true;
   } else {
   instructionsError.textContent = "";
 }

 if (ingredients.value.trim() === "") {
   ingredeintsError.textContent = "This field is required";
   ingredeintsError.style.color = "red";
   hasError = true;
 } else if (ingredients.value.length > 10) {
   ingredeintsError.textContent = "Ingredients should at least 10 characters long";
   hasError = true;
 } else {
   ingredeintsError.textContent = "";
 }

 if (recipeName.value.trim() === "") {
   recipeNameError.textContent = "This field is required";
   recipeNameError.style.color = "red";
   hasError = true;
 } else if (recipeName.value.length > 3) {
   recipeNameError.textContent = "Recipe Name should at least 3 characters long";
   hasError = true;
 } else {
   recipeNameError.textContent = "";
 }

 return hasError;
}

// 3. Handle Recipe Submission
recipeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const hasError =  errorMessage();
	// const hasError = errorMessage();
  if(!hasError){
  alert("Recipe shared successfully!");
  }
  
  




  // Get user input
  const recipeName = document.querySelector("#recipeName").value;
  const ingredients = document.querySelector("#ingredients").value;
  const instructions = document.querySelector("#instructions").value;

  // Validate input
  // if (!recipeName || !ingredients || !instructions) {
  //   alert("Please fill out all fields.");
  //   return;
  // }

  // Create a new recipe object
  const newRecipe = {
    name: recipeName,
    ingredients: ingredients.split(",").map((item) => item.trim()),
    instructions: instructions,
  };

  // Display the recipe (Append it to the DOM)
  recipesContainer.innerHTML += `
    <div class="shared-recipe">
      <h3>${newRecipe.name}</h3>
      <p><strong>Ingredients:</strong> ${newRecipe.ingredients.join(", ")}</p>
      <p><strong>Instructions:</strong> ${newRecipe.instructions}</p>
    </div>
  `;

  saveRecipeToLocalStorage(newRecipe);

  // Show a success message


});

// === Helper Functions ===

// Save a recipe to localStorage
function saveRecipeToLocalStorage(recipe) {
  const existingRecipes = JSON.parse(localStorage.getItem("recipes")) || [];
  existingRecipes.push(recipe);
  localStorage.setItem("recipes", JSON.stringify(existingRecipes));
}

// Retrieve recipes from localStorage
function getRecipesFromLocalStorage() {
  return JSON.parse(localStorage.getItem("recipes")) || [];
}













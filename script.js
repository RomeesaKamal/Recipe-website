// Fuction to get Genrated Recipes

const searchBox = document.querySelector(".search-box");
const searchBtn = document.querySelector(".search-btn");
const recipeTitle = document.querySelector(".research-title");
const recipeDetails = document.querySelector(".recipe-details");
const resultCards = document.querySelector(".result-cards");

const fetchResultantRecipes = async (query) => {
  recipeTitle.style.display = "block";
  resultCards.innerHTML = "<h2>Fetching Recipe......</h2>";

  const data = await fetch(
    ` https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
  );
  const response = await data.json();
  resultCards.innerHTML = "";
  response.meals.forEach((meal) => {
    // Creating Result card Div

    const resultCard = document.createElement("div");
    resultCard.classList.add("result-card");
    // Add the recipe image

    resultCard.innerHTML = `
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
       ${meal.strCategory}<span>
                <i class="fa-regular fa-heart"></i
                ><i class="fa-regular fa-comment"></i>
              </span>
            </h3>         
`;
    // Creating Button

    const button = document.createElement("button");
    button.textContent = "View Recipe";
    cardContent.appendChild(button);

    // Adiing an event listner

    button.addEventListener("click", () => {
      openRecipePopup(meal);
    });

    resultCards.appendChild(resultCard);
    resultCard.appendChild(cardContent);
  });
};

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
      ingredientsList += `<li>${measure || ""} ${ingredient}<li/>`;
    } else {
      continue;
    }
  }
  return ingredientsList;
};

const openRecipePopup = (meal) => {
  // Set the content of the popup

  recipeDetailsContent.innerHTML = `
    <h2 class="recipeName" >${meal?.strMeal || "No Name"}</h2>
    <h3 class = "ingredientHeading" >Ingredients: </h3>
    <ul class = "ingredientsList" >${
      fetchIngredients(meal) || "<li>No Ingredients Available</li>"
    }</ul>
      <video src="${meal.strYoutube}"></video>
    <div class = "recipeInstructions">
      <h3>Instructions:</h3>
      <p>${meal.strInstructions}</p>
    </div>
  `;

  // Show the recipe details container
  recipeDetails.style.display = "block";
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

// Code for Recipe Button

const buttonReipes = document.querySelector(".button-recipes");
const menuCard = document.querySelector(".menu-card");
const heroBanner = document.querySelector(".hero-banner");
const featureButtons = document.querySelector(".feature-buttons");
const footerContent = document.querySelector(".footer-content");
const recommendedTitle = document.querySelector(".recommended-title");


const openMenuPopup = async () => {
  try {
    // Fetch all recipes (use the desired query or API URL)
    const data = await fetch(
      "https://www.themealdb.com/api/json/v1/1/search.php?s="
    );
    const response = await data.json();

    if (!response.meals) {
      menuCard.innerHTML = `
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
      acc[meal.strCategory].push(meal.strMeal);
      return acc;
    }, {});

    // Generate HTML content
    const recipeList = Object.entries(groupedRecipes)
      .map(
        ([category, meals]) => `
        <h3 class = "menu-catogry">${category}</h3>
        <ul>
          ${meals.map((meal) => `<li>${meal}</li>`).join("")}
        </ul>
      `
      )
      .join("");

    // Render the generated content
    menuCard.innerHTML = `
      <h2>Recipe Collection</h2>
      ${recipeList}
    `;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    menuCard.innerHTML = `<p>Failed to load recipes. Please try again later.</p>`;
  }
};

buttonReipes.addEventListener("click", (e) => {
  e.preventDefault();
  recipeContainer.style.display = "none";
  resultCards.style.display = "none";
  recommendedTitle.style.display = "none";
  loadMoreBtn.style.display = "none";
  heroBanner.style.display = "none";
  menuCard.style.display = "block";
  featureButtons.style.marginTop = "5rem";
  footerContent.style.marginTop = "41rem";
  buttonReipes.style.hoverColor = "active";
  // menuCloseBtn.style.display = 'block'
  openMenuPopup();
});
const menuCloseBtn = document.querySelector(".menu-close-btn");

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

// const select = document.querySelector("#select");

// // Function to fetch recipe categories
// const fetchCategories = async () => {
//   try {
//     const response = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php'); // Correct API URL
//     const data = await response.json();
//     return data.categories || [];
//   } catch (error) {
//     console.error('Error fetching categories:', error);
//     return [];
//   }
// };

// // Populate the select dropdown with categories
// const populateCategories = async () => {
//   const categories = await fetchCategories();

//   // Clear existing options (if needed)
//   select.innerHTML = '<option value="">All Categories</option>';

//   // Add new categories as options
//   categories.forEach((category) => {
//     const option = document.createElement('option');
//     option.value = category.strCategory; // Use the category name as the value
//     option.textContent = category.strCategory;
//     select.appendChild(option);
//   });
// };

// // Add event listener to populate categories when the select element is clicked
// select.addEventListener('click', populateCategories);

// Select elements
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
       ${meal.strCategory}<span
                ><i class="fa-regular fa-heart"></i
                ><i class="fa-regular fa-comment"></i
              ></span>
            </h3>   
          <button class="view-recipe-btn"  data-id="${fetchIngredients(meal)}}">View Recipe</button>
        </div>
      `;

      // Add event listener for "View Recipe" button
      resultCard.querySelector(".view-recipe-btn").addEventListener("click", () => {
        openRecipePopup(meal);
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


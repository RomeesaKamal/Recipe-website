// *******************************************************************************************
// Recipe Web Application
// *******************************************************************************************

// Ensure the DOM is fully loaded before executing scripts
document.addEventListener("DOMContentLoaded", () => {
  // *******************************************************************************************
  // DOM Elements
  // *******************************************************************************************
  const searchBox = document.querySelector(".search-box");
  const searchBtn = document.querySelector(".search-btn");
  const recipeTitle = document.querySelector(".research-title");
  const recipeDetails = document.querySelector(".recipe-details");
  const recipeDetailsContent = document.querySelector(
    ".recipe-details-content"
  );
  const resultCards = document.querySelector(".result-cards");
  const categoryCards = document.querySelector(".category-cards");
  const categoryTitle = document.querySelector(".category-title");
  const select = document.querySelector("#select");
  const selectCategory = document.querySelector("#select-category");
  const recipeCloseBtn = document.querySelector(".recipe-close-btn");
  const commentPopup = document.getElementById("comment-popup");
  const commentForm = document.getElementById("comment-form");
  const commentsList = document.getElementById("comments-list");
  const recipeContainer = document.querySelector(".recipe-cards");

  // *******************************************************************************************
  // Utility Functions for LocalStorage
  // *******************************************************************************************

  /**
   * Save data to LocalStorage for a specific meal.
   * @param {string} mealId - The ID of the meal.
   * @param {string} key - The key to store (e.g., 'likes', 'rating', 'comments').
   * @param {*} value - The value to store.
   */
  const saveDataToLocalStorage = (mealId, key, value) => {
    const data = JSON.parse(localStorage.getItem(mealId)) || {};
    data[key] = value;
    localStorage.setItem(mealId, JSON.stringify(data));
  };

  /**
   * Retrieve data from LocalStorage for a specific meal.
   * @param {string} mealId - The ID of the meal.
   * @param {string} key - The key to retrieve (e.g., 'likes', 'rating', 'comments').
   * @returns {*} The retrieved value or null if not found.
   */
  const getDataFromLocalStorage = (mealId, key) => {
    const data = JSON.parse(localStorage.getItem(mealId)) || {};
    return data[key] || null;
  };

  // *******************************************************************************************
  // Fetch Ingredients for a Meal
  // *******************************************************************************************

  /**
   * Fetch and format the list of ingredients and measurements for a given meal.
   * @param {Object} meal - The meal object containing ingredient and measurement data.
   * @returns {string} HTML string of list items for ingredients.
   */
  const fetchIngredients = (meal) => {
    let ingredientsList = "";
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        ingredientsList += `<li>${
          measure ? measure.trim() : ""
        } ${ingredient.trim()}</li>`;
      }
    }
    return ingredientsList || '<li class="error">No Ingredients Available</li>';
  };

  // *******************************************************************************************
  // Open and Close Recipe Details Popup
  // *******************************************************************************************

  /**
   * Open the recipe details popup with the provided meal information.
   * @param {Object} meal - The meal object containing all necessary details.
   */
  const openRecipePopup = (meal) => {
    // Extract the YouTube video ID and create embed URL
    const youtubeEmbedUrl = meal.strYoutube
      ? meal.strYoutube.replace("watch?v=", "embed/")
      : "";

    // Populate the recipe details content
    recipeDetailsContent.innerHTML = `
      <h2 class="recipeName">${meal.strMeal || "No Name"}</h2>
      <h3 class="ingredientHeading">Ingredients:</h3>
      <ol class="ingredientsList">${fetchIngredients(meal)}</ol>
      ${
        youtubeEmbedUrl
          ? `<iframe width="600" height="315" src="${youtubeEmbedUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
          : "<p>No Video Available</p>"
      }
      <div class="recipeInstructions">
        <h3>Instructions:</h3>
        <p>${meal.strInstructions || "No instructions available."}</p>
      </div>
    `;

    // Display the recipe details popup
    recipeDetails.style.display = "block";
  };

  /**
   * Close the recipe details popup.
   */
  const closeRecipePopup = () => {
    recipeDetails.style.display = "none";
  };

  // Close button event listener
  recipeCloseBtn.addEventListener("click", closeRecipePopup);

  // *******************************************************************************************
  // Comment Popup Functionality
  // *******************************************************************************************

  /**
   * Open the comment popup for a specific meal.
   * @param {string} mealId - The ID of the meal to comment on.
   */
  const openCommentPopup = (mealId) => {
    // Load existing comments for this meal
    const storedComments = getDataFromLocalStorage(mealId, "comments") || [];
    commentsList.innerHTML = ""; // Clear previous comments
    storedComments.forEach((comment) => {
      const commentItem = document.createElement("p");
      commentItem.textContent = `${comment.name}: ${comment.text}`;
      commentsList.appendChild(commentItem);
    });

    // Show the comment popup
    commentPopup.classList.remove("hidden");

    // Close popup event listener
    document.getElementById("close-popup").addEventListener("click", () => {
      commentPopup.classList.add("hidden");
    });

    // Handle new comment submission
    commentForm.onsubmit = (e) => {
      e.preventDefault();
      const userName = document.getElementById("user-name").value.trim();
      const userComment = document.getElementById("user-comment").value.trim();

      if (userName && userComment) {
        const newComment = { name: userName, text: userComment };
        storedComments.push(newComment);
        saveDataToLocalStorage(mealId, "comments", storedComments);

        // Add the new comment to the list
        const commentItem = document.createElement("p");
        commentItem.textContent = `${newComment.name}: ${newComment.text}`;
        commentsList.appendChild(commentItem);

        // Clear form fields
        commentForm.reset();
      } else {
        alert("Please enter both your name and comment.");
      }
    };
  };

  // *******************************************************************************************
  // Bind Functionality to Recipe Cards
  // *******************************************************************************************

  /**
   * Bind like, rate, and comment functionalities to a recipe card.
   * @param {HTMLElement} card - The recipe card element.
   * @param {Object} meal - The meal object associated with the card.
   */
  const bindCardFunctionality = (card, meal) => {
    // Like Button Functionality

    const likeIcon = card.querySelector(".like-icon");
    const likeCount = card.querySelector(".like-count");

    // Get likes from localStorage and initialize
    const storedLikes = getDataFromLocalStorage(meal.idMeal, "likes") || 0;
    likeCount.textContent = storedLikes;

    if (storedLikes > 0) {
      likeIcon.classList.add("fa-solid");
      likeIcon.style.color = "red";
    }

    // Add click event listener
    likeIcon.addEventListener("click", () => {
      let currentCount = parseInt(likeCount.textContent, 10) || 0;

      if (likeIcon.classList.contains("fa-solid")) {
        // Unlike logic
        likeIcon.classList.remove("fa-solid");
        likeIcon.classList.add("fa-regular");
        likeIcon.style.color = "";
        currentCount = Math.max(currentCount - 1, 0); // Prevent negative counts
      } else {
        // Like logic
        likeIcon.classList.remove("fa-regular");
        likeIcon.classList.add("fa-solid");
        likeIcon.style.color = "red";
        currentCount += 1;
      }

      likeCount.textContent = currentCount;

      // Save updated likes to localStorage
      saveDataToLocalStorage(meal.idMeal, "likes", currentCount);
    });

    // Rating Functionality
    const rateStar = card.querySelector(".rate-star");
    const ratingValue = card.querySelector(".rating-value");
    const storedRating = getDataFromLocalStorage(meal.idMeal, "rating") || 0.0;
    ratingValue.textContent = storedRating.toFixed(1);

    rateStar.addEventListener("click", () => {
      let userRating = parseFloat(prompt("Enter your rating (1-5):"));
      if (isNaN(userRating) || userRating < 1 || userRating > 5) {
        alert("Please enter a valid rating between 1 and 5.");
        return;
      }

      const currentRating = parseFloat(ratingValue.textContent);
      const newRating =
        currentRating === 0 ? userRating : (currentRating + userRating) / 2;
      ratingValue.textContent = newRating.toFixed(1);

      // Save rating to LocalStorage
      saveDataToLocalStorage(meal.idMeal, "rating", newRating);
    });

    // Comment Button Functionality
    const commentIcon = card.querySelector(".comment-icon");
    commentIcon.addEventListener("click", () => openCommentPopup(meal.idMeal));
  };

  // *******************************************************************************************
  // Fetch and Display Resultant Recipes Based on Search Query
  // *******************************************************************************************

  /**
   * Fetch recipes based on the search query and display them.
   * @param {string} query - The search query entered by the user.
   */
  const fetchResultantRecipes = async (query) => {
    if (!query.trim()) {
      resultCards.innerHTML =
        "<h2 class='error'>Please enter a search term.</h2>";
      recipeTitle.style.display = "none";
      return;
    }

    recipeTitle.style.display = "block";
    resultCards.innerHTML = "<h2>Fetching Recipes...</h2>";

    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(
          query
        )}`
      );
      const data = await response.json();

      resultCards.innerHTML = "";

      if (!data.meals) {
        resultCards.innerHTML =
          "<h2 class='error'>No recipes found. Try another search!</h2>";
        return;
      }

      data.meals.forEach((meal) => {
        // Create Result Card
        const resultCard = document.createElement("div");
        resultCard.classList.add("result-card");

        // Add Recipe Image
        resultCard.innerHTML = `
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        `;

        // Create Card Content
        const cardContent = document.createElement("div");
        cardContent.classList.add("card-content");
        cardContent.innerHTML = `
          <p>${meal.strArea} Dish</p>
          <h2>${meal.strMeal}  
            <span>
              <i class="fa-solid fa-star rate-star" style="color: #ffd43b; cursor: pointer;"></i>
              <span class="rating-value">0.0</span>
            </span>
          </h2>
          <h3>
            ${meal.strCategory}
            <span>
              <i class="fa-regular fa-heart like-icon" style="cursor: pointer;"></i>
              <span class="like-count">0</span>
              <i class="fa-regular fa-comment comment-icon" style="cursor: pointer;"></i>
            </span>
          </h3>
          <div class="comments">
            <!-- User comments will be dynamically added here -->
          </div>
        `;

        // Add "View Recipe" Button
        const button = document.createElement("button");
        button.textContent = "View Recipe";
        button.addEventListener("click", () => openRecipePopup(meal));
        cardContent.appendChild(button);

        // Append Card Content to Result Card
        resultCard.appendChild(cardContent);

        // Bind Functionality (like, rate, comment)
        bindCardFunctionality(resultCard, meal);

        // Append Result Card to Container
        resultCards.appendChild(resultCard);
      });
    } catch (error) {
      console.error("Error fetching recipes:", error);
      resultCards.innerHTML =
        "<h2 class='error'>Error fetching recipes. Please try again later.</h2>";
    }
    loadMoreBtn.style.display = "block";
  };

  // *******************************************************************************************
  // Fetch and Display Recommended Recipes on Page Load
  // *******************************************************************************************

  /**
   * Fetch and display recommended recipes based on a default query.
   * @param {string} query - The default query to fetch recipes (e.g., "cake").
   */
  const fetchRecommendedRecipes = async (query = "cake") => {
    try {
      recipeContainer.innerHTML = "<h2>Loading Recipes...</h2>";

      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(
          query
        )}`
      );
      const data = await response.json();

      if (!data.meals || data.meals.length === 0) {
        recipeContainer.innerHTML = "<p>No recipes found for this query.</p>";
        return;
      }

      recipeContainer.innerHTML = "";
      loadMoreBtn.style.display = "none";

      data.meals.forEach((meal) => {
        const recipeCard = document.createElement("div");
        recipeCard.classList.add("recipe-card");

        // Add Recipe Image
        recipeCard.innerHTML = `
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        `;

        // Create Card Content
        const cardContent = document.createElement("div");
        cardContent.classList.add("card-content");
        cardContent.innerHTML = `
          <p>${meal.strArea} Dish</p>
          <h2>${meal.strMeal}  
            <span>
              <i class="fa-solid fa-star rate-star" style="color: #ffd43b; cursor: pointer;"></i>
              <span class="rating-value">0.0</span>
            </span>
          </h2>
          <h3>
            ${meal.strCategory}
            <span>
              <i class="fa-regular fa-heart like-icon" style="cursor: pointer;"></i>
              <span class="like-count">0</span>
              <i class="fa-regular fa-comment comment-icon" style="cursor: pointer;"></i>
            </span>
          </h3>
          <div class="comments">
            <!-- User comments will be dynamically added here -->
          </div>
        `;

        // Add "View Recipe" Button
        const button = document.createElement("button");
        button.textContent = "View Recipe";
        button.addEventListener("click", () => openRecipePopup(meal));
        cardContent.appendChild(button);

        // Append Card Content to Recipe Card
        recipeCard.appendChild(cardContent);

        // Bind Functionality (like, rate, comment)
        bindCardFunctionality(recipeCard, meal);

        // Append Recipe Card to Container
        recipeContainer.appendChild(recipeCard);
      });
    } catch (error) {
      console.error("Error fetching recommended recipes:", error);
      recipeContainer.innerHTML =
        "<p class='error'>Failed to load recipes. Please try again later.</p>";
    }

    fetchRecommendedRecipes(cake);
  };

  // *******************************************************************************************
  // Fetch and Display Recipes by Selected Category
  // *******************************************************************************************

  /**
   * Fetch and display recipes based on the selected category.
   * @param {string} category - The selected category.
   */
  const fetchAndDisplayRecipesByCategory = async (category) => {
    if (!category) {
      categoryCards.innerHTML =
        "<p>Please select a category to view recipes.</p>";
      categoryTitle.style.display = "none";
      return;
    }

    categoryTitle.style.display = "block";
    categoryCards.innerHTML = "<h2>Loading Recipes...</h2>";
    resultCards.innerHTML = "";
    recipeTitle.style.display = "none";

    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(
          category
        )}`
      );
      const data = await response.json();

      if (!data.meals || data.meals.length === 0) {
        categoryCards.innerHTML =
          "<p class='error'>No recipes found for this category.</p>";
        return;
      }

      categoryCards.innerHTML = ""; // Clear previous results

      for (const meal of data.meals) {
        // Fetch full meal details to get complete information
        const fullMeal = await getRecipeById(meal.idMeal);

        // Create Category Card
        const categoryCard = document.createElement("div");
        categoryCard.classList.add("category-card");

        // Add Recipe Image
        categoryCard.innerHTML = `
          <img src="${fullMeal.strMealThumb}" alt="${fullMeal.strMeal}">
        `;

        // Create Card Content
        const cardContent = document.createElement("div");
        cardContent.classList.add("card-content");
        cardContent.innerHTML = `
          <p>${fullMeal.strArea} Dish</p>
          <h2>${fullMeal.strMeal}  
            <span>
              <i class="fa-solid fa-star rate-star" style="color: #ffd43b; cursor: pointer;"></i>
              <span class="rating-value">0.0</span>
            </span>
          </h2>
          <h3>
            ${fullMeal.strCategory}
            <span>
              <i class="fa-regular fa-heart like-icon" style="cursor: pointer;"></i>
              <span class="like-count">0</span>
              <i class="fa-regular fa-comment comment-icon" style="cursor: pointer;"></i>
            </span>
          </h3>
          <div class="comments">
            <!-- User comments will be dynamically added here -->
          </div>
        `;

        // Add "View Recipe" Button
        const button = document.createElement("button");
        button.textContent = "View Recipe";
        button.addEventListener("click", () => openRecipePopup(fullMeal));
        cardContent.appendChild(button);

        // Append Card Content to Category Card
        categoryCard.appendChild(cardContent);

        // Bind Functionality (like, rate, comment)
        bindCardFunctionality(categoryCard, fullMeal);

        // Append Category Card to Container
        categoryCards.appendChild(categoryCard);
      }
    } catch (error) {
      console.error("Error fetching recipes by category:", error);
      categoryCards.innerHTML =
        "<p class='error'>Failed to load recipes. Please try again later.</p>";
    }
    loadMoreBtn.style.display = "block";
  };

  /**
   * Fetch full recipe details by meal ID.
   * @param {string} id - The meal ID.
   * @returns {Object} The meal object containing full details.
   */
  const getRecipeById = async (id) => {
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${encodeURIComponent(
          id
        )}`
      );
      const data = await response.json();
      return data.meals[0];
    } catch (error) {
      console.error("Error fetching recipe details:", error);
      throw error;
    }
  };

  // *******************************************************************************************
  // Fetch and Populate Recipe Categories
  // *******************************************************************************************

  /**
   * Fetch all recipe categories from TheMealDB API.
   * @returns {Array} An array of category objects.
   */
  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "https://www.themealdb.com/api/json/v1/1/categories.php"
      );
      const data = await response.json();
      return data.categories || [];
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  };

  /**
   * Populate the category dropdown with fetched categories.
   */
  const populateCategories = async () => {
    const categories = await fetchCategories();

    // Clear existing options and add default
    select.innerHTML = '<option value="">All Categories</option>';
    selectCategory.innerHTML = '<option value="">All Categories</option>';

    // Add categories dynamically
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.strCategory;
      option.textContent = category.strCategory;
      select.appendChild(option);
      selectCategory.appendChild(option);
    });
  };

  // *******************************************************************************************
  // Event Listeners
  // *******************************************************************************************

  // Search Button Click Event
  searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const searchInput = searchBox.value.trim();
    fetchResultantRecipes(searchInput);
  });

  // Category Select Change Event
  select.addEventListener("change", (e) => {
    const selectedCategory = e.target.value;
    fetchAndDisplayRecipesByCategory(selectedCategory);
  });

  selectCategory.addEventListener("change", (e) => {
    const selectedCategory = e.target.value;
    fetchAndDisplayRecipesByCategory(selectedCategory);
  });

 


  // *******************************************************************************************
  // Initial Function Calls
  // *******************************************************************************************

  // Populate categories on page load
  populateCategories();

  // Fetch and display recommended recipes on page load
  fetchRecommendedRecipes();
});

// ****************************************************************

// === DOM Elements ===

// Buttons and Containers
const buttonReipes = document.querySelector(".button-recipes");
const menuCard = document.querySelector(".menu-card");
const menuCardContent = document.querySelector(".menu-card-content");
const featureButtons = document.querySelector(".feature-buttons");
const footerContent = document.querySelector(".footer-content");
const recommendedTitle = document.querySelector(".recommended-title");
const menuCloseBtn = document.querySelector(".menu-close-btn");
const recipeCloseBtn = document.querySelector(".recipe-close-btn");
const loadMoreBtn = document.querySelector(".load-more");
const shareRecipeBtn = document.querySelector(".button-share-recipe");
const shareRecipeContainer = document.querySelector(".share-recipe-container");
const closeShareRecipeBtn = document.querySelector(".close-share-recipe");
const customMealPlanBtn = document.querySelector(".button-custom-meal");
const customMealPlanContainer = document.querySelector(
  ".custom-meal-container"
);
const closeMealPlanBtn = document.querySelector(
  ".custom-meal-container-close-btn"
);

// Herro Banner

const heroBannerContent = document.querySelector(".hero-banner-content");
const arrows = document.querySelectorAll(".arrows span");
const heroBanner = document.querySelector(".hero-banner");

// Recipe Form Inputs and Errors
const recipeForm = document.querySelector("#recipeForm");
const recipeName = document.querySelector("#recipeName");
const ingredients = document.querySelector("#ingredients");
const instructions = document.querySelector("#instructions");
const recipeNameError = document.querySelector(".recipe-name-error");
const ingredientsError = document.querySelector(".ingredients-error");
const instructionsError = document.querySelector(".instructions-error");
const sharedRecipesContainer = document.querySelector(".user-shared-recipe");
const successPopup = document.querySelector("#successPopup");
const popupMessage = document.querySelector("#popupMessage");

// Meal Plan Elements
const dietSelect = document.querySelector("#diet");
const generateBtn = document.querySelector(".generate-plane");
const breakfastSpan = document.querySelector("#breakfast");
const lunchSpan = document.querySelector("#lunch");
const dinnerSpan = document.querySelector("#dinner");

// Tips
const tipsBtn = document.querySelector("#tips-btn");
const tipCard = document.querySelector("#tip-card");
const tipText = document.querySelector("#tip-text");
const tipcontainer = document.querySelector(".cooking-tips-container");
const tipButton = document.querySelector(".button-cooking-tips");

// Email
const emailInput = document.querySelector(".email-subscribe input");
const subscribeBtn = document.querySelector(".email-subscribe button");

// === API and Recipe Management ===

// Fetch and display recipes
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
      if (!acc[meal.strCategory]) acc[meal.strCategory] = [];
      acc[meal.strCategory].push(meal);
      return acc;
    }, {});

    // Generate HTML
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
            </li>
          `
            )
            .join("")}
        </ul>
      </div>
    `
      )
      .join("");

    menuCardContent.innerHTML = `
      <h2>Recipe Collection</h2>
      ${recipeList}
    `;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    menuCardContent.innerHTML = `<p>Failed to load recipes. Please try again later.</p>`;
  }
};

// Toggle categories
function toggleCategory(categoryElement) {
  const ul = categoryElement.nextElementSibling;
  ul.style.display = ul.style.display === "none" ? "flex" : "none";
}

// === Event Listeners ===

// Open and close menu card
buttonReipes.addEventListener("click", (e) => {
  e.preventDefault();
  menuCard.style.display = "block";
  openMenuPopup();
});
menuCloseBtn.addEventListener("click", () => (menuCard.style.display = "none"));

// ***************************************************************

// Selectors
document.addEventListener("DOMContentLoaded", () => {
  const searchBox = document.querySelector("#searchBox");
  // const loadMoreBtn = document.querySelector("#loadMoreBtn");
  let currentPage = 1;

  async function fetchRecipes(apiUrl, query, page = 1) {
    try {
      const response = await fetch(`${apiUrl}?search=${query}&page=${page}`);
      if (!response.ok) {
        throw new Error("Failed to fetch recipes.");
      }
      const data = await response.json();
      return data.recipes || [];
    } catch (error) {
      console.error("Error fetching recipes:", error);
      return [];
    }
  }

  async function handleLoadMore() {
    const apiUrl = "https://example.com/api/recipes"; // Replace with your API URL
    const searchQuery = searchBox?.value.trim() || "";
    currentPage++;
    const newRecipes = await fetchRecipes(apiUrl, searchQuery, currentPage);

    if (!newRecipes || newRecipes.length === 0) {
      loadMoreBtn.disabled = true;
      loadMoreBtn.textContent = "No More Recipes";
      loadMoreBtn.style.color = "red";
      loadMoreBtn.style.fontSize = "24px";
    } else {
      renderRecipes(newRecipes); // Ensure renderRecipes is defined
    }
  }

  loadMoreBtn.addEventListener("click", handleLoadMore);
});

function renderRecipes(recipes) {
  const recipeContainer = document.querySelector("#recipeContainer"); // Update with your container ID
  recipes.forEach((recipe) => {
    const recipeCard = document.createElement("div");
    recipeCard.className = "recipe-card";
    recipeCard.innerHTML = `
      <h3>${recipe.title}</h3>
      <p>${recipe.description}</p>
    `;
    recipeContainer.appendChild(recipeCard);
  });
}

//***********************************************************************************
// Trending recipes data

const trendingRecipes = [
  {
    title: "Chicken Biryani Karachi Style",
    author: "Zoha",
    image:
      "https://bakewithzoha.com/wp-content/uploads/2024/03/chicken-biryani-5-scaled.jpg",
  },
  {
    title: "Pasta Spaghetti",
    author: "Jane Doe",
    image:
      "https://as1.ftcdn.net/v2/jpg/09/21/84/96/1000_F_921849613_6mIHmQg12LUZpbpAfF6slvYheY6pNFIg.jpg",
  },
  {
    title: "KFC Zinger Burger",
    author: "Ibrahim Cafe",
    image:
      "https://media.istockphoto.com/id/1309352410/photo/cheeseburger-with-tomato-and-lettuce-on-wooden-board.jpg?s=2048x2048&w=is&k=20&c=wydysVEp52o1ULrj9XWI_f8M2lZ06qm8xlBl6GmjTSQ=",
  },
];

let currentRecipeIndex = 0;

// Elements
// Assumes left arrow is arrows[0] and right arrow is arrows[1]

// Function to update the hero banner
function updateHeroBanner(index) {
  const recipe = trendingRecipes[index];

  if (!recipe) {
    console.error("Recipe data not found for index:", index);
    return;
  }

  // Update hero banner content
  heroBannerContent.innerHTML = `
    <h3>Trending Now</h3>
    <h1>${recipe.title.split(" ").slice(0, 3).join(" ")}<br />
    ${recipe.title.split(" ").slice(3).join(" ")}</h1>
    <p>By ${recipe.author}</p>
  `;

  // Update background image
  if (recipe.image) {
    heroBanner.style.backgroundImage = `url(${recipe.image})`;
  } else {
    console.error("Image URL is invalid or missing:", recipe.image);
    heroBanner.style.backgroundImage = ""; // Clear background if image is missing
  }
}

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

// ************************************************************

// Share Recipe Form

// Function to validate the form
function validateForm() {
  let isValid = true;

  recipeNameError.textContent = "";
  ingredientsError.textContent = "";
  instructionsError.textContent = "";

  if (recipeName.value.trim() === "") {
    recipeNameError.textContent = "Recipe name is required.";
    recipeNameError.style.color = "red";
    isValid = false;
  } else if (recipeName.value.length > 50) {
    recipeNameError.textContent =
      "Recipe name must be less than 50 characters.";
    recipeNameError.style.color = "red";
    isValid = false;
  }

  if (ingredients.value.trim() === "") {
    ingredientsError.textContent = "Ingredients are required.";
    ingredientsError.style.color = "red";
    isValid = false;
  } else if (ingredients.value.length > 200) {
    ingredientsError.textContent =
      "Ingredients must be less than 200 characters.";
    ingredientsError.style.color = "red";
    isValid = false;
  }

  if (instructions.value.trim() === "") {
    instructionsError.textContent = "Instructions are required.";
    instructionsError.style.color = "red";
    isValid = false;
  } else if (instructions.value.length > 500) {
    instructionsError.textContent =
      "Instructions must be less than 500 characters.";
    isValid = false;
  }
  return isValid;
}

function clearErrorMessage(inputField, errorField) {
  inputField.addEventListener("input", () => {
    errorField.textContent = "";
  });
}

clearErrorMessage(recipeName, recipeNameError);
clearErrorMessage(ingredients, ingredientsError);
clearErrorMessage(instructions, instructionsError);

// Function to create and add a recipe card

function addRecipeCard(name, ingredientsList, instructionsText, index) {
  const recipeCard = document.createElement("div");
  recipeCard.classList.add("recipes-card");
  recipeCard.innerHTML = `
    <h3>${name} <span class="delete-btn" data-index="${index}"><i class="fa-solid fa-trash"></i></span></h3>
    <p><strong>Ingredients:</strong> ${ingredientsList}</p>
    <p><strong>Instructions:</strong> ${instructionsText}</p>
  `;

  sharedRecipesContainer.appendChild(recipeCard);

  // Attach delete functionality
  const deleteButton = recipeCard.querySelector(".delete-btn");
  deleteButton.addEventListener("click", () => {
    deleteRecipe(index);
  });
}

// Function to delete a recipe
function deleteRecipe(index) {
  const storedRecipes = JSON.parse(localStorage.getItem("userRecipes")) || [];
  storedRecipes.splice(index, 1); // Remove recipe at the given index
  localStorage.setItem("userRecipes", JSON.stringify(storedRecipes)); // Update localStorage
  renderRecipes(); // Re-render the recipes
}

// Function to render all recipes
function renderRecipes() {
  sharedRecipesContainer.innerHTML = ""; // Clear existing recipes
  const storedRecipes = JSON.parse(localStorage.getItem("userRecipes")) || [];
  storedRecipes.forEach((recipe, index) => {
    //  shareRecipeContainer.innerHTML = ` `;
    addRecipeCard(recipe.name, recipe.ingredients, recipe.instructions, index);
  });
}

// Handle form submission
recipeForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (validateForm()) {
    const recipeData = {
      name: recipeName.value.trim(),
      ingredients: ingredients.value.trim(),
      instructions: instructions.value.trim(),
    };

    const storedRecipes = JSON.parse(localStorage.getItem("userRecipes")) || [];
    storedRecipes.push(recipeData);
    localStorage.setItem("userRecipes", JSON.stringify(storedRecipes));

    renderRecipes(); // Update recipe cards
    recipeForm.reset(); // Clear the form

    showPopup("Your recipe has been added successfully!");
  }
});

// Show the popup with a message
function showPopup(message) {
  popupMessage.textContent = message;
  popupMessage.style.color = "green";
  popupMessage.style.fontSize = "22px";
  successPopup.classList.remove("hidden"); // Make it visible
  setTimeout(() => {
    successPopup.classList.add("hidden"); // Auto-hide after 3 seconds
  }, 2000);
}

// Load recipes from localStorage on page load
window.addEventListener("load", () => {
  renderRecipes();
});

shareRecipeBtn.addEventListener(
  "click",
  () => (shareRecipeContainer.style.display = "block")
);
closeShareRecipeBtn.addEventListener(
  "click",
  () => (shareRecipeContainer.style.display = "none")
);

// Custom Meal Plan

// Define meal options for each diet type
const mealPlans = {
  vegan: {
    breakfast: [
      "Tofu Scramble",
      "Vegan Smoothie Bowl",
      "Chia Pudding with Berries",
      "Oatmeal with Almond Butter",
    ],
    lunch: [
      "Lentil Salad",
      "Vegan Tacos",
      "Quinoa & Chickpea Salad",
      "Veggie Stir-Fry with Tofu",
    ],
    dinner: [
      "Vegan Buddha Bowl",
      "Stuffed Sweet Potatoes",
      "Vegan Lasagna",
      "Vegetable Curry with Rice",
    ],
  },
  vegetarian: {
    breakfast: [
      "Vegetarian Breakfast Burrito",
      "Greek Yogurt with Honey and Fruit",
      "Avocado Toast",
      "Vegetable Omelette",
    ],
    lunch: [
      "Caprese Salad",
      "Vegetarian Wrap with Hummus",
      "Stuffed Bell Peppers",
      "Grilled Cheese Sandwich with Tomato Soup",
    ],
    dinner: [
      "Vegetable Stir Fry",
      "Mushroom Risotto",
      "Vegetarian Chili",
      "Vegetarian Pizza",
    ],
  },
  keto: {
    breakfast: [
      "Scrambled Eggs with Avocado",
      "Keto Pancakes",
      "Chia Pudding with Almond Milk",
      "Bacon and Eggs",
    ],
    lunch: [
      "Chicken Salad with Avocado",
      "Zucchini Noodles with Pesto",
      "Grilled Salmon with Asparagus",
      "Keto Chicken Wrap",
    ],
    dinner: [
      "Cauliflower Rice Stir-Fry",
      "Keto Chicken Alfredo",
      "Zucchini Lasagna",
      "Steak with Roasted Vegetables",
    ],
  },
  "low-carb": {
    breakfast: [
      "Scrambled Eggs with Spinach",
      "Low-Carb Smoothie",
      "Egg Muffins",
      "Greek Yogurt with Nuts",
    ],
    lunch: [
      "Grilled Chicken Salad",
      "Cauliflower Rice Bowl",
      "Lettuce Wraps with Turkey and Cheese",
      "Eggplant Parmesan",
    ],
    dinner: [
      "Grilled Salmon with Broccoli",
      "Cauliflower Mash with Steak",
      "Low-Carb Pizza",
      "Chicken with Zucchini Noodles",
    ],
  },
};

// Function to generate a random meal plan for the day
function generateMealPlan(diet) {
  const meals = mealPlans[diet];

  // Get random meals for each category
  const breakfast =
    meals.breakfast[Math.floor(Math.random() * meals.breakfast.length)];
  const lunch = meals.lunch[Math.floor(Math.random() * meals.lunch.length)];
  const dinner = meals.dinner[Math.floor(Math.random() * meals.dinner.length)];

  // Update the meal plan in the HTML
  breakfastSpan.textContent = breakfast;
  lunchSpan.textContent = lunch;
  dinnerSpan.textContent = dinner;

  // Store the meal plan in localStorage
  localStorage.setItem(
    "mealPlan",
    JSON.stringify({ breakfast, lunch, dinner })
  );
  localStorage.setItem("selectedDiet", diet);
}

// Event listener for generating the meal plan when the button is clicked
generateBtn.addEventListener("click", (event) => {
  event.preventDefault(); // Prevents page reload or default form submission

  const selectedDiet = dietSelect.value; // Get the selected diet type
  generateMealPlan(selectedDiet); // Generate and display the meal plan for the selected diet
});

// Retrieve meal plan from localStorage on page load
window.addEventListener("load", () => {
  const storedMealPlan = JSON.parse(localStorage.getItem("mealPlan"));
  const storedDiet = localStorage.getItem("selectedDiet");

  if (storedMealPlan && storedDiet) {
    // If a meal plan is stored, display it
    breakfastSpan.textContent = storedMealPlan.breakfast;
    lunchSpan.textContent = storedMealPlan.lunch;
    dinnerSpan.textContent = storedMealPlan.dinner;

    // Optionally, restore the selected diet in the select dropdown
    dietSelect.value = storedDiet;
  }
});

customMealPlanBtn.addEventListener("click", (e) => {
  e.preventDefault();
  customMealPlanContainer.style.display = "block";
});

closeMealPlanBtn.addEventListener(
  "click",
  () => (customMealPlanContainer.style.display = "none")
);

// ****************************************

// Grocery List

// Load the list from local storage
function loadList() {
  const storedItems = JSON.parse(localStorage.getItem("groceryList")) || [];
  const groceryList = document.getElementById("groceryList");
  groceryList.innerHTML = "";
  storedItems.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `${item} <span class="delete-btn" data-index="${index}"><i class="fa-solid fa-trash"></i></span>`;
    groceryList.appendChild(li);
  });
}

// Save the list to local storage
function saveList() {
  const groceryList = document.getElementById("groceryList");
  const items = Array.from(groceryList.children).map((li) =>
    li.textContent.trim()
  );
  localStorage.setItem("groceryList", JSON.stringify(items));
}

// Add a new item to the list
function addItem() {
  const itemInput = document.getElementById("itemInput");
  const groceryList = document.getElementById("groceryList");
  if (itemInput.value.trim() !== "") {
    const li = document.createElement("li");
    li.innerHTML = `${itemInput.value.trim()} <span class="delete-btn"><i class="fa-solid fa-trash"></i></span>`;
    groceryList.appendChild(li);
    itemInput.value = "";
    saveList(); // Save the updated list
  }
}

// Handle delete functionality
document
  .getElementById("groceryList")
  .addEventListener("click", function (event) {
    if (event.target.closest(".delete-btn")) {
      const li = event.target.closest("li");
      li.remove(); // Remove the item from the DOM
      saveList(); // Save the updated list
    }
  });

// Load the list on page load
window.onload = loadList;

document
  .querySelector(".button-grocery-list")
  .addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelector(".grocery-list-container").style.display = "block";
    addItem();
  });

document
  .querySelector(".grocery-list-close-btn")
  .addEventListener("click", () => {
    document.querySelector(".grocery-list-container").style.display = "none";
  });

// ************************************************************

// Array of cooking tips
const tips = [
  "Always taste your food as you cook to adjust seasoning.",
  "Use a sharp knife—it’s safer and more efficient than a dull one.",
  "Let meat rest after cooking to retain its juices.",
  "Use room-temperature ingredients for better cooking or baking results.",
  "Add a splash of vinegar or lemon juice to soups or sauces to brighten the flavor.",
  "Chill cookie dough before baking for better texture.",
  "Always measure ingredients precisely for baking—it's a science.",
  "Bring eggs to room temperature before baking to mix better with other ingredients.",
  "Use parchment paper to prevent sticking and make cleanup easier.",
  "Don’t overmix batter—it can make baked goods tough.",
  "Mise en place: Prep ingredients beforehand.",
  "Knife skills: Practice basic cuts like chop, mince, and dice.",
  "Seasoning: Taste as you go, adjust salt and pepper.",
  "Read recipes thoroughly.",
  "Clean as you go.",
  "Sautéing: Cook food quickly in a small amount of oil over high heat.",
  "Stir-frying: A faster version of sautéing, often used in Asian cuisine.",
  "Roasting: Cooking food in an oven with dry heat.",
  "Baking: Cooking food in an oven with moist heat.",
  "Grilling: Cooking food directly over a heat source.",
  "Boiling: Cooking food in simmering water.",
  "Steaming: Cooking food with steam.",
  "Use fresh herbs whenever possible.",
  "Store herbs wrapped in damp paper towels in the fridge.",
  "Store spices in airtight containers away from heat and light.",
  "Use high-quality olive oil.",
  "Let butter soften to room temperature before using.",
  "Use fresh eggs.",
  "Reserve pasta water to thicken sauces.",
  "Rinse rice before cooking to remove excess starch.",
  "A splash of lemon juice or vinegar can brighten flavors.",
  "Butter, oil, or mayonnaise can add richness.",
  "Salt enhances flavors and balances dishes.",
  "Experiment with different combinations of herbs and spices.",
  "Use ingredients like soy sauce, mushrooms, and Parmesan cheese for a savory flavor.",
  "Use room temperature ingredients.",
  "Accurate measurements are key.",
  "Preheat your oven.",
  "Don't overmix batter.",
  "Let baked goods cool completely before storing.",
  "Use sharp knives carefully.",
  "Use pot holders or oven mitts.",
  "Prevent cross-contamination with separate cutting boards.",
  "Know how to extinguish a kitchen fire.",
  "Practice proper food handling and storage.",
  "Taste as you go.",
  "Experiment with new recipes and ingredients.",
  "Learn from mistakes.",
  "Have fun cooking.",
  "Share your passion with others.",
  "To prevent sticking, grease pans or use parchment paper.",
  "To flavor a crust, brine poultry before cooking.",
  "To prevent overcooking pasta, drain it a minute or two before it's al dente.",
  "To keep avocados fresh, store them in the refrigerator.",
  "To ripen avocados faster, place them in a paper bag with a banana.",
  "To prevent browning of cut apples, toss them in lemon juice.",
  "To keep lettuce crisp, store it in a paper towel-lined container in the fridge.",
  "To make perfect scrambled eggs, cook them over low heat and stir constantly.",
  "To prevent overcooking vegetables, cook them in a small amount of water or broth.",
  "To add flavor to roasted vegetables, drizzle them with olive oil, balsamic vinegar, and herbs.",
  "To prevent onions from making you cry, chill them before cutting.",
  "To remove seeds from a chili pepper, cut it in half and scrape the seeds out with a spoon.",
  "To make homemade breadcrumbs, pulse stale bread in a food processor.",
  "To keep herbs fresh, store them in a glass of water in the refrigerator.",
  "To make a perfect omelet, cook it over low heat and flip it only once.",
  "To prevent meat from sticking to the grill, oil the grill grates before cooking.",
  "To make a flavorful marinade, use a combination of acidic ingredients, oil, and herbs and spices.",
  "To prevent rice from sticking to the pot, rinse it before cooking.",
  "To make a fluffy omelet, whisk the eggs until they are frothy.",
  "To prevent cookies from spreading too much, chill the dough before baking.",
  "To make a perfect steak, cook it over high heat for a short amount of time.",
  "To make a flavorful soup, simmer it for a long time.",
  "To make a creamy sauce, use a roux.",
  "To make a crispy crust on a pie, brush it with egg wash before baking.",
  "To make a flaky pie crust, use cold butter and a light touch.",
  "To make a tender roast, let it rest for 10-15 minutes before carving.",
  "To make a juicy burger, don't overcook it.",
  "To make a flavorful grilled cheese sandwich, use good quality bread and cheese.",
  "To make a perfect cup of coffee, use fresh, cold water and a good coffee grinder.",
  "To make a perfect cup of tea, use boiling water and steep for the appropriate amount of time.",
];

// Initialize a variable to track the current tip index
let currentTipIndex = 0;

// Event listener to show the first tip when the button is clicked
tipsBtn.addEventListener("click", () => {
  // Display the first tip if it's hidden
  if (tipCard.classList.contains("hidden")) {
    tipCard.classList.remove("hidden");
    tipCard.classList.add("active");
  }

  // Show the first tip
  tipText.textContent = tips[currentTipIndex];
});

// Event listener to show the next tip each time the current tip is clicked
tipCard.addEventListener("click", () => {
  // Move to the next tip, or loop back to the first tip if at the end
  currentTipIndex = (currentTipIndex + 1) % tips.length;

  // Display the next tip
  tipText.textContent = tips[currentTipIndex];
});

// Open the cooking tips container
tipButton.addEventListener("click", () => {
  tipcontainer.style.display = "block"; // Show the container with cooking tips
});

// Close the cooking tips container
document
  .querySelector(".cooking-tips-close-btn")
  .addEventListener("click", () => {
    tipcontainer.style.display = "none"; // Hide the container
  });

// **********************************************************************
// Create an error message element
const emailError = document.createElement("p");
emailError.style.color = "red";
emailError.style.fontSize = "12px";
emailError.style.marginTop = "5px";
emailError.style.display = "none"; // Initially hidden
document.querySelector(".email-subscribe").appendChild(emailError);

// === Helper Functions ===

// Validate Email Format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format validation
  return emailRegex.test(email);
}

// Save Email to Local Storage
function saveEmailToLocalStorage(email) {
  const storedEmails =
    JSON.parse(localStorage.getItem("subscribedEmails")) || [];
  if (!storedEmails.includes(email)) {
    storedEmails.push(email);
    localStorage.setItem("subscribedEmails", JSON.stringify(storedEmails));
  }
}

// === Event Listeners ===

emailInput.addEventListener("input", () => {
  // Clear error message when user starts typing
  emailError.style.display = "none";

  // Clear error message if email becomes valid
  if (isValidEmail(emailInput.value.trim())) {
    emailError.style.display = "none";
  }
});

subscribeBtn.addEventListener("click", () => {
  const emailValue = emailInput.value.trim();

  // Validate input
  if (emailValue === "") {
    emailError.textContent = "Email field cannot be empty.";
    emailError.style.display = "block";
    emailError.style.fontSize = "16px";
  } else if (!isValidEmail(emailValue)) {
    emailError.textContent = "Please enter a valid email address.";
    emailError.style.display = "block";
    emailError.style.fontSize = "12px";
  } else {
    // Save email and show success message
    saveEmailToLocalStorage(emailValue);

    emailError.style.color = "green";
    emailError.textContent = "Subscription successful!";
    emailError.style.display = "block";
    emailError.style.fontSize = "16px";

    // Clear the input after subscription
    emailInput.value = "";

    // Reset error message after a few seconds
    setTimeout(() => {
      emailError.style.display = "none";
      emailError.style.color = "red";
      emailError.style.fontSize = "16px";
    }, 1000);
  }
});

// ************************************************************************

// // Mobile Version

function toggleMenu() {
  const menu = document.querySelector(".mobile-menu");
  if (menu.style.display === "flex") {
    menu.style.display = "none";
  } else {
    menu.style.display = "flex";
  }
}

function toggleMenu() {
  const menu = document.querySelector(".mobile-menu");
  menu.classList.toggle("active");
}

document.querySelector("#recipBtn").addEventListener("click", (e) => {
  e.preventDefault();
  menuCard.style.display = "block";
  openMenuPopup();
});

document.querySelector("#shareBtn").addEventListener("click", (e) => {
  e.preventDefault();
  shareRecipeContainer.style.display = "block";
});

document.querySelector("#customBtn").addEventListener("click", (e) => {
  e.preventDefault();
  customMealPlanContainer.style.display = "block";
});

document.querySelector("#groceryBtn").addEventListener("click", (e) => {
  e.preventDefault();
  document.querySelector(".grocery-list-container").style.display = "block";
});

document.querySelector("#tipBtn").addEventListener("click", (e) => {
  e.preventDefault();
  tipcontainer.style.display = "block";
});


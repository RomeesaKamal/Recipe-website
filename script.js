// // Fuction to get Genrated Recipes

const searchBox = document.querySelector(".search-box");
const searchBtn = document.querySelector(".search-btn");
const recipeTitle = document.querySelector(".research-title");
const recipeDetails = document.querySelector(".recipe-details");
const popup = document.querySelector('.popup');
const resultCards = document.querySelector(".result-cards");


// Function to fetch resultant recipes
const fetchResultantRecipes = async (query) => {
  if (!query.trim()) {
    resultCards.innerHTML = "<h2 class= 'error'>Please enter a search term.</h2>";
    recipeTitle.style.display = "none"; // Hide the title if no query
    return;
  }

  recipeTitle.style.display = "block";
  resultCards.innerHTML = "<h2>Fetching Recipe...</h2>";

  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
    );
    const data = await response.json();

    resultCards.innerHTML = "";

    // Handle no recipes found
    if (!data.meals) {
      resultCards.innerHTML = "<h2 class='erroe'>No recipes found. Try another search!</h2>";
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
            <i class="fa-solid fa-star rate-star" data-rating="0" style="color: #ffd43b; cursor: pointer;"></i>
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

      // Append Card Content
      resultCard.appendChild(cardContent);

      // Bind Functionality (like, rate, comment)
      bindCardFunctionality(resultCard, meal);

      // Append Result Card to Container
      resultCards.appendChild(resultCard);
    });
  } catch (error) {
    resultCards.innerHTML = `<h2 class ='error'>Error fetching recipes. Please try again later.</h2>`;
    console.error("Error fetching recipes:", error);
  }
};

// Function to bind card functionality (like, rate, comment)

const bindCardFunction = (card, meal) => {
  // Like Button
  const likeIcon = card.querySelector(".like-icon");
  const likeCount = card.querySelector(".like-count");
  likeIcon.addEventListener("click", () => {
    likeIcon.classList.toggle("liked");
    const isLiked = likeIcon.classList.contains("liked");
    const currentCount = parseInt(likeCount.innerText, 10);
    likeCount.innerText = isLiked ? currentCount + 1 : currentCount - 1;
    likeIcon.style.color = isLiked ? "red" : ""; // Toggle red color

    // Save to LocalStorage
    saveDataToLocalStorage(meal.idMeal, "likes", parseInt(likeCount.innerText));
  });

  // Rating Button
  const rateStar = card.querySelector(".rate-star");
  const ratingValue = card.querySelector(".rating-value");
  rateStar.addEventListener("click", () => {
    const userRating = parseFloat(prompt("Enter your rating (1-5):"));
    if (userRating >= 1 && userRating <= 5) {
      const currentRating = parseFloat(ratingValue.innerText);
      const newRating = (currentRating + userRating) / 2;
      ratingValue.innerText = newRating.toFixed(1);

      // Save to LocalStorage
      saveDataToLocalStorage(meal.idMeal, "rating", newRating.toFixed(1));
    } else {
      alert("Please enter a valid rating between 1 and 5.");
    }
  });

  // Comment Popup
  const commentIcon = card.querySelector(".comment-icon");
  commentIcon.addEventListener("click", () => openCommentPopup(meal.idMeal));
};

// LocalStorage Utilities
const saveDataToLocalStorages = (mealId, key, value) => {
  const data = JSON.parse(localStorage.getItem(mealId)) || {};
  data[key] = value;
  localStorage.setItem(mealId, JSON.stringify(data));
};

const getDataFromLocalStorages = (mealId, key) => {
  const data = JSON.parse(localStorage.getItem(mealId)) || {};
  return data[key];
};

// .....................................................................

// // Function To get  Recommended Recipes

const recipeContainer = document.querySelector(".recipe-cards");
const recipeDetailsContent = document.querySelector(".recipe-details-content");

const fetchRecipes = async (query) => {
  try {
    // Clear any existing recipe cards and show a loading message
    recipeContainer.innerHTML = "<h2>Loading Recipes...</h2>";

    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const data = await response.json();

    // Handle the case where no recipes are found
    if (!data.meals || data.meals.length === 0) {
      recipeContainer.innerHTML = "<p>No recipes found for this query.</p>";
      return;
    }

    // Clear the loading message
    recipeContainer.innerHTML = "";

    // Iterate through each meal and create recipe cards
    data.meals.forEach((meal) => {
      const recipeDiv = document.createElement("div");
      recipeDiv.classList.add("recipe-card");

      // Add the recipe image
      recipeDiv.innerHTML = `
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      `;

      // Create the card content
      const cardContent = document.createElement("div");
      cardContent.classList.add("card-content");
      cardContent.innerHTML = `
        <p>${meal.strArea} Dish</p>
        <h2>${meal.strMeal}  
          <span>
            <i class="fa-solid fa-star rate-star" data-rating="0" style="color: #ffd43b; cursor: pointer;"></i>
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
        <div class="comments"></div>
      `;

      // Create and append the "View Recipe" button
      const button = document.createElement("button");
      button.textContent = "View Recipe";
      button.addEventListener("click", () => openRecipePopup(meal));
      cardContent.appendChild(button);

      // Append the card content to the recipe div
      recipeDiv.appendChild(cardContent);

      // Add functionality for likes, comments, and ratings
      bindCardFunctionality(recipeDiv, meal);

      // Append the recipe card to the container
      recipeContainer.appendChild(recipeDiv);
    });
  } catch (error) {
    console.error("Error fetching recipes:", error);
    recipeContainer.innerHTML = "<p class = 'error' >Failed to load recipes. Please try again later.</p>";
  }
};
const bindsCardFunctionality = (card, meal) => {
  // Like button functionality
  const likeIcon = card.querySelector('.like-icon');
  const likeCount = card.querySelector('.like-count');
  likeIcon.addEventListener('click', () => {
    likeIcon.classList.toggle('liked');
    const isLiked = likeIcon.classList.contains('liked');
    const currentCount = parseInt(likeCount.innerText, 10);
    likeCount.innerText = isLiked ? currentCount + 1 : currentCount - 1;
    likeIcon.style.color = isLiked ? 'red' : ''; // Toggle red color

    // Save to LocalStorage
    saveDataToLocalStorage(meal.idMeal, 'likes', parseInt(likeCount.innerText));
  });

  // Rating functionality
  const rateStar = card.querySelector('.rate-star');
  const ratingValue = card.querySelector('.rating-value');
  rateStar.addEventListener('click', () => {
    const userRating = parseFloat(prompt('Enter your rating (1-5):'));
    if (userRating >= 1 && userRating <= 5) {
      const currentRating = parseFloat(ratingValue.innerText);
      const newRating = (currentRating + userRating) / 2; // Update to calculate average
      ratingValue.innerText = newRating.toFixed(1);

      // Save to LocalStorage
      saveDataToLocalStorage(meal.idMeal, 'rating', newRating.toFixed(1));
    } else {
      alert('Please enter a valid rating between 1 and 5.');
    }
  });

  // Comment popup functionality
  const commentIcon = card.querySelector('.comment-icon');
  commentIcon.addEventListener('click', () => {
    openCommentPopup(meal.idMeal);
  });
};

// ............................................................

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
			fetchIngredients(meal) || '<li class= "error">No Ingredients Available</li>'
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
  console.log(fetchResultantRecipes);
});

// FetchRecipes on page load

fetchRecipes("cake");

// ...............................................................................

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
})

recipeCloseBtn.addEventListener("DOMContentLoaded", () => {
  menuCard.style.display = "none";
});

// .....................................................................

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
    loadMoreBtn.style.color = "red";
    loadMoreBtn.style.fontSize= "24px";
  } else {
    fetchPaginatedRecipes(newRecipes); // Assuming you have a renderRecipes function
  }
});

// ...............................................

const select = document.querySelector("#select");

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

// ..................................................

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
          <p>${meal.strArea || "Unknown"} Dish</p>
          <h2>
            ${meal.strMeal}
            <span>
              <i class="fa-solid fa-star rate-star" style="color: #ffd43b; cursor: pointer;"></i>
              <span class="rating-value">0.0</span>
            </span>
          </h2>
          <h3>
            ${category}
            <span>
              <i class="fa-regular fa-heart like-icon" style="cursor: pointer;"></i>
              <span class="like-count">0</span>
              <i class="fa-regular fa-comment comment-icon" style="cursor: pointer;" class = 'comment-icon'></i>
            </span>
          </h3>
          <div class="comments">
            <!-- User comments will be dynamically added here -->
          </div>
          <button class="view-recipe-btn">View Recipe</button>
        </div>
      `;

     resultCard.querySelector('.view-recipe-btn').addEventListener('click', () => {
      openRecipePopup(meal);
     });
      // Bind functionality to the card
      bindCardFunctionality(resultCard, meal);

      // Append the card to the container
      resultCards.appendChild(resultCard);
    });

  } catch (error) {
    console.error("Error fetching recipes:", error);
    resultCards.innerHTML = "<p>Failed to load recipes. Please try again later.</p>";
  }
};

const bindCardFunctionality = (card, meal) => {
  // Like button functionality
  const likeIcon = card.querySelector('.like-icon');
  const likeCount = card.querySelector('.like-count');
  likeIcon.addEventListener('click', () => {
    likeIcon.classList.toggle('liked');
    const isLiked = likeIcon.classList.contains('liked');
    const currentCount = parseInt(likeCount.innerText, 10);
    likeCount.innerText = isLiked ? currentCount + 1 : currentCount - 1;
    likeIcon.style.color = isLiked ? 'red' : ''; // Toggle red color

    // Save to LocalStorage
    saveDataToLocalStorage(meal.idMeal, 'likes', parseInt(likeCount.innerText));
  });

  // Rating functionality
  const rateStar = card.querySelector('.rate-star');
  const ratingValue = card.querySelector('.rating-value');
  rateStar.addEventListener('click', () => {
    const userRating = parseFloat(prompt('Enter your rating (1-5):'));
    if (userRating >= 1 && userRating <= 5) {
      const currentRating = parseFloat(ratingValue.innerText);
      const newRating = (currentRating + userRating) / 2; // Update to calculate average
      ratingValue.innerText = newRating.toFixed(1);

      // Save to LocalStorage
      saveDataToLocalStorage(meal.idMeal, 'rating', parseFloat(ratingValue.innerText));
    } else {
      alert('Please enter a valid rating between 1 and 5.');
    }
  });

  // Comment popup functionality
  const commentIcon = card.querySelector('.comment-icon');
  commentIcon.addEventListener('click', () => {
    openCommentPopup(meal.idMeal);
  });
};

const openCommentPopup = (mealId) => {
  const popup = document.getElementById('comment-popup');
  const commentForm = document.getElementById('comment-form');
  const commentsList = document.getElementById('comments-list');

  // Load existing comments for this meal
  const storedComments = getDataFromLocalStorage(mealId, 'comments') || [];
  commentsList.innerHTML = ""; // Clear any previous comments
  storedComments.forEach((comment) => {
    const commentItem = document.createElement('p');
    commentItem.innerText = `${comment.name}: ${comment.text}`;
    commentsList.appendChild(commentItem);
  });

  // Show popup
  popup.classList.remove('hidden');

  // Close popup
  document.getElementById('close-popup').addEventListener('click', () => {
    popup.classList.add('hidden');
  });

  // Handle new comment submission
  commentForm.onsubmit = (e) => {
    e.preventDefault();
    const userName = document.getElementById('user-name').value;
    const userComment = document.getElementById('user-comment').value;

    if (userName && userComment) {
      const newComment = { name: userName, text: userComment };
      storedComments.push(newComment);
      saveDataToLocalStorage(mealId, 'comments', storedComments);

      // Add the new comment to the list
      const commentItem = document.createElement('p');
      commentItem.innerText = `${newComment.name}: ${newComment.text}`;
      commentsList.appendChild(commentItem);

      // Clear form fields and reset
      commentForm.reset();
    }
  };
};


// Save to LocalStorage
const saveDataToLocalStorage = (mealId, key, value) => {
  const data = JSON.parse(localStorage.getItem(mealId)) || {};
  data[key] = value;
  localStorage.setItem(mealId, JSON.stringify(data));
};

// Get from LocalStorage
const getDataFromLocalStorage = (mealId, key) => {
  const data = JSON.parse(localStorage.getItem(mealId)) || {};
  return data[key];
};


// Add change event listener to select dropdown

select.addEventListener("change", (e) => {
  const selectedCategory = e.target.value;
  if (selectedCategory) {
    fetchAndDisplayRecipesByCategory(selectedCategory);
  } else {
    resultCards.innerHTML = "<p>Please select a category to view recipes.</p>";
  }
  console.log(fetchAndDisplayRecipesByCategory);
  
});

// ......................................................................


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


// === DOM Elements ===

// Share Recipe Form Elements
const shareRecipeBtn = document.querySelector(".button-share-recipe");
const shareRecipeContainer = document.querySelector(".share-recipe-container");
const closeShareRecipeBtn = document.querySelector(".close-share-recipe");
const recipeForm = document.querySelector("#recipeForm");
const recipesContainer = document.querySelector("#mealPlan");

// Input Elements and Error Messages
const recipeName = document.querySelector("#recipeName");
const ingredients = document.querySelector("#ingredients");
const instructions = document.querySelector("#instructions");
const recipeNameError = document.querySelector(".recipe-name-error");
const ingredientsError = document.querySelector(".ingredients-error");
const instructionsError = document.querySelector(".instructions-error");

// Custom Meal Plan Elements
const customMealPlanBtn = document.querySelector(".button-custom-meal");
const customMealPlanContainer = document.querySelector(".custom-meal-container");
const closeMealPlanBtn = document.querySelector(".custom-meal-container-close-btn");
const dietSelect = document.querySelector("#diet");
const generateBtn = document.querySelector(".generate-plane");
const breakfastSpan = document.querySelector("#breakfast");
const lunchSpan = document.querySelector("#lunch");
const dinnerSpan = document.querySelector("#dinner");

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

// === Event Listeners ===

// 1. Open and Close "Share Recipe" Form
shareRecipeBtn.addEventListener("click", () => {
  shareRecipeContainer.style.display = "block";
});

closeShareRecipeBtn.addEventListener("click", () => {
  shareRecipeContainer.style.display = "none";
});

// 2. Real-Time Validation for "Share Recipe" Form Inputs
function addInputListeners() {
  recipeName.addEventListener("input", () => {
    if (recipeName.value.trim().length >= 3) recipeNameError.textContent = "";
  });

  ingredients.addEventListener("input", () => {
    if (ingredients.value.trim().length >= 10) ingredientsError.textContent = "";
  });

  instructions.addEventListener("input", () => {
    if (instructions.value.trim().length >= 10) instructionsError.textContent = "";
  });
}
addInputListeners();

// 3. Validate "Share Recipe" Form
function errorMessage() {
  let hasError = false;

  if (instructions.value.trim() === "") {
    instructionsError.textContent = "This field is required";
    instructionsError.style.color = "red";
    hasError = true;
  } else if (instructions.value.trim().length < 10) {
    instructionsError.textContent = "Instructions should be at least 10 characters long";
    instructionsError.style.color = "red";
    hasError = true;
  } else {
    instructionsError.textContent = "";
  }

  if (ingredients.value.trim() === "") {
    ingredientsError.textContent = "This field is required";
    ingredientsError.style.color = "red";
    hasError = true;
  } else if (ingredients.value.trim().length < 10) {
    ingredientsError.textContent = "Ingredients should be at least 10 characters long";
    ingredientsError.style.color = "red";
    hasError = true;
  } else {
    ingredientsError.textContent = "";
  }

  if (recipeName.value.trim() === "") {
    recipeNameError.textContent = "This field is required";
    recipeNameError.style.color = "red";
    hasError = true;
  } else if (recipeName.value.trim().length < 3) {
    recipeNameError.textContent = "Recipe Name should be at least 3 characters long";
    recipeNameError.style.color = "red";
    hasError = true;
  } else {
    recipeNameError.textContent = "";
  }

  return hasError;
}

// 4. Handle "Share Recipe" Submission

recipeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const hasError = errorMessage();

  if (!hasError) {
    const newRecipe = {
      name: recipeName.value.trim(),
      ingredients: ingredients.value.split(",").map((item) => item.trim()),
      instructions: instructions.value.trim()
    };

    recipesContainer.innerHTML += `
      <div class="shared-recipe">
        <h3>${newRecipe.name}</h3>
        <p><strong>Ingredients:</strong> ${newRecipe.ingredients.join(", ")}</p>
        <p><strong>Instructions:</strong> ${newRecipe.instructions}</p>
      </div>
    `;

    saveRecipeToLocalStorage(newRecipe);
    recipeForm.reset();
    alert("Recipe shared successfully!");
  }
});

// 5. Save Recipe to Local Storage
function saveRecipeToLocalStorage(recipe) {
  const existingRecipes = JSON.parse(localStorage.getItem("recipes")) || [];
  existingRecipes.push(recipe);
  localStorage.setItem("recipes", JSON.stringify(existingRecipes));
}

// 6. Open and Close "Custom Meal Plan" Section
customMealPlanBtn.addEventListener("click", () => {
  customMealPlanContainer.style.display = "block";
});

closeMealPlanBtn.addEventListener("click", () => {
  customMealPlanContainer.style.display = "none";
});

// 7. Handle Custom Meal Plan Generation
dietSelect.addEventListener("change", () => {
  const selectedMeals = meals[dietSelect.value];
  if (selectedMeals) {
    breakfastSpan.textContent = selectedMeals.breakfast || "N/A";
    lunchSpan.textContent = selectedMeals.lunch || "N/A";
    dinnerSpan.textContent = selectedMeals.dinner || "N/A";
  }
});

generateBtn.addEventListener("click", () => {
  const selectedMeals = meals[dietSelect.value];
  if (selectedMeals) {
    breakfastSpan.textContent = selectedMeals.breakfast || "N/A";
    lunchSpan.textContent = selectedMeals.lunch || "N/A";
    dinnerSpan.textContent = selectedMeals.dinner || "N/A";
  } else {
    alert("Invalid category selected. Please try again.");
  }
});




// ........................................................

const addItemBtn = document.getElementById('add-item-btn');
const groceryList = document.getElementById('grocery-list');

addItemBtn.addEventListener('click', () => {
  const item = prompt('Enter a grocery item:');
  if (item) {
    const listItem = document.createElement('li');
    listItem.textContent = `${item}`;
    listItem.classList.add("list-items")


    const removeBtn = document.createElement('button');
    removeBtn.innerHTML = `
            <i class="fas fa-times"></i>
    `;
    removeBtn.classList.add('remove-btn');
    removeBtn.addEventListener('click', () => listItem.remove());

    listItem.appendChild(removeBtn);
    groceryList.appendChild(listItem);
  }
});



document.querySelector('.button-grocery-list').addEventListener('click', (e) => {
  e.preventDefault();
document.querySelector('.grocery-list-container').style.display = 'block'

})

document.querySelector('.grocery-list-close-btn').addEventListener('click', () => {
document.querySelector('.grocery-list-container').style.display = 'none'

})


// .........................................................................

// Cooking Tips

const tips = {
  "General Cooking Tips": [
    "Rescue Over-Salted Soups: Add a peeled raw potato to absorb excess salt.",
    "Perfect Boiled Eggs: Add a teaspoon of vinegar to prevent eggshells from cracking while boiling.",
    "Crispy Fried Foods: Use cold batter for extra crunch.",
    "Enhance Spices: Toast whole spices before grinding to unlock their full flavor.",
    "Keep Lettuce Crisp: Wrap it in paper towels before storing to absorb moisture.",
    "Ripen Bananas Quickly: Place them in a brown paper bag with an apple or a ripe banana.",
    "Peeling Garlic Quickly: Crush the clove with the flat side of a knife and the peel will slide off easily."
  ],
  "Baking Tips": [
    "Room Temperature Ingredients: For fluffier cakes, ensure butter, eggs, and milk are at room temperature before mixing.",
    "Prevent Cake Sticking: Dust your greased baking pan with flour or cocoa powder for a non-stick finish.",
    "Soft Brown Sugar: Place a slice of bread or a marshmallow in your brown sugar container to keep it soft.",
    "Measure Flour Properly: Spoon flour into the measuring cup and level it off with a knife for accuracy."
  ],
  "Food Storage Tips": [
    "Freeze Fresh Herbs: Chop herbs, place them in ice cube trays, and fill with olive oil or water for quick cooking portions.",
    "Revive Wilted Greens: Soak them in ice water for 30 minutes to bring back their crispness.",
    "Cheese Storage: Wrap hard cheeses in parchment paper instead of plastic to allow them to breathe and avoid mold.",
    "Bananas in the Fridge: Separate them from the bunch to slow down ripening."
  ],
  "Time-Saving Tips": [
    "Prep Ingredients Ahead: Chop vegetables and portion spices in advance to save time during cooking.",
    "Faster Marinades: Poke small holes in meat or place it in a vacuum-sealed bag for quicker absorption.",
    "Freeze Leftovers in Portions: Use small containers for easy reheating later."
  ],
  "Healthy Cooking Tips": [
    "Reduce Oil in Soups: Skim the fat with a paper towel or refrigerate and remove the solidified fat layer.",
    "Bake Instead of Fry: For a healthier twist, bake items like chicken or fries instead of deep frying.",
    "Use Yogurt Instead of Cream: Swap heavy cream with Greek yogurt for a healthier, tangy alternative."
  ],
  "Special Tricks": [
    "Keep Rice from Sticking: Add a few drops of oil or a squeeze of lemon juice to the boiling water.",
    "Juice Lemons Easily: Microwave them for 15 seconds to extract more juice.",
    "Chop Onions Tear-Free: Chill them in the freezer for 10 minutes before cutting.",
    "Non-Sticky Pasta: Stir pasta frequently and avoid adding oil to the water."
  ]
};

const tipsBtn = document.querySelector('.button-cooking-tips');
const tipCard = document.querySelector('#tip-card');
const tipText = document.querySelector('#tip-text');
const tipcontainer = document.querySelector('.cooking-tips-container');
const tipButton = document.querySelector('.button-cooking-tips');

// Show a random tip when the button is clicked
tipsBtn.addEventListener('click', () => {
  const categories = Object.keys(tips); // Get all categories
  const randomCategory = categories[Math.floor(Math.random() * categories.length)]; // Random category
  const categoryTips = tips[randomCategory]; // Tips under the selected category
  const randomTip = categoryTips[Math.floor(Math.random() * categoryTips.length)]; // Random tip
  tipText.innerHTML = `<strong>${randomCategory}</strong>: ${randomTip}`; // Add heading and tip

  // Slide in the tip card
  tipCard.classList.remove('hidden');
  setTimeout(() => {
    tipCard.classList.add('active');
  }, 100);
});
 console.log(tipsBtn)

tipButton.addEventListener('click', () => {
  tipcontainer.style.display = 'block'
})
document.querySelector('.cooking-tips-close-btn').addEventListener('click', () => {
  tipcontainer.style.display = 'none'

})

// ............................................................................

// === DOM Elements ===
const emailInput = document.querySelector(".email-subscribe input");
const subscribeBtn = document.querySelector(".email-subscribe button");

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
  const storedEmails = JSON.parse(localStorage.getItem("subscribedEmails")) || [];
  if (!storedEmails.includes(email)) {
    storedEmails.push(email);
    localStorage.setItem("subscribedEmails", JSON.stringify(storedEmails));
  }
}

// **********************************************************

// === Event Listener ===

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
    emailError.style.fontSize = "16px";

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

function toggleMenu() {
  const menu = document.querySelector('.mobile-menu');
  if (menu.style.display === 'flex') {
    menu.style.display = 'none';
  } else {
    menu.style.display = 'flex';
  }
}



function toggleMenu() {
  const menu = document.querySelector('.mobile-menu');
  menu.classList.toggle('active');
}



























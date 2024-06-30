import { displayRecipes, showRecipeDetails,openDatabase,getObjectStore,displayReviews} from "./index.js";
export { updateSavedRecipesUI,getActiveSession,getSavedRecipes};
let savedRecipesList;

function initDB() {
  let request = indexedDB.open("UserDatabase", 2);

  request.onupgradeneeded = function (event) {
    let db = event.target.result;

    if (!db.objectStoreNames.contains("Users")) {
      db.createObjectStore("Users", { keyPath: "email" });
    }

    if (!db.objectStoreNames.contains("Recipes")) {
      const recipeStore = db.createObjectStore("Recipes", {
        keyPath: "id",
        autoIncrement: true,
      });
      recipeStore.createIndex("email", "email", { unique: false });
    }

    if (!db.objectStoreNames.contains("Sessions")) {
      db.createObjectStore("Sessions", { keyPath: "id", autoIncrement: true });
    }
  };

  request.onsuccess = function (event) {
    console.log("Database initialized");
  };

  request.onerror = function (event) {
    console.error("Database error:", event.target.error);
  };
}

initDB();

document.addEventListener("DOMContentLoaded", function () {
  console.log("entered saved");
  savedRecipesList = document.getElementById("saved-recipes");
  const recipeDetail = document.getElementById("recipe-detail");
  const closeDetailButton = document.getElementById("close-detail");
  closeDetailButton.addEventListener("click", () => {
    recipeDetail.classList.remove("open");
  });

  getActiveSession().then((email) => {
    if (email) {
      console.log("displaying saved recipes")
      displaySavedRecipes(email);
    } else {
      window.location.href = "login.html";
    }
  });
});

  function getActiveSession() {
    return new Promise((resolve, reject) => {
      let request = indexedDB.open("UserDatabase", 2);

      request.onsuccess = function (event) {
        let db = event.target.result;
        let transaction = db.transaction(["Sessions"], "readonly");
        let objectStore = transaction.objectStore("Sessions");

        let getRequest = objectStore.getAll();

        getRequest.onsuccess = function (event) {
          resolve(event.target.result[0]?.email || null);
        };

        getRequest.onerror = function (event) {
          reject(event.target.error);
        };
      };

      request.onerror = function (event) {
        reject(event.target.error);
      };
    });
  }

function getSavedRecipes(email) {
  return new Promise((resolve, reject) => {
    openDatabase()
      .then((db) => {
        const store = getObjectStore(db, "Users", "readonly");
        const request = store.get(email);

        request.onsuccess = function (event) {
          const user = event.target.result;
          if (user && user.savedRecipes) {
            resolve(user.savedRecipes);
          } else {
            resolve([]);
          }
        };

        request.onerror = function (event) {
          reject(event.target.error);
        };
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function displaySavedRecipes(email) {
  console.log("entered saved3");
  getSavedRecipes(email)
    .then((savedRecipes) => {
      displayRecipes(savedRecipes, savedRecipesList);
    })
    .catch((error) => {
      console.error("Error retrieving saved recipes:", error);
    });
}

function updateSavedRecipesUI() {
  getActiveSession()
    .then((email) => {
      openDatabase()
        .then((db) => {
          const store = getObjectStore(db, "Users", "readonly");
          const request = store.get(email);

          request.onsuccess = function (event) {
            const user = event.target.result;
            if (user && user.savedRecipes) {
              const savedRecipes = user.savedRecipes;
              console.log("Saved recipes:", savedRecipes);
              const savedRecipesList = document.getElementById("saved-recipes");
              savedRecipesList.innerHTML = "";

              if (savedRecipes.length === 0) {
                savedRecipesList.innerHTML = "<p>No saved recipes.</p>";
                return;
              } 

              savedRecipes.forEach((recipe) => {
                const recipeDiv = document.createElement("div");
                recipeDiv.classList.add("saved-recipe");

                const img = document.createElement("img");
                img.src = recipe.image; 
                img.alt = recipe.name;

                const name = document.createElement("span");
                name.textContent = recipe.name;

                const removeButton = document.createElement("button");
                removeButton.textContent = "Remove";
                removeButton.classList.add("remove-button");
                removeButton.addEventListener("click", () => {
                  removeRecipe(recipe.id);
                });
              
                recipeDiv.appendChild(img);
                recipeDiv.appendChild(name);
                
               
                savedRecipesList.appendChild(recipeDiv);

                recipeDiv.addEventListener("click", () => {
                  showRecipeDetails(recipe);
                  recipeContent.appendChild(removeButton);
                });
              });
            } else {
              const savedRecipesList = document.getElementById("saved-recipes");
              savedRecipesList.innerHTML = "<p>No saved recipes.</p>";
            }
          };

          request.onerror = function (event) {
            console.error("Error fetching saved recipes:", event.target.error);
          };
        })
        .catch((error) => {
          console.error("Error opening database:", error);
        });
    })
    .catch((error) => {
      console.error("Error retrieving active session:", error);
    });
}

function removeRecipe(id) {
  openDatabase().then((db) => {
    const transaction = db.transaction(["Users"], "readwrite");
    const objectStore = transaction.objectStore("Users");

    const deleteRequest = objectStore.delete(id);

    deleteRequest.onsuccess = function (event) {
      console.log("Recipe removed successfully");
    };

    deleteRequest.onerror = function (event) {
      console.error("Error removing recipe:", event.target.error);
    };
  }).catch((error) => {
    console.error("Database error:", error);
  });
}


export { displayRecipes, saveRecipe, showRecipeDetails,openDatabase,getObjectStore ,displayReviews,removeRecipe};
import { updateSavedRecipesUI ,getActiveSession} from "./savedrecipes.js";  
const ingredientGallery = document.getElementById("ingredient-gallery");
const recipeListDiv = document.getElementById("recipe-list");
const submitButton = document.getElementById("submit-button");
const container = document.querySelector(".container");
const recipeDetail = document.getElementById("recipe-detail");
const recipeContent = document.getElementById("recipe-content");
const closeDetailButton = document.getElementById("close-detail");
const newRecipeForm = document.getElementById("new-recipe-form");
const userIcon = document.getElementById("user-icon");
const logoutButton = document.getElementById("logout-button");
const ratingStars = document.querySelectorAll(".star");
const submitReviewButton = document.getElementById("submit-review");
const reviewText = document.getElementById("review-text");
const reviewsList = document.getElementById("reviews-list");
let selectedIngredients,savedRecipes,selectedRating,currentrecipe;

 const togglePlaylistButton = document.getElementById("toggle-playlist");
 const menu = document.querySelector(".menu");

 togglePlaylistButton.addEventListener("click", function () {
   menu.classList.toggle("opening");
   menu.classList.toggle("closed");
 });

  let request = indexedDB.open("UserDatabase", 2);

  request.onsuccess = function (event) {
    let db = event.target.result;
    let transaction = db.transaction(["Sessions"], "readonly");
    let objectStore = transaction.objectStore("Sessions");

    let getRequest = objectStore.getAll();

    getRequest.onsuccess = function (event) {
      if (event.target.result.length === 0) {
        // No active session, redirect to login page
        window.location.href = "login.html";
      }
    };

    getRequest.onerror = function (event) {
      console.error("Error retrieving session:", event.target.error);
      window.location.href = "login.html"; // Redirect in case of error
    };
  };

  request.onerror = function (event) {
    console.error("Database error:", event.target.error);
    window.location.href = "login.html"; // Redirect in case of error
  };

const ingredient_categories = {
  Fruits: [
    "Apple",
    "Banana",
    "Orange",
    "Mango",
    "Pineapple",
    "Grape",
    "Strawberry",
    "Blueberry",
    "Watermelon",
    "Peach",
  ],
  Vegetables: [
    "Tomato",
    "Carrot",
    "Potato",
    "Onion",
    "Broccoli",
    "Spinach",
    "Cabbage",
    "Cucumber",
    "Beetroot",
    "Cauliflower",
  ],
  NutsSeeds: [
    "Walnut",
    "Almond",
    "Peanut",
    "Pine nut",
    "Cashew",
    "Pecans",
    "Hazelnuts",
    "Flax",
    
  ],
};

let recipesarray = [
  {
    name: "Orange Pineapple Banana Smoothie",
    ingredients: ["orange", "pineapple", "banana"],
    image: "media/banana_pineapple_smoothie.jpg",
    procedure:
      "1. Add all of the ingredients to the blender...\n2. Blitz into a smooth consistency...\n3. Serve accordingly.",
    course: "Drink, Smoothie",
    cuisine: "American",
    prepTime: "5 minutes",
    totalTime: "5 minutes",
    servings: "1 serving",
    calories: "176 kcal",
    diet: "low carb",
  },
  {
    name: "Instant Pot Applesauce (No Added Sugar)",
    ingredients: ["organic apples", "water"],
    image: "media/pot.jpg",
    procedure: `
      1. Peel the apples to your liking. I leave the peels on, but I generally blend my sauce to a smooth consistency.
      2. Slice or cut the apples into pieces. I'm usually making this fast, so I just crudely chop the apples, and it always works well.
      3. Add the apples and water to the Instant Pot. I add about 3/4-1 cup of water. If you like a really thick sauce, just add 1/2 cup.
      4. Set the Instant Pot to high pressure for ten minutes.
      5. Quickly release the remaining pressure.
      6. Mash or blend the cooked apples to your liking.
      7. Allow the applesauce to cool and store it in an airtight container in the fridge (I use a large mason jar).
      8. Use as desired!
    `,
    prepTime: "5 minutes",
    cookTime: "10 minutes",
    totalTime: "15 minutes",
    servings: "8 servings",
    cuisine: "American",
  },
  {
    name: "Mango Agua Fresca",
    ingredients: ["mango", "sugar", "water", "ice cubes"],
    image: "media/mango_agua.jpg",
    procedure: `
      1. Place the peeled & chopped mangos, sugar, and water in your blender. Process until you have a fine and smooth texture.
      2. Pour into a large pitcher and add the ice cubes. Adjust sweetness if needed.
    `,
    prepTime: "10 minutes",
    totalTime: "10 minutes",
    servings: "10 cups",
    calories: "58 kcal",
    author: "Mely Martínez",
    course: "Drinks",
    cuisine: "Mexican",
    keywords: "mango agua fresca, mango drink, mango fruit drink",
  },
  {
    name: "Frozen Fruit Dessert",
    image: "media/Frozen-Banana.jpg",
    ingredients: [
      "frozen banana",
      "frozen sliced strawberries",
      "frozen diced pineapple",
      "Creme de Banane liqueur",
    ],
    course: "Dessert",
    cuisine: "American",
    prepTime: "5 minutes",
    totalTime: "5 minutes",
    servings: "2 servings",
    procedure: `
      Lightly mix ingredients leaving still a lot of the three ingredients separate.
      Place in a serving glass and top with Creme de Banane liqueur if desired. Serve immediately.
    `,
  },

  {
    name: "Apple and Mango Lassi",
    image: "media/app_mango_lassi.jpg",
    ingredients: ["green apple", "large mango", "natural yogurt"],
    prepTime: "15 minutes",
    totalTime: "15 minutes",
    servings: "4 servings",
    course: "Drink",
    cuisine: "Indian",
    procedure: `
      1. Cut four thin slices of the apple peel and set aside to garnish. Peel, core and roughly chop the remaining apple.
      2. Cut four thin slices from the mango and set aside to garnish. Roughly chop the remaining mango.
      3. Blend the chopped apple and mango with the yogurt and pour into glasses.
      4. Garnish with the reserved apple peel and mango slices.
    `,
  },

  {
    name: "Blueberry Popsicles",
    image: "media/blueberry_popsicle.jpg",
    ingredients: ["blueberries", "lemon juice", "sugar", "water"],
    prepTime: "10 minutes",
    cookTime: "5 minutes",
    totalTime: "15 minutes",
    servings: "4 servings",
    course: "Desserts",
    cuisine: "Indian",
    procedure: `
      1. First wash blueberries properly.
      2. In a blender, add blueberries and sugar. Process for about 2 minutes.
      3. Add two cups of water and lemon juice to the berries mix and process again.
      4. Pour blueberry juice into popsicle molds, cover, and refrigerate for about 4 hours.
      5. Take out from the refrigerator, unmold the popsicles, and serve chilled.
    `,
  },
  {
    name: "Cucumber and Onion Salad",
    image: "media/indian_cucumber_salad.jpg",
    ingredients: ["large cucumber", "small white onion", "salt", "lemon juice"],
    prepTime: "10 minutes",
    totalTime: "1 hour 5 minutes",
    servings: "4 servings",
    course: "Desserts",
    cuisine: "Indian",
    procedure: `
      1. Peel the cucumber and slice as thin as you can, peel and cut the onions as thin as you can. Add both to a serving dish.
      2. Sprinkle with salt and add the lemon juice - stir to combine.
      3. Cover and chill for 1 hour before serving.
    `,
  },

  {
    name: "Tomato Chips",
    image: "media/tomato_chips.jpeg",
    totalTime: "22 minutes",
    cuisine: "Indian",
    prepTime: "16 minutes",
    diet: "Vegan",
    cookTime: "6 minutes",
    ingredients: ["1 medium firm tomato sliced 1/16 inch thick", "salt"],
    procedure: [
      "Slice 1 medium firm tomato about 1/16 inch thick with a serrated knife; pat dry with paper towels (discard the end pieces).",
      "Sprinkle with salt and let sit 15 minutes, then blot the excess moisture with paper towels.",
      "Arrange in a single layer on a flat microwave-safe plate coated with cooking spray.",
      "Mist the slices with cooking spray, then microwave until they start drying out, about 6 minutes.",
      "Carefully flip; microwave until stiff and mostly dry, 30 seconds to 1 minute.",
      "Transfer the chips to a rack to cool.",
    ],
  },

  {
    name: "Maryland Caramel Tomatoes",
    cuisine: "American",
    image: "media/caramel_tomatoes.jpg",
    ingredients: [
      "8 large ripe but firm tomatoes, cored and peeled",
      "1 tbsp. salt",
      "1 tsp. white pepper",
      "1 cup packed light brown sugar",
      "4 tbsp. unsalted butter, cut into 1/4 inch pieces (1/2 stick)",
    ],
    prepTime: "30 minutes",
    procedure: [
      "Adjust oven rack to upper middle position and heat oven to 400.",
      "Arrange tomatoes in large ovenproof skillet, cored side up. Season tomatoes with salt and pepper, then sprinkle brown sugar over the top. Dot the tomatoes evenly with the butter. Bake til tomatoes are tender and lightly browned, about 1 hour, basting with juices every 15 minutes.",
      "Using potholders (the skillet handle will be hot), remove skillet from oven and transfer to stovetop. Cook tomatoes over medium high heat, basting every 5 minutes and adjusting the heat as needed to maintain a rapid simmer, til sauce is thick and syrupy, 25 to 30 minutes. Serve. Serves 8.",
      "To peel tomatoes, with a paring knife, score an X at each tomato's base. Simmer tomatoes in boiling water for 30 to 60 seconds. After cooling the tomatoes in ice water for 1 minute, use the knife to remove strips of loosened peel, starting at the X on each tomato’s base.",
    ],
    course: "Side Dish",
  },
  {
    name: "Tasty Asian Tomato Salad",
    image: "media/tomato_salad",
    prepTime: "6 minutes",
    serves: "4-6",
    cuisine: "Asian",
    ingredients: [
      "4 large tomatoes, sliced",
      "1/8 cup lemon juice",
      "1 tablespoon fresh mint, chopped",
      "3 spring onions, chopped small",
      "1/8 teaspoon chili powder",
      "salt, just a sprinkle",
    ],
    procedure: [
      "Mix lemon juice, chili, mint and onions together.",
      "Add the sliced tomato making sure that the slices are well covered with the marinade and sprinkle with salt.",
    ],
    course: "Salad",
  },
  {
    name: "Roasted Tomato Salsa",
    image: "media/tomatoes_salsa.jpg",
    cuisine: "Italian",
    prepTime: "5 minutes",
    cookTime: "15 minutes",
    servings: "1 ½ Cups",
    calories: "102 kcal",
    ingredients: [
      "2 medium-size tomatoes",
      "3 serrano peppers",
      "1 small clove garlic",
      "2 teaspoons vegetable oil",
      "Salt to taste",
    ],
    procedure: [
      "There are many ways of roasting your tomatoes and other ingredients. Here are a few alternatives for how to do it.",
      "On a Griddle Pan (Comal): Roast the tomatoes, garlic, and peppers on an ungreased griddle at medium-high heat. They will start showing brown spots. Turn them to get an even roasting.",
      "On a Grill: You can also char/roast the tomatoes directly over an open flame. Like on your gas or charcoal grill for a few minutes. The tomatoes should be soft and slightly charred when done.",
      "Oven/Broiler: Use a baking sheet pan with a lip, wrapping it with aluminum foil to help for the after cleaning. Drizzle your tomatoes, peppers, and garlic with oil. Sprinkle them with ½ teaspoon salt and pepper to season. Broil for about 10 to 15 minutes until soft and slightly charred.",
      "Blend your Salsa: If you prefer chunky salsa, use a Mexican Molcajete or a food processor. My molcajete is too small, as you can see, but it works just fine for me to prepare my traditional salsas with the authentic taste of México. But if you prefer a smooth texture for your salsa, use the blender. The tomatoes will be very juicy and soft from this roasted process, and you won’t need to add water to the blender.",
      "Fry and Serve your Salsa: Heat some extra oil in a skillet over medium heat and add the sauce. Cook for about 5 minutes. Season with salt if needed. Your sauce is ready!!",
    ],
    course: "Appetizer",
  },
  {
    name: "Tomato Mint Kachumber",
    image: "media/kachumber.jpg",
    serves: 4,
    prepTime: "15 minutes",
    cuisine: "Indian",
    ingredients: [
      "4 (760g) Tomato",
      "1 (150g) brown onion, sliced thinly",
      "1/4 cup shredded fresh mint leaves",
      "1/4 cup (60ml) lemon juice",
      "2 teaspoon sugar",
      "1 teaspoon salt",
    ],
    procedure: [
      "Peel and quarter tomatoes; discard seeds and cut tomato into thin slices. Place in bowl with onion and mint, mix well.",
      "Whisk juice, sugar and salt together, pour over tomato mixture; cover and refrigerate at least 30 minutes.",
    ],
    course: "Salad",
  },
  {
    name: "Onion Tomato Chutney!!",
    image: "media/tomato_chutney.jpeg",
    prepTime: "3 minutes",
    cookTime: "6 minutes",
    cuisine: "Indian",
    serves: "4 People",
    diet: "Veg",
    ingredients: [
      "3 Big Onions",
      "3 Tomatoes cut into small cubes",
      "2 Dry red chillies (adjust to taste)",
      "Small piece of ginger",
      "1 tbsp coconut oil",
      "1 tsp Kashmiri chilli powder",
      "Salt to taste",
    ],
    procedure: [
      "The ingredients used for the chutney.",
      "Take a kadhai put oil & when hot add the dry red chillies & then put chopped onions, saute well for a few minutes and add chopped ginger, fry well.",
      "Then add the chopped tomatoes and fry for a few minutes.",
      "Then turn off the gas & when cool put salt & kashmiri red chilli powder & grind it in a mixer.",
      "After grinding the chutney will look like this.",
      "Serve with Crispy Dosas.",
    ],
    course: "Condiment",
  },
  {
    name: "Tomato Passata Recipe",
    image: "media/tomato_passata.jpg",
    course: "Sauce",
    cuisine: "Italian",
    prepTime: "20 minutes",
    cookTime: "20 minutes",
    totalTime: "40 minutes",
    servings: 10,
    calories: "36 kcal",
    ingredients: [
      "2 Kg Tomatoes (~4 pounds) - very ripe red ones, such as San Marzano or cluster tomato",
    ],
    procedure: [
      "Check the tomatoes one by one, removing rotten, stained or bruised ones. Then wash them very well under running water. Finally put them in a bowl and start cutting them in half.",
      "With a knife, remove the seeds and all the internal part of the tomato, like to make small tomato boats. Now place the tomatoes in a rather large pot.",
      "Let them cook over low heat, covering the pan with a lid and stirring them from time to time, until they are smashed. Now take your tomato strainer machine and, with a ladle, begin to place the cooked tomatoes in the special slot.",
      "Turn on the tomato strainer and with the help of the stomper apply some pressure on the tomatoes, to make them go down and enter the machine. If the passata comes out too liquid, pass it through a fine mesh strainer, stirring with a tablespoon, until you get the consistency you want.",
    ],
  },
  {
    name: "Easy Balsamic Italian Beets",
    image: "media/balsamic_beets.jpg",
    ingredients: [
      "15 ounces sliced beets",
      "2 carrots",
      "1/4 cup Italian balsamic vinaigrette",
      "1/4 teaspoon pepper",
    ],
    cuisine: "Italian",
    prepTime: "10 minutes",
    procedure: [
      "Drain and julienne the beets.",
      "Peel and shred the carrots.",
      "In a bowl, combine the beets and carrots.",
      "Add the Italian balsamic vinaigrette and pepper.",
      "Toss gently to coat everything evenly.",
      "Chill in the refrigerator for 30 minutes before serving.",
    ],
    diet: "Veg",
    course: "Side Dish",
  },
  {
    name: "Dot's Ham, Cabbage, and Potatoes",
    image: "media/cabbage_ham.jpg",
    ingredients: [
      "1 pound smoked pork butt",
      "Water, as needed",
      "Salt and ground black pepper, to taste",
      "2 pounds red potatoes, peeled",
      "1 head cabbage, cored and quartered",
    ],
    cuisine: "Italian",
    prepTime: "10 minutes",
    procedure: [
      "Place smoked pork butt in a 6-quart pot with enough water to cover; season with salt and pepper.",
      "Bring to a boil over medium-high heat, then reduce heat to medium-low and simmer for 1 hour.",
      "Stir in potatoes and cabbage. Simmer until potatoes are tender, about 20 minutes.",
      "Remove pork from soup and cut into quarters; return pork to pot until ready to serve.",
      "Season with more salt and pepper, if needed.",
    ],
    diet: "Non-Veg",
    course: "Main Course",
  },
  {
    name: "Parsley Mashed Potatoes",
    image: "media/mashed_potatoes.jpg",
    ingredients: [
      "2 pounds Russet potatoes, scrubbed",
      "1 cup chopped fresh flat-leaf parsley leaves",
      "1 to 2 small garlic cloves, sliced",
      "3 teaspoons lemon zest",
      "¼ cup water, as needed",
      "⅓ cup olive oil",
      "4 teaspoons lemon juice",
      "Salt, to taste",
    ],
    cuisine: "Italian",
    prepTime: "20 minutes",
    procedure: [
      "Place the potatoes in a pot and cover with cold water. Bring to a boil, and continue to boil until tender when pierced with a fork. Drain and, once cool enough to handle, peel. The skins will rub off.",
      "Mash the potato with a masher to desired smoothness. Stir in the Parsley Gremolata.",
      "Taste for seasoning, then serve warm. If you are immunosuppressed, reheat the potatoes with the gremolata for a few minutes.",
    ],
    diet: "Veg",
    course: "Side Dish",
  },
  {
    name: "Cauliflower Mash",
    image: "media/cauliflower_mash.jpg",
    ingredients: [
      "1 large cauliflower",
      "3 tbsp unsalted butter",
      "1 tsp kosher salt",
      "2 cups water",
      "coriander, finely chopped",
    ],
    cuisine: "Indian",
    prepTime: "30 minutes",
    procedure: [
      "Finely chop the cauliflower. The smaller the pieces, the creamier the dish will be, and the faster the cauliflower will cook.",
      "Add the butter to a heated pan and add the chopped cauliflower to the pan after the butter melts.",
      "Cook the cauliflower for 5 minutes, stirring occasionally until the cauliflower lightens in color.",
      "Add the salt and water to the cauliflower and bring the mixture to a boil.",
      "Cover the pan and cook for about 10 minutes until the cauliflower turns tender.",
      "Drain the excess liquid while reserving some of it.",
      "Mash the mixture using an immersion blender or blend it into a puree using a food processor.",
      "Garnish with more butter and chopped coriander. Serve hot!",
    ],
    diet: "Veg",
    course: "Side Dish",
  },
  {
    name: "Cooked Spinach and Pine Nuts",
    image: "media/spinach_pine.jpg",
    ingredients: [
      "3 pounds spinach",
      "2 teaspoons olive oil",
      "2 tablespoons pine nuts, toasted",
      "1 teaspoon garlic, minced",
      "to taste freshly ground black pepper",
    ],
    cuisine: "Italian",
    prepTime: "10 minutes",
    procedure: [
      "Wash spinach, allowing water to cling to leaves.",
      "Heat oil in a skillet over medium-high heat.",
      "Cook spinach until it wilts in the skillet, about 3 minutes.",
      "Add pine nuts and garlic, and cook for 2 minutes.",
      "Season with freshly ground black pepper and serve.",
    ],
    diet: [
      "Dairy Free",
      "Gluten Free",
      "Grain Free",
      "Paleo",
      "Vegan",
      "Vegetarian",
    ],
    course: "Side Dish",
  },
  {
    name: "Italian Carrots",
    image: "media/italian_carrots.jpg",
    ingredients: [
      "4 cups carrots, cut in matchstick strips",
      "1 tablespoon butter",
      "1/2 teaspoon salt",
      "1 stalk celery, finely chopped",
      "1/2 cup water",
      "1 onion, grated",
      "1/4 teaspoon Worcestershire sauce",
    ],
    cuisine: "Italian",
    prepTime: "15 minutes",
    procedure: [
      "Combine all ingredients in a skillet or large saucepan and cover tightly.",
      "Cook for about 20 minutes, or until almost tender.",
      "Remove cover and continue cooking until water evaporates, watching carefully to prevent burning.",
    ],
    course: "Side Dish",
  },
  {
    name: "Italian Cucumber Sandwiches",
    image: "media/cucu_sandwich.jpg",
    ingredients: [
      "1 cup mayonnaise",
      "1 (.7 ounce) package dry Italian-style salad dressing mix",
      "1 (1 pound) loaf cocktail rye bread",
      "1 cucumber, peeled and thinly sliced",
    ],
    cuisine: "Italian",
    prepTime: "20 minutes",
    procedure: [
      "In a medium bowl, thoroughly mix mayonnaise and dry Italian-style salad dressing mix.",
      "Arrange the cocktail rye bread slices in a single layer on a serving platter.",
      "Place mayonnaise mixture in a pastry bag and squeeze an approximately 1 inch dollop of the mixture onto each cocktail rye bread slice.",
      "Top each cocktail rye bread slice with a cucumber slice.",
    ],
    course: "Appetizer",
  },
  {
    name: "Indian Cucumber Salad",
    image: "media/indian_cucumber_salad.jpg",
    ingredients: [
      "1 large cucumber",
      "1 small white onion",
      "1/4 teaspoon salt",
      "2 teaspoons lemon juice",
    ],
    cuisine: "Indian",
    prepTime: "1 hour 5 minutes",
    procedure: [
      "Peel the cucumber and slice it as thin as possible. Peel and cut the onion as thin as possible. Add both to a serving dish.",
      "Sprinkle with salt and add lemon juice. Stir to combine.",
      "Cover and chill for 1 hour before serving.",
    ],
    course: "Salad",
  },
  {
    name: "Quick & Easy Cucumber Raita",
    image: "media/cucumber_raita.jpg",
    ingredients: [
      "1 English cucumber, thinly sliced into half moon shapes",
      "1/2 teaspoon salt",
      "1 1/2 cups Greek yogurt (or 2 1/2 cups regular plain yogurt, drained in a cheesecloth over a bowl for about 1 hour or overnight)",
    ],
    cuisine: "Indian",
    prepTime: "16 minutes",
    procedure: [
      "Add the sliced cucumber to a bowl, sprinkle with salt, and toss until well combined. Set aside for about 10 minutes.",
      "Rinse the cucumber and drain well.",
      "Mix together cucumber and yogurt in a medium bowl until well combined.",
      "Serve chilled.",
    ],
    course: "Side Dish",
  },
  {
    name: "Spinach with Yogurt",
    image: "media/yoghurt_spinach.jpg",
    ingredients: [
      "2 cloves garlic, crushed",
      "1 stalk spinach",
      "3 tablespoons yogurt (curd)",
      "1/4 teaspoon black pepper",
      "Salt, as required",
    ],
    cuisine: "Indian",
    prepTime: "10 minutes",
    totalTime: "25 minutes",
    procedure: [
      "Wash the spinach leaves under water, pat dry, and chop the stems.",
      "In a pressure cooker, add water, spinach leaves, and crushed garlic.",
      "Close the cooker, bring to high pressure, and cook for 3-4 whistles.",
      "Release pressure, drain the water, and transfer spinach to a bowl.",
      "Season with salt and black pepper powder.",
      "Stir in yogurt (curd) and serve warm.",
    ],
    course: "Side Dish",
  },
  {
    name: "Curried Broccoli and Cauliflower Soup",
    image: "media/broccoli_cauliflower_soup.jpg",
    yields: "6 Servings",
    cuisine: "Indian",
    prepTime: "10 minutes",
    cookTime: "10 minutes",
    totalTime: "20 minutes",
    ingredients: [
      "1 head broccoli",
      "1/2 head cauliflower",
      "3 medium yellow potatoes",
      "3 cloves garlic",
      "2 tablespoons curry powder",
      "2 pinches salt and pepper",
      "4 cups water",
      "1 bulb onion",
    ],
    procedure: [
      "Get pot on stove with Olive oil on medium heat to warm up.",
      "Chop all vegetables.",
      "Put onion in pot, season with salt and pepper.",
      "Sauté on medium until soft.",
      "Add curry powder and a little water, stir to combine.",
      "Cook for 30 seconds.",
      "Add remaining other veg – stir to coat.",
      "Add remaining water, boil until veg cooked.",
      "Blend until smooth.",
      "Check seasoning, serve.",
    ],
    course: "Soup",
  },
  {
    name: "Crispy Roasted Potatoes",
    image: "media/roasted.jpg",
    category: ["Snacks", "Appetizers"],
    difficulty: "Easy",
    cuisine: "Indian",
    description:
      "Crispy roasted potatoes, a perfect snack for any occasion. Enjoy them with your favorite dip!",
    yields: "3 Servings",
    prepTime: "15 minutes",
    cookTime: "40 minutes",
    totalTime: "1h 5m",
    ingredients: [
      "6 large potatoes",
      "1 dash powdered black pepper",
      "2 leaves parsley",
      "Salt as required",
      "2 tablespoons virgin olive oil",
    ],
    procedure: [
      "Preheat the oven to 220°C and line a baking tray with a baking sheet.",
      "Boil potatoes until tender, then peel and cut into wedges or cubes.",
      "In a bowl, mix potatoes with salt, olive oil, and black pepper.",
      "Spread potatoes in a single layer on the baking sheet.",
      "Bake for 20 minutes, stir, then bake for another 20 minutes until golden.",
      "Garnish with parsley leaves and serve with your favorite dip.",
    ],
    course: "Appetizer",
  },
  {
    name: "Gujarati Cabbage Sambharo",
    image: "media/gujarati_cabbage.jpg",
    ingredients: [
      "2 cups cabbage, sliced into thin long pieces",
      "2 green chilies, sliced (seeds removed)",
      "1 tbsp oil",
      "1/2 tsp mustard seeds",
      "1/4 tsp fenugreek seeds (methi)",
      "1/2 tsp turmeric powder",
      "2 tsp salt, or to taste",
    ],
    cuisine: "Indian",
    prepTime: "10 minutes",
    totalTime: "15 minutes",
    procedure: [
      "Wash the cabbage and peel off the outer layer. Slice it into long thin slices.",
      "Slice the green chilies and remove the seeds. Cut them into medium pieces.",
      "Heat oil in a kadhai or pan. Add mustard seeds and fenugreek seeds. Let them crackle.",
      "Add sliced cabbage and green chilies.",
      "Add turmeric powder and salt. Mix well and sauté for 2 minutes on medium-high flame.",
      "Stir-fry until the cabbage becomes soft but retains a crunchy bite.",
      "Gujarati Cabbage Sambharo is ready. Serve it as a side dish with roti, sabji, and buttermilk.",
    ],
    course: "Side Dish",
  },

  {
    name: "Carrot Halwa",
    image: "media/carrot_halwa.jpg",
    ingredients: [
      "8 cups grated carrot",
      "4 tbsp ghee",
      "6 cups milk",
      "2 cups sugar",
      "Few almonds or cashew nuts",
      "Saffron or cardamom powder for flavoring",
    ],
    cuisine: "Indian",
    prepTime: "10 minutes",
    totalTime: "15 minutes",
    procedure: `
      1. Saute the grated carrots in ghee.
      2. Add milk and cook until very soft.
      3. Add sugar and simmer until sugar dissolves and mixture thickens.
      4. Add saffron or cardamom powder.
      5. Garnish with flaked almonds or cashew nuts.
      6. Serve hot or cold as desired.
    `,
    course: "Dessert",
  },
  {
    name: "Broccoli Pakora",
    image: "media/broccoli_pakora.jpg",
    ingredients: [
      "1 2/3 cups broccoli florets",
      "1/3 cup water",
      "1 pinch baking soda",
      "1 1/2 tbsp rice flour",
      "1/4 cup vegetable oil",
      "Salt as required",
      "1 1/2 tsp chili powder",
      "1 2/3 cups gram flour (besan)",
    ],
    cuisine: "Indian",
    prepTime: "10 minutes",
    totalTime: "30 minutes",
    procedure: `
      1. Wash broccoli and cut into florets. Set aside.
      2. In a bowl, mix gram flour, rice flour, chili powder, baking soda, and salt.
      3. Gradually add water to make a smooth batter.
      4. Heat oil in a kadhai or pan over medium heat.
      5. Dip broccoli florets into the batter, ensuring they are well coated.
      6. Deep fry in batches until golden and crispy.
      7. Remove and drain excess oil on paper towels.
      8. Serve hot with chutney or ketchup.
    `,
    course: "Appetizer",
  },
  {
    name: "Indian Salsa Stew",
    image: "media/salsa_stew.jpg",
    ingredients: [
      "1 lb bag frozen broccoli, cauliflower, and carrots, thawed",
      "2 cans (15 oz each) chickpeas, rinsed and drained",
      "1 tbsp curry powder",
      "1/4 cup mild salsa",
      "2 cups low-sodium vegetable broth",
    ],
    cuisine: "Indian",
    prepTime: "15 minutes",
    totalTime: "15 minutes",
    procedure: `
      1. Coat a saucepan with cooking spray and heat over medium heat.
      2. Sauté vegetables, chickpeas, and curry powder for 2 minutes.
      3. Add salsa, simmer for 5 minutes.
      4. Add broth and 2 cups water, simmer for another 5 minutes.
      5. Season to taste with salt and pepper.
      6. Serve hot with steamed rice.
    `,
    course: "Main Course",
  },
  {
    name: "Indian-style Broccoli Spinach Braise",
    image: "media/broccoli_spinach_braise.jpg",
    ingredients: [
      "1/2 cup olive oil",
      "3 tsp cumin seeds",
      "1 1/2 tsp crushed red pepper flakes",
      "2 lbs broccoli, washed, trimmed and cut into bite-size pieces",
      "1/2 lb spinach leaves, washed and drained",
      "1 cup water",
      "Kosher or sea salt",
      "Edible flowers (optional garnish)",
    ],
    cuisine: "Indian",
    totalTime: "45 minutes",
    procedure: `
      1. In a large heavy-bottomed pan or Dutch oven, heat olive oil over medium heat.
      2. Add cumin seeds and crushed red pepper flakes. Stir until fragrant.
      3. Add broccoli and spinach, cook for 1 to 2 minutes.
      4. Add water and bring to a simmer. Cover and cook over medium-low heat for 30 to 45 minutes, until tender.
      5. Mash with the back of a spoon or a potato masher.
      6. Add salt to taste.
      7. Transfer to a serving bowl, garnish with edible flowers if desired.
      8. Serve hot with chapatis or sliced crusty bread.
    `,
    course: "Side Dish",
  },
  {
    name: "Pink Sultan Mezze",
    image: "media/sultan_mezze.jpg",
    ingredients: [
      "400 gm beetroot",
      "2 cloves garlic",
      "500 gm yogurt (curd)",
      "Salt as required",
    ],
    cuisine: "Indian",
    prepTime: "5 minutes",
    totalTime: "25 minutes",
    procedure: `
      1. Rinse the beetroots and wrap them in foil. Roast in a preheated oven at 160°C for 20 minutes.
      2. Grate the roasted beetroots using the coarse side of a grater.
      3. Mix grated beetroots with yogurt in a bowl.
      4. Add crushed garlic and adjust salt to taste.
      5. Stir well and serve as a dip with grilled pita bread or kebabs.
    `,
    course: "Appetizer",
  },
  {
    name: "Beetroot Idli",
    image: "media/beetroot_idli.jpg",
    ingredients: [
      "1 cup idli batter",
      "1/4 cup grated beetroot",
      "Oil for greasing idli plates",
    ],
    cuisine: "Indian",
    prepTime: "5 minutes",
    totalTime: "10 minutes",
    procedure: `
      1. Mix grated beetroot with idli batter.
      2. Grease idli plates with oil.
      3. Spoon batter into moulds and steam for 5 minutes.
      4. Use a spoon to remove the idlies from the moulds.
      5. Serve hot.
    `,
    course: "Main Course",
  },
  {
    name: "Easy Oven Roasted Beets",
    image: "media/roasted_beets_american.jpg",
    ingredients: [
      "2 pounds beets",
      "2 tablespoons olive oil",
      "1/2 teaspoon salt",
      "1/4 teaspoon ground black pepper",
      "1/4 teaspoon fresh thyme",
    ],
    cuisine: "American",
    prepTime: "10 minutes",
    totalTime: "1 hr 30 minutes",
    procedure: `
      1. Preheat oven to 350 degrees Fahrenheit (175 degrees Celsius).
      2. Wash the beets well, leaving the tails and stems intact. Remove any soil residue.
      3. Wrap each beet loosely in aluminum foil and place on a baking sheet.
      4. Roast the beets in the preheated oven for 40 minutes.
      5. Remove from the oven and let the beets cool for 20 minutes.
      6. Working with one beet at a time, remove the aluminum foil and gently rub the skin under running water to remove it.
      7. Trim the tails and stems, then cut the beets into large bite-sized pieces and transfer to a bowl.
      8. Add olive oil, salt, pepper, and fresh thyme. Toss to coat evenly.
      9. Transfer the coated beets back to the baking sheet and roast at 350 degrees Fahrenheit (175 degrees Celsius) for an additional 20 minutes.
      10. Serve immediately as a delightful side dish.
    `,
    course: "Side Dish",
  },
  {
    name: "Beet Hummus and Chickpea Crostini",
    image: "media/beet_hummus.jpg",
    ingredients: [
      "15 1/2 oz. chickpeas",
      "1 beet, cooked",
      "1/4 cup olive oil",
      "3 tablespoons mint",
      "2 garlic cloves",
      "1 tablespoon lemon juice",
      "3/4 teaspoon ground cumin",
      "Kosher salt",
      "16 baguette slices, toasted",
    ],
    cuisine: "American",
    prepTime: "10 minutes",
    totalTime: "10 minutes",
    procedure: `
      1. In a food processor, combine chickpeas, cooked beet, olive oil, mint, garlic cloves, lemon juice, ground cumin, and salt.
      2. Process until smooth and well blended.
      3. Spread the beet hummus on toasted baguette slices.
      4. Top each crostini with crunchy chickpeas and additional mint leaves.
      5. Serve immediately as a delicious Thanksgiving side or appetizer.
    `,
    course: "Appetizer",
  },
  {
    name: "Tomato Bacon Pie",
    image: "media/american_tomato_bacon_pie.jpg",
    ingredients: [
      "1 unbaked deep-dish pastry shell (9 inches)",
      "3 medium tomatoes, cut into 1/4-inch slices",
      "10 bacon strips, cooked and crumbled",
      "1 cup shredded cheddar cheese",
      "1 cup mayonnaise",
    ],
    cuisine: "American",
    prepTime: "15 minutes",
    totalTime: "45 minutes",
    procedure: `
      1. In a large bowl, combine mayonnaise and cheese.
      2. Add tomatoes and bacon, stirring gently.
      3. Transfer to pastry shell.
      4. Bake at 350°F (175°C) for 30-35 minutes or until crust is golden brown.
      5. Let stand for 10 minutes before cutting.
      6. Serve warm or at room temperature.
    `,
    course: "Main Course",
  },
  {
    name: "American Macaroni Salad",
    image: "media/american_macaroni_salad.jpg",
    ingredients: [
      "2 cups uncooked elbow macaroni",
      "3 hard-cooked eggs, chopped",
      "1 small onion, chopped",
      "3/4 cup chopped celery",
      "1/4 cup chopped green pepper",
      "2 tablespoons chopped pimentos, drained",
      "1 cup mayonnaise",
      "2 tablespoons cider vinegar",
      "1 teaspoon sugar",
      "1/2 teaspoon salt",
      "1/4 teaspoon pepper",
      "1/4 teaspoon garlic powder",
    ],
    cuisine: "American",
    prepTime: "20 minutes",
    totalTime: "20 minutes",
    procedure: `
      1. Cook macaroni according to package directions; drain and rinse with cold water.
      2. In a large bowl, combine the macaroni, eggs, onion, celery, green pepper, and pimentos.
      3. In a small bowl, mix the mayonnaise, vinegar, sugar, salt, pepper, and garlic powder.
      4. Pour over macaroni mixture and toss to coat.
      5. Cover and refrigerate for at least 2 hours.
      6. Serve chilled.
    `,
    course: "Side Dish",
  },{
    name: "Carrot Halwa",
    image: "media/carrot_halwa.jpg",
    ingredients: [
      "8 cups grated carrot",
      "4 tbsp ghee",
      "6 cups milk",
      "2 cups sugar",
      "Few almonds or cashew nuts",
      "Saffron or cardamom powder for flavoring"
    ],
    cuisine: "Indian",
    prepTime: "10 minutes",
    totalTime: "15 minutes",
    procedure: `
      1. Saute the grated carrots in ghee.
      2. Add milk and cook until very soft.
      3. Add sugar and simmer until sugar dissolves and mixture thickens.
      4. Add saffron or cardamom powder.
      5. Garnish with flaked almonds or cashew nuts.
      6. Serve hot or cold as desired.
    `,
    course: "Dessert"
  },
  {
    name: "Broccoli Pakora",
    image: "media/broccoli_pakora.jpg",
    ingredients: [
      "1 2/3 cups broccoli florets",
      "1/3 cup water",
      "1 pinch baking soda",
      "1 1/2 tbsp rice flour",
      "1/4 cup vegetable oil",
      "Salt as required",
      "1 1/2 tsp chili powder",
      "1 2/3 cups gram flour (besan)"
    ],
    cuisine: "Indian",
    prepTime: "10 minutes",
    totalTime: "30 minutes",
    procedure: `
      1. Wash broccoli and cut into florets. Set aside.
      2. In a bowl, mix gram flour, rice flour, chili powder, baking soda, and salt.
      3. Gradually add water to make a smooth batter.
      4. Heat oil in a kadhai or pan over medium heat.
      5. Dip broccoli florets into the batter, ensuring they are well coated.
      6. Deep fry in batches until golden and crispy.
      7. Remove and drain excess oil on paper towels.
      8. Serve hot with chutney or ketchup.
    `,
    course: "Appetizer"
  },
  {
    name: "Indian Salsa Stew",
    image: "media/salsa_stew.jpg",
    ingredients: [
      "1 lb bag frozen broccoli, cauliflower, and carrots, thawed",
      "2 cans (15 oz each) chickpeas, rinsed and drained",
      "1 tbsp curry powder",
      "1/4 cup mild salsa",
      "2 cups low-sodium vegetable broth"
    ],
    cuisine: "Indian",
    prepTime: "15 minutes",
    totalTime: "15 minutes",
    procedure: `
      1. Coat a saucepan with cooking spray and heat over medium heat.
      2. Sauté vegetables, chickpeas, and curry powder for 2 minutes.
      3. Add salsa, simmer for 5 minutes.
      4. Add broth and 2 cups water, simmer for another 5 minutes.
      5. Season to taste with salt and pepper.
      6. Serve hot with steamed rice.
    `,
    course: "Main Course"
  },
  {
    name: "Indian-style Broccoli Spinach Braise",
    image: "media/broccoli_spinach_braise.jpg",
    ingredients: [
      "1/2 cup olive oil",
      "3 tsp cumin seeds",
      "1 1/2 tsp crushed red pepper flakes",
      "2 lbs broccoli, washed, trimmed and cut into bite-size pieces",
      "1/2 lb spinach leaves, washed and drained",
      "1 cup water",
      "Kosher or sea salt",
      "Edible flowers (optional garnish)"
    ],
    cuisine: "Indian",
    totalTime: "45 minutes",
    procedure: `
      1. In a large heavy-bottomed pan or Dutch oven, heat olive oil over medium heat.
      2. Add cumin seeds and crushed red pepper flakes. Stir until fragrant.
      3. Add broccoli and spinach, cook for 1 to 2 minutes.
      4. Add water and bring to a simmer. Cover and cook over medium-low heat for 30 to 45 minutes, until tender.
      5. Mash with the back of a spoon or a potato masher.
      6. Add salt to taste.
      7. Transfer to a serving bowl, garnish with edible flowers if desired.
      8. Serve hot with chapatis or sliced crusty bread.
    `,
    course: "Side Dish"
  },
  {
    name: "Pink Sultan Mezze",
    image: "media/sultan_mezze.jpg",
    ingredients: [
      "400 gm beetroot",
      "2 cloves garlic",
      "500 gm yogurt (curd)",
      "Salt as required"
    ],
    cuisine: "Indian",
    prepTime: "5 minutes",
    totalTime: "25 minutes",
    procedure: `
      1. Rinse the beetroots and wrap them in foil. Roast in a preheated oven at 160°C for 20 minutes.
      2. Grate the roasted beetroots using the coarse side of a grater.
      3. Mix grated beetroots with yogurt in a bowl.
      4. Add crushed garlic and adjust salt to taste.
      5. Stir well and serve as a dip with grilled pita bread or kebabs.
    `,
    course: "Appetizer"
  },
  {
    name: "Beetroot Idli",
    image: "media/beetroot_idli.jpg",
    ingredients: [
      "1 cup idli batter",
      "1/4 cup grated beetroot",
      "Oil for greasing idli plates"
    ],
    cuisine: "Indian",
    prepTime: "5 minutes",
    totalTime: "10 minutes",
    procedure: `
      1. Mix grated beetroot with idli batter.
      2. Grease idli plates with oil.
      3. Spoon batter into moulds and steam for 5 minutes.
      4. Use a spoon to remove the idlies from the moulds.
      5. Serve hot.
    `,
    course: "Main Course"
  },
  {
    name: "Easy Oven Roasted Beets",
    image: "media/roasted_beets_american.jpg",
    ingredients: [
      "2 pounds beets",
      "2 tablespoons olive oil",
      "1/2 teaspoon salt",
      "1/4 teaspoon ground black pepper",
      "1/4 teaspoon fresh thyme"
    ],
    cuisine: "American",
    prepTime: "10 minutes",
    totalTime: "1 hr 30 minutes",
    procedure: `
      1. Preheat oven to 350 degrees Fahrenheit (175 degrees Celsius).
      2. Wash the beets well, leaving the tails and stems intact. Remove any soil residue.
      3. Wrap each beet loosely in aluminum foil and place on a baking sheet.
      4. Roast the beets in the preheated oven for 40 minutes.
      5. Remove from the oven and let the beets cool for 20 minutes.
      6. Working with one beet at a time, remove the aluminum foil and gently rub the skin under running water to remove it.
      7. Trim the tails and stems, then cut the beets into large bite-sized pieces and transfer to a bowl.
      8. Add olive oil, salt, pepper, and fresh thyme. Toss to coat evenly.
      9. Transfer the coated beets back to the baking sheet and roast at 350 degrees Fahrenheit (175 degrees Celsius) for an additional 20 minutes.
      10. Serve immediately as a delightful side dish.
    `,
    course: "Side Dish"
  },
  {
    name: "Beet Hummus and Chickpea Crostini",
    image: "media/beet_hummus.jpg",
    ingredients: [
      "15 1/2 oz. chickpeas",
      "1 beet, cooked",
      "1/4 cup olive oil",
      "3 tablespoons mint",
      "2 garlic cloves",
      "1 tablespoon lemon juice",
      "3/4 teaspoon ground cumin",
      "Kosher salt",
      "16 baguette slices, toasted"
    ],
    cuisine: "American",
    prepTime: "10 minutes",
    totalTime: "10 minutes",
    procedure: `
      1. In a food processor, combine chickpeas, cooked beet, olive oil, mint, garlic cloves, lemon juice, ground cumin, and salt.
      2. Process until smooth and well blended.
      3. Spread the beet hummus on toasted baguette slices.
      4. Top each crostini with crunchy chickpeas and additional mint leaves.
      5. Serve immediately as a delicious Thanksgiving side or appetizer.
    `,
    course: "Appetizer"
  },
  {
    name: "Tomato Bacon Pie",
    image: "media/american_tomato_bacon_pie.jpg",
    ingredients: [
      "1 unbaked deep-dish pastry shell (9 inches)",
      "3 medium tomatoes, cut into 1/4-inch slices",
      "10 bacon strips, cooked and crumbled",
      "1 cup shredded cheddar cheese",
      "1 cup mayonnaise"
    ],
    cuisine: "American",
    prepTime: "15 minutes",
    totalTime: "45 minutes",
    procedure: `
      1. In a large bowl, combine mayonnaise and cheese.
      2. Add tomatoes and bacon, stirring gently.
      3. Transfer to pastry shell.
      4. Bake at 350°F (175°C) for 30-35 minutes or until crust is golden brown.
      5. Let stand for 10 minutes before cutting.
      6. Serve warm or at room temperature.
    `,
    course: "Main Course"
  },
  {
    name: "American Macaroni Salad",
    image: "media/american_macaroni_salad.jpg",
    ingredients: [
      "2 cups uncooked elbow macaroni",
      "3 hard-cooked eggs, chopped",
      "1 small onion, chopped",
      "3/4 cup chopped celery",
      "1/4 cup chopped green pepper",
      "2 tablespoons chopped pimentos, drained",
      "1 cup mayonnaise",
      "2 tablespoons cider vinegar",
      "1 teaspoon sugar",
      "1/2 teaspoon salt",
      "1/4 teaspoon pepper",
      "1/4 teaspoon garlic powder"
    ],
    cuisine: "American",
    prepTime: "20 minutes",
    totalTime: "20 minutes",
    procedure: `
      1. Cook macaroni according to package directions; drain and rinse with cold water.
      2. In a large bowl, combine the macaroni, eggs, onion, celery, green pepper, and pimentos.
      3. In a small bowl, mix the mayonnaise, vinegar, sugar, salt, pepper, and garlic powder.
      4. Pour over macaroni mixture and toss to coat.
      5. Cover and refrigerate for at least 2 hours.
      6. Serve chilled.
    `,
    course: "Side Dish"
  }

];
localStorage.setItem("recipes", JSON.stringify(recipesarray));
 const homeLink = document.getElementById("home-link");
 const savedLink = document.getElementById("saved-link");


 const path = window.location.pathname;

 if (path.includes("savedrecipes.html")) {
   savedLink.classList.add("active");
   homeLink.classList.remove("active");
   
 } else {
   homeLink.classList.add("active");
   savedLink.classList.remove("active");
   
 }
 newRecipeForm.addEventListener("submit", (event) => {
   event.preventDefault();

   const newRecipe = {
     name: document.getElementById("recipe-name").value,
     ingredients: document
       .getElementById("recipe-ingredients")
       .value.split(",")
       .map((ing) => ing.trim()),
     image: document.getElementById("recipe-image").value,
     procedure: document.getElementById("recipe-procedure").value,
     cuisine: capitalizeFirstLetter(document.getElementById("recipe-cuisine").value.trim()),
     prepTime: document.getElementById("recipe-prep-time").value,
     totalTime: document.getElementById("recipe-total-time").value,
     diet: document.getElementById("recipe-diet").value,
   };

   recipesarray.push(newRecipe);
   localStorage.setItem("recipes", JSON.stringify(recipesarray));
   newRecipeForm.reset();

  
 });
 const capitalizeFirstLetter = (str) => {
   return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
 };
 let recipes = JSON.parse(localStorage.getItem("recipes")) || [];

    const cuisinefilter= document.getElementById("cuisine");
    const maxPrepTimefilter = document.getElementById("maxpreptime");
    const applyFiltersButton = document.getElementById("applyfilters");

    applyFiltersButton.addEventListener("click", () => {
        applyFilters();
    });
    function applyFilters() {
        const selectedCuisine = cuisinefilter.value;
        const maxPrepTime = parseInt(maxPrepTimefilter.value, 10) || Infinity;
        

        const filteredRecipes = recipes.filter(recipe => {
            const matchesCuisine = selectedCuisine ? recipe.cuisine === selectedCuisine : true;
            const matchesPrepTime = recipe.totalTime ? parseInt(recipe.totalTime) <= maxPrepTime : true;

            return matchesCuisine && matchesPrepTime;
        });

        displayRecipes(filteredRecipes, recipeListDiv);
    }

Object.keys(ingredient_categories).forEach((category) => {
  const categoryDiv = document.createElement("div");
  categoryDiv.classList.add(category.trim());
  categoryDiv.classList.add("ingredientbox");

  const categoryName = document.createElement("div");
  categoryName.classList.add("category-name");
  categoryName.textContent = category;
  categoryDiv.appendChild(categoryName);

  ingredient_categories[category].forEach((ingredient) => {
    const ingredientItem = document.createElement("div");
    ingredientItem.classList.add("ingredient-item");
    ingredientItem.textContent = ingredient;
    ingredientItem.addEventListener("click", () => {
      ingredientItem.classList.toggle("selected");
    });
    categoryDiv.appendChild(ingredientItem);
  });
  ingredientGallery.appendChild(categoryDiv);
});

 selectedRating = 0;

 ratingStars.forEach((star) => {
   star.addEventListener("mouseover", handleMouseOver);
   star.addEventListener("mouseout", handleMouseOut);
   star.addEventListener("click", handleClick);
 });

 function handleMouseOver(event) {
   const starValue = event.target.getAttribute("data-value");
   highlightStars(starValue);
 }

 function handleMouseOut() {
   clearHighlight();
   if (selectedRating > 0) {
     highlightStars(selectedRating);
   }
 }

 function handleClick(event) {
   const starValue = event.target.getAttribute("data-value");
   selectStars(starValue);
   selectedRating = starValue;
 }

 function highlightStars(starValue) {
   ratingStars.forEach((star) => {
     if (star.getAttribute("data-value") <= starValue) {
       star.classList.add("hovered");
     } else {
       star.classList.remove("hovered");
     }
   });
 }

 function clearHighlight() {
   ratingStars.forEach((star) => {
     star.classList.remove("hovered");
   });
 }

 function selectStars(starValue) {
   ratingStars.forEach((star) => {
     if (star.getAttribute("data-value") <= starValue) {
       star.classList.add("selected");
     } else {
       star.classList.remove("selected");
     }
   });
 }




 



   userIcon.addEventListener("click", () => {
     logoutButton.classList.toggle("logout-hidden");
     logoutButton.classList.toggle("logout-visible");
   });

   logoutButton.addEventListener("click", () => {
     clearActiveSession().then(() => {
       window.location.href = "login.html";
     });
   });

   function clearActiveSession() {
     return new Promise((resolve, reject) => {
       let request = indexedDB.open("UserDatabase", 2);

       request.onsuccess = function (event) {
         let db = event.target.result;
         let transaction = db.transaction(["Sessions"], "readwrite");
         let objectStore = transaction.objectStore("Sessions");

         let clearRequest = objectStore.clear();

         clearRequest.onsuccess = function () {
           resolve();
         };

         clearRequest.onerror = function (event) {
           console.error(
             "Database error while clearing session:",
             event.target.error
           );
           reject(event.target.error);
         };
       };

       request.onerror = function (event) {
         console.error("Database error while opening:", event.target.error);
         reject(event.target.error);
       };
     });
   }

submitButton.addEventListener("click", () => {
  selectedIngredients = Array.from(
    document.querySelectorAll(".ingredient-item.selected")
  ).map((div) => div.textContent);
 let possibleRecipes = [];
 for (let recipe of recipes) {
   if (canMakeRecipe(recipe.ingredients, selectedIngredients)) {
     possibleRecipes.push(recipe);
   }
 }
  displayRecipes(possibleRecipes, recipeListDiv);
});



closeDetailButton.addEventListener("click", () => {
  recipeDetail.style.display="none";
});


function canMakeRecipe(recipeIngredients, selectedIngredients) {
  return recipeIngredients.some((recipe_ingredient) =>
    selectedIngredients.some((ingredient) =>
      recipe_ingredient.toLowerCase().includes(ingredient.toLowerCase())
    )
  );
}

let useremail;

 getActiveSession()
   .then((email) => {
     if (email) {
       openDatabase()
         .then((db) => {
           const store = getObjectStore(db, "Users", "readwrite");
           const request = store.get(email);

           request.onsuccess = (event) => {
             const userData = event.target.result;
             if (userData) {
               const username = userData.username;
               submitReviewButton.addEventListener("click", () => {
                 const reviewTextValue = reviewText.value.trim();
                 if (selectedRating > 0 && reviewTextValue) {
                   const reviewElement = document.createElement("div");
                   reviewElement.classList.add("review");
                   reviewElement.innerHTML = `
                   <div>${username}</div><div>
                <div class="review-rating">${"&#9733;".repeat(
                  selectedRating
                )}</div>
                <div class="review-text">${reviewTextValue}</div></div>
            `;
                   if (!currentrecipe.reviews) {
                     currentrecipe.reviews = [];
                     currentrecipe.reviews.push({
                       "username": username,
                       "review-rating": selectedRating,
                       "review-text": reviewTextValue,
                     });
                     
                   } else {
                     currentrecipe.reviews.push({
                       "username": username,
                       "review-rating": selectedRating,
                       "review-text": reviewTextValue,
                     });
                   }

                   const recipeIndex = recipesarray.findIndex(recipe => recipe.name === currentrecipe.name);
                   if (recipeIndex !== -1) {
                     recipesarray[recipeIndex] = currentrecipe;
                     localStorage.setItem('recipes', JSON.stringify(recipesarray));
                   }
                   reviewsList.appendChild(reviewElement);
                   reviewText.value = "";
                   selectedRating = 0;
                 } else {
                   alert("Please provide a rating and review text.");
                 }
               });

             } else {
               console.log("No user found with this email.");
             }
           };

           request.onerror = (event) => {
             console.error("Error retrieving user data:", event.target.error);
           };
         })
         .catch((dbError) => {
           console.error("Error opening database:", dbError);
         });
     } else {
       console.log("No active session found.");
     }
   })
   .catch((sessionError) => {
     console.error("Error getting active session:", sessionError);
   });
function displayRecipes(recipes, container) {
  getActiveSession().then((email) => {
    if (email) {
      openDatabase().then((db) => {
        const store = getObjectStore(db, "Users", "readwrite");
        const request = store.get(email);

        request.onsuccess = function (event) {
          const user = event.target.result || { email, savedRecipes: [] };
          user.savedRecipes = user.savedRecipes || [];

          

          const recipeListDiv = document.getElementById("recipe-list");
  const recipeContent = document.getElementById("recipe-content");
  container.innerHTML = "";
  recipes.forEach((recipe) => {
  
          const existingRecipe = user.savedRecipes.find(
            (r) => r.name === recipe.name
          );
    const recipeDiv = document.createElement("div");
    recipeDiv.classList.add("recipe-item");

    const img = document.createElement("img");
    img.src = recipe.image;
    img.alt = recipe.name;

    const name = document.createElement("span");
    name.textContent = recipe.name;

    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.classList.add("save-button");
      let actionButton;
          if (!existingRecipe) {
            actionButton = document.createElement("button");
        actionButton.textContent = "Save";
        actionButton.classList.add("save-button");
        actionButton.addEventListener("click", () => {
          saveRecipe(recipe);})
          } else {
            actionButton = document.createElement("button");
        actionButton.textContent = "Remove";
        actionButton.classList.add("remove-button");
        actionButton.addEventListener("click", () => {
          removeRecipe(recipe.name);
          })
        };
 recipeDiv.appendChild(img);
    recipeDiv.appendChild(name);

    recipeDiv.addEventListener("click", () => {
      recipeDetail.style.display="inline";
      showRecipeDetails(recipe);
      const storedRecipes =
        JSON.parse(localStorage.getItem("recipes")) || [];
      currentrecipe = storedRecipes.find(
        (currentrecipe) => currentrecipe.name === recipe.name
      );

        if (currentrecipe.reviews && currentrecipe.reviews.length > 0) {
          displayReviews(currentrecipe.reviews);
        }
      
      
      recipeContent.appendChild(actionButton);
    });

    container.appendChild(recipeDiv);
  });

  if (recipes.length === 0) {
    recipeListDiv.innerHTML +=
      "<p>No recipes found with the selected ingredients.</p>";
  }
}
        
  });}})}

function displayReviews(reviews) {
  const reviewsList = document.getElementById("reviews-list");
  reviewsList.innerHTML = "";
  const reviewheading=document.createElement('h2');
  reviewheading.innerHTML="Reviews" ;
  reviewsList.appendChild(reviewheading);

  reviews.forEach((review) => {
    const reviewElement = document.createElement("div");
    reviewElement.classList.add("review");
    reviewElement.innerHTML = `
      <div>${review.username} :</div>
      <div class='reviewbox'>
        <div class="review-rating">${"&#9733;".repeat(
          review["review-rating"]
        )}</div>
        <div class="review-text">${review["review-text"]}</div>
      </div>
    `;
    reviewsList.appendChild(reviewElement);
  });
}
   


function showRecipeDetails(recipe) {
  const recipeDetail = document.getElementById("recipe-detail");
  const recipeContent = document.getElementById("recipe-content");

  recipeContent.innerHTML = ` <h3>${recipe.name}</h3>
          <img src="${recipe.image}" alt="${recipe.name}" class="recipe-image">
          <p><strong>Ingredients :</strong><br>${recipe.ingredients}</p>
          <p><strong>Procedure :</strong><br><p class=procedure>${recipe.procedure}<p></p>
          <p><strong>Cuisine :</strong> ${recipe.cuisine}</p>
          <p><strong>Course :</strong> ${recipe.course}</p>
          <p><strong>Prep Time :</strong> ${recipe.prepTime}</p>
          <p><strong>Total Time :</strong> ${recipe.totalTime}</p>
          
          ${
            recipe.calories
              ? `<p><strong>Calories :</strong> ${recipe.calories}</p>`
              : ""
          }
          ${recipe.diet ? `<p><strong>Diet :</strong> ${recipe.diet}</p>` : ""}
          
        `;
  recipeDetail.classList.add("open");
}

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("UserDatabase", 2);

    request.onupgradeneeded = function (event) {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("Recipes")) {
        db.createObjectStore("Recipes", { keyPath: name });
      }
    };

    request.onsuccess = function (event) {
      resolve(event.target.result);
    };

    request.onerror = function (event) {
      reject("Error opening database: " + event.target.errorCode);
    };
  });
}

function getObjectStore(db, storeName, mode) {
  const transaction = db.transaction(storeName, mode);
  return transaction.objectStore(storeName);
}



function saveRecipe(recipe) {
  getActiveSession().then((email) => {
    if (email) {
      openDatabase().then((db) => {
        const store = getObjectStore(db, "Users", "readwrite");
        const request = store.get(email);

        request.onsuccess = function (event) {
          const user = event.target.result || { email, savedRecipes: [] };
          user.savedRecipes = user.savedRecipes || [];

          const existingRecipe = user.savedRecipes.find(
            (r) => r.name === recipe.name
          );
          if (!existingRecipe) {
            user.savedRecipes.push(recipe);
            store.put(user);
            console.log("Recipe saved for user:", email);
            updateSavedRecipesUI();
          } else {
            console.log("Recipe already saved for user:", email);
          }
        };

        request.onerror = function (event) {
          console.error("Error retrieving user:", event.target.error);
        };
      });
    } else {
       window.location.href = "login.html";
    }
  });
}

function removeRecipe(recipeName) {
  getActiveSession().then((email) => {
    if (email) {
      openDatabase().then((db) => {
        const store = getObjectStore(db, "Users", "readwrite");
        const request = store.get(email);

        request.onsuccess = function (event) {
          const user = event.target.result;
          if (user && user.savedRecipes) {
            const updatedRecipes = user.savedRecipes.filter((r) => r.name !== recipeName);
            user.savedRecipes = updatedRecipes;
            store.put(user);
            console.log("Recipe removed for user:", email);
            updateSavedRecipesUI();
          } else {
            console.log("User or saved recipes not found for:", email);
          }
        };

        request.onerror = function (event) {
          console.error("Error retrieving user:", event.target.error);
        };
      });
    } else {
       window.location.href = "login.html";
    }
  });
}

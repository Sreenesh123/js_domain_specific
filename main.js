
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
    console.log("Database initialized successfully");
  };

  request.onerror = function (event) {
    console.error("Database error during initialization:", event.target.error);
  };
}

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function comparePassword(password, hash) {
  const hashedPassword = await hashPassword(password);
  return hashedPassword === hash;
}

function toggleForms(showRegister) {
  if (showRegister) {
    document.getElementById("registerformdiv").style.display = "block";
    document.getElementById("loginformdiv").style.display = "none";
  } else {
    document.getElementById("registerformdiv").style.display = "none";
    document.getElementById("loginformdiv").style.display = "block";
  }
}


document.querySelectorAll("#showRegister").forEach((showregister) =>
  showregister.addEventListener("click", function () {
    toggleForms(true);
  })
);

document.querySelectorAll("#showLogin").forEach((showlogin) =>
  showlogin.addEventListener("click", function () {
    toggleForms(false);
  })
);
initDB();

function setActiveSession(email) {
  let request = indexedDB.open("UserDatabase", 2);

  request.onsuccess = function (event) {
    let db = event.target.result;
    let transaction = db.transaction(["Sessions"], "readwrite");
    let objectStore = transaction.objectStore("Sessions");

    objectStore.clear().onsuccess = function () {
      objectStore.add({ email: email });
    };
  };

  request.onerror = function (event) {
    console.error("Database error while setting session:", event.target.error);
  };
}

function getActiveSession() {
  return new Promise((resolve, reject) => {
    let request = indexedDB.open("UserDatabase", 2);

    request.onsuccess = function (event) {
      let db = event.target.result;
      let transaction = db.transaction(["Sessions"], "readonly");
      let objectStore = transaction.objectStore("Sessions");

      let getRequest = objectStore.getAll();

      getRequest.onsuccess = function (event) {
        if (event.target.result.length > 0) {
          resolve(event.target.result[0].email);
        } else {
          resolve(null);
        }
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

async function registerUser(email, password,username) {
  const hashedPassword = await hashPassword(password);

  let request = indexedDB.open("UserDatabase", 2);

  request.onsuccess = function (event) {
    let db = event.target.result;
    let transaction = db.transaction(["Users"], "readwrite");
    let objectStore = transaction.objectStore("Users");

    let getRequest = objectStore.get(email);

    getRequest.onsuccess = function (event) {
      let existingUser = event.target.result;

      if (existingUser) {
        console.log("User with email already exists");
        alert(
          "User with this email already exists. Please use the login form."
        );
        toggleForms(false);
        return;
      }

      let user = { username:username,email: email, password: hashedPassword };

      let addRequest = objectStore.add(user);

      addRequest.onsuccess = function (event) {
        console.log("User registered successfully");
        alert("User registered successfully. Please login.");
        setActiveSession(email);
        toggleForms(false); 
      };

      addRequest.onerror = function (event) {
        console.error("Error registering user:", event.target.error);
        alert("Error registering user: " + event.target.error);
      };
    };

    getRequest.onerror = function (event) {
      console.error("Error checking existing user:", event.target.error);
      alert("Error checking existing user: " + event.target.error);
    };
  };

  request.onerror = function (event) {
    console.error(
      "Database error during user registration:",
      event.target.error
    );
  };
}

async function loginUser(email, password,username) {
  let request = indexedDB.open("UserDatabase", 2);

  request.onsuccess = function (event) {
    let db = event.target.result;
    let transaction = db.transaction(["Users"], "readonly");
    let objectStore = transaction.objectStore("Users");

    let getRequest = objectStore.get(email);

    getRequest.onsuccess = async function (event) {
      let user = event.target.result;

      if (user) {
        const match = await comparePassword(password, user.password);
        if (match) {
          console.log("Login successful");
          alert("Login successful. Redirecting to main page.");
          setActiveSession(email);
          window.location.href = "index.html";
        } else {
          console.log("Password incorrect");
          alert("Password incorrect");
        }
      } else {
        console.log("No user with that email");
        alert("No user with that email");
      }
    };

    getRequest.onerror = function (event) {
      console.error("Error retrieving user:", event.target.error);
      alert("Error retrieving user: " + event.target.error);
    };
  };

  request.onerror = function (event) {
    console.error("Database error during login:", event.target.error);
  };
}

document
  .getElementById("registerform")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("registeremail").value;
    const password = document.getElementById("registerpassword").value;
    const username = document.getElementById("signupusername").value;
    await registerUser(email, password,username);
  });

document
  .getElementById("loginform")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("loginemail").value;
    const password = document.getElementById("loginpassword").value;
    const username=document.getElementById('loginusername').value;
    await loginUser(email, password,username);
  });

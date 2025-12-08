// ==========================================
// 1. DATA STORAGE (Our "Variables")
// ==========================================
let workouts = []; // Stores workout objects
let meals = [];    // Stores meal objects

// ==========================================
// 2. NAVIGATION LOGIC (Tabs)
// ==========================================
const fitnessSection = document.getElementById("fitness");
const foodSection = document.getElementById("food");
const dashboardSection = document.getElementById("dashboard");

// Add click events to buttons
document.getElementById("fitnessLogBtn").addEventListener("click", fitnessLog);
document.getElementById("nutritionLogBtn").addEventListener("click", nutritionLog);
document.getElementById("progressDashboardBtn").addEventListener("click", progressDashboard);

// Tab switching functions
function fitnessLog() {
    switchTab(fitnessSection, document.getElementById("fitnessLogBtn"));
}

function nutritionLog() {
    switchTab(foodSection, document.getElementById("nutritionLogBtn"));
}

function progressDashboard() {
    updateDashboard(); // Recalculate stats before showing
    switchTab(dashboardSection, document.getElementById("progressDashboardBtn"));
}

// Helper to handle class switching
function switchTab(activeSection, activeButton) {
    // Hide all sections
    fitnessSection.classList.remove("active");
    foodSection.classList.remove("active");
    dashboardSection.classList.remove("active");
    
    // Reset all buttons
    document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));

    // Activate selected
    activeSection.classList.add("active");
    activeButton.classList.add("active");
}

// ==========================================
// 3. APP LOGIC (Forms & Display)
// ==========================================

// --- FITNESS LOGIC ---
const fitnessForm = document.getElementById("fitnessForm");
const fitnessLogList = document.getElementById("fitnessLog");

fitnessForm.addEventListener("submit", function(event) {
    event.preventDefault(); // Stop page from reloading

    // 1. Get values from HTML inputs
    const workoutName = document.getElementById("workoutName").value;
    const calories = parseInt(document.getElementById("caloriesBurned").value);

    // 2. Create an object
    const workoutEntry = {
        id: Date.now(), // Give it a unique ID
        name: workoutName,
        calories: calories,
        date: new Date().toLocaleTimeString()
    };

    // 3. Save to our variable array
    workouts.push(workoutEntry);

    // 4. Update the Screen
    renderWorkoutList();
    fitnessForm.reset(); // Clear the text boxes
    alert("Workout Logged!");
});

function renderWorkoutList() {
    // Clear the "No workouts yet" text
    fitnessLogList.innerHTML = "";

    // Loop through the array and create HTML for each item
    workouts.forEach((workout) => {
        const itemHTML = `
            <div class="log-item">
                <h3>${workout.name}</h3>
                <p>🔥 ${workout.calories} kcal burned</p>
                <p><small>${workout.date}</small></p>
            </div>
        `;
        fitnessLogList.innerHTML += itemHTML;
    });
}

// --- NUTRITION LOGIC ---
const foodForm = document.getElementById("foodForm");
const foodLogList = document.getElementById("foodLog");

foodForm.addEventListener("submit", function(event) {
    event.preventDefault(); // Stop page from reloading

    // 1. Get values
    const mealName = document.getElementById("mealName").value;
    const calories = parseInt(document.getElementById("calories").value);
    const protein = parseInt(document.getElementById("protein").value);
    const carbs = parseInt(document.getElementById("carbs").value);
    const fat = parseInt(document.getElementById("fat").value);

    // 2. Create Object
    const mealEntry = {
        id: Date.now(),
        name: mealName,
        calories: calories,
        protein: protein,
        carbs: carbs,
        fat: fat
    };

    // 3. Save to variable
    meals.push(mealEntry);

    // 4. Update Screen
    renderMealList();
    foodForm.reset();
    alert("Meal Logged!");
});

function renderMealList() {
    foodLogList.innerHTML = "";
    
    meals.forEach((meal) => {
        const itemHTML = `
            <div class="log-item">
                <h3>${meal.name}</h3>
                <p>🍽️ ${meal.calories} kcal</p>
                <p>P: ${meal.protein}g | C: ${meal.carbs}g | F: ${meal.fat}g</p>
            </div>
        `;
        foodLogList.innerHTML += itemHTML;
    });
}

// --- DASHBOARD LOGIC ---
function updateDashboard() {
    // 1. Calculate Totals using the arrays
    let totalWorkouts = workouts.length;
    let totalMeals = meals.length;
    
    // Calculate sums
    let totalBurned = 0;
    workouts.forEach(w => totalBurned += w.calories);

    let totalConsumed = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    meals.forEach(m => {
        totalConsumed += m.calories;
        totalProtein += m.protein;
        totalCarbs += m.carbs;
        totalFat += m.fat;
    });

    let netCals = totalConsumed - totalBurned;

    // 2. Update HTML Text
    document.getElementById("totalWorkouts").innerText = totalWorkouts;
    document.getElementById("totalCaloriesBurned").innerText = totalBurned;
    document.getElementById("totalMeals").innerText = totalMeals;
    document.getElementById("totalCaloriesConsumed").innerText = totalConsumed;
    
    document.getElementById("proteinTotal").innerText = totalProtein + "g";
    document.getElementById("carbsTotal").innerText = totalCarbs + "g";
    document.getElementById("fatTotal").innerText = totalFat + "g";
    document.getElementById("netCalories").innerText = netCals;

    // 3. Update Progress Bars (Visuals)
    // We assume a standard goal of 200g carbs/protein for the visual bar percentage, 
    // just so the bar moves. You can adjust the denominator (200) to whatever goal you want.
    
    document.getElementById("proteinBar").style.width = Math.min((totalProtein / 200) * 100, 100) + "%";
    document.getElementById("carbsBar").style.width = Math.min((totalCarbs / 300) * 100, 100) + "%";
    document.getElementById("fatBar").style.width = Math.min((totalFat / 100) * 100, 100) + "%";
    
    // Net Calories bar logic (centering it)
    let netPercent = 50; // Start at middle
    if (netCals > 0) netPercent = Math.min(50 + (netCals / 2000 * 50), 100);
    else netPercent = Math.max(50 + (netCals / 2000 * 50), 0);
    
    document.getElementById("netCaloriesBar").style.width = netPercent + "%";
}
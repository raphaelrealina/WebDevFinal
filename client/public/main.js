
// DATA STORAGE 
let workouts = []; // Stores workout objects
let meals = [];    // Stores meal objects

// NAVIGATION LOGIC (Tabs)

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

async function progressDashboard() {
    await updateDashboard(); // Recalculate stats before showing
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

// APP LOGIC (Forms & Display)

// FITNESS LOGIC
const fitnessForm = document.getElementById("fitnessForm");
const fitnessLogList = document.getElementById("fitnessLog");

fitnessForm.addEventListener("submit", function(event) {
    event.preventDefault(); // Stop page from reloading

    // Get values from HTML inputs
    const workoutName = document.getElementById("workoutName").value;
    const calories = parseInt(document.getElementById("caloriesBurned").value);

    // Create an object
    const workoutEntry = {
        id: Date.now(), // Give it a unique ID
        name: workoutName,
        calories: calories,
        date: new Date().toLocaleTimeString()
    };

    // Save to our variable array
    workouts.push(workoutEntry);

    // Update the Screen
    renderWorkoutList();
    fitnessForm.reset(); // Clear the text boxes
    alert("Workout Logged!");

    const authToken = localStorage.getItem("token");
    if (authToken) {
        fetch("/api/workouts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify({
                exercise: workoutEntry.name,
                notes: `Calories burned: ${workoutEntry.calories} at ${workoutEntry.date}`
            })
        }).catch((err) => console.error("Failed to log workout to database", err));
    }
});

function renderWorkoutList() {
    // Clear the "No workouts yet" text
    fitnessLogList.innerHTML = "";

    // Loop through the array and create HTML for each item
    workouts.forEach((workout) => {
        const itemHTML = `
            <div class="log-item">
                <h3>${workout.name}</h3>
                <p>🔥 ${workout.calories} cal burned</p>
                <p><small>${workout.date}</small></p>
            </div>
        `;
        fitnessLogList.innerHTML += itemHTML;
    });
}

// NUTRITION LOGIC
const foodForm = document.getElementById("foodForm");
const foodLogList = document.getElementById("foodLog");

foodForm.addEventListener("submit", function(event) {
    event.preventDefault(); // Stop page from reloading

    // Get values
    const mealName = document.getElementById("mealName").value;
    const calories = parseInt(document.getElementById("calories").value);
    const protein = parseInt(document.getElementById("protein").value);
    const carbs = parseInt(document.getElementById("carbs").value);
    const fat = parseInt(document.getElementById("fat").value);

    // Create Object
    const mealEntry = {
        id: Date.now(),
        name: mealName,
        calories: calories,
        protein: protein,
        carbs: carbs,
        fat: fat
    };

    // Save to variable
    meals.push(mealEntry);

    // Update Screen
    renderMealList();
    foodForm.reset();
    alert("Meal Logged!");

    const authToken = localStorage.getItem("token");
    if (authToken) {
        fetch("/api/meals", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify({
                items: [{
                    name: mealEntry.name,
                    calories: mealEntry.calories,
                    protein: mealEntry.protein
                }],
                notes: `Carbs: ${mealEntry.carbs}g, Fat: ${mealEntry.fat}g`
            })
        }).catch((err) => console.error("Failed to log meal to database", err));
    }
});

function renderMealList() {
    foodLogList.innerHTML = "";
    
    meals.forEach((meal) => {
        const itemHTML = `
            <div class="log-item">
                <h3>${meal.name}</h3>
                <p>🍽️ ${meal.calories} cal</p>
                <p>P: ${meal.protein}g | C: ${meal.carbs}g | F: ${meal.fat}g</p>
            </div>
        `;
        foodLogList.innerHTML += itemHTML;
    });
}

// DASHBOARD LOGIC
async function updateDashboard() {

    const authToken = localStorage.getItem("token");
    if (authToken) {
        try {
            const [workoutRes, mealRes] = await Promise.all([
                fetch("/api/workouts", { headers: { "Authorization": `Bearer ${authToken}` } }),
                fetch("/api/meals", { headers: { "Authorization": `Bearer ${authToken}` } })
            ]);

            if (workoutRes.ok) {
                const workoutsFromDb = await workoutRes.json();
                workouts = workoutsFromDb.map(w => {
                    const caloriesMatch = (w.notes || "").match(/Calories burned:\s*(\d+)/i);
                    return {
                        id: w._id || w.id || Date.now(),
                        name: w.exercise || w.name || "Workout",
                        calories: caloriesMatch ? parseInt(caloriesMatch[1]) : 0,
                        date: w.date || new Date().toLocaleTimeString()
                    };
                });
            }

            if (mealRes.ok) {
                const mealsFromDb = await mealRes.json();
                meals = mealsFromDb.map(m => {
                    const firstItem = m.items && m.items[0] ? m.items[0] : {};
                    const carbsMatch = (m.notes || "").match(/Carbs:\s*(\d+)/i);
                    const fatMatch = (m.notes || "").match(/Fat:\s*(\d+)/i);
                    return {
                        id: m._id || m.id || Date.now(),
                        name: firstItem.name || m.name || "Meal",
                        calories: typeof m.totalCalories === "number" ? m.totalCalories : (firstItem.calories || 0),
                        protein: typeof m.totalProtein === "number" ? m.totalProtein : (firstItem.protein || 0),
                        carbs: carbsMatch ? parseInt(carbsMatch[1]) : 0,
                        fat: fatMatch ? parseInt(fatMatch[1]) : 0
                    };
                });
            }
        } catch (err) {
            console.error("Failed to sync dashboard data", err);
        }
    }

    // Calculate Totals using the arrays
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

    // Update HTML Text
    document.getElementById("totalWorkouts").innerText = totalWorkouts;
    document.getElementById("totalCaloriesBurned").innerText = totalBurned;
    document.getElementById("totalMeals").innerText = totalMeals;
    document.getElementById("totalCaloriesConsumed").innerText = totalConsumed;
    
    document.getElementById("proteinTotal").innerText = totalProtein + "g";
    document.getElementById("carbsTotal").innerText = totalCarbs + "g";
    document.getElementById("fatTotal").innerText = totalFat + "g";
    document.getElementById("netCalories").innerText = netCals;

    // Update Progress Bars (Visuals)
    
    document.getElementById("proteinBar").style.width = Math.min((totalProtein / 200) * 100, 100) + "%";
    document.getElementById("carbsBar").style.width = Math.min((totalCarbs / 300) * 100, 100) + "%";
    document.getElementById("fatBar").style.width = Math.min((totalFat / 100) * 100, 100) + "%";
    
    // Net Calories bar logic (centering it)
    let netPercent = 50; // Start at middle
    if (netCals > 0) netPercent = Math.min(50 + (netCals / 2000 * 50), 100);
    else netPercent = Math.max(50 + (netCals / 2000 * 50), 0);
    
    document.getElementById("netCaloriesBar").style.width = netPercent + "%";
}

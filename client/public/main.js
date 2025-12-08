document.getElementById("fitnessLogBtn").addEventListener("click", fitnessLog);
document.getElementById("nutritionLogBtn").addEventListener("click", nutritionLog);
document.getElementById("progressDashboardBtn").addEventListener("click", progressDashboard);

// 1. Define your sections for easier access
const fitnessSection = document.getElementById("fitness"); // Corresponds to [0]
const foodSection = document.getElementById("food");       // Corresponds to [1]
const dashboardSection = document.getElementById("dashboard"); // Corresponds to [2]

// Fitness/Workout Logging 
function fitnessLog() {
    console.log("fitness worked!");
    
    // Add active class to the one we want
    fitnessSection.classList.add("active");
    
    // Remove active class from the others
    foodSection.classList.remove("active");
    dashboardSection.classList.remove("active");
}

// Meal/Nutrition Logging
function nutritionLog() {
    console.log("nutrition worked!");
    
    // Add active class to the one we want
    foodSection.classList.add("active");
    
    // Remove active class from the others
    fitnessSection.classList.remove("active");
    dashboardSection.classList.remove("active");
}

// Progress Dashboard & Visualization
function progressDashboard() {
    console.log("progress worked!");
    
    // Add active class to the one we want
    dashboardSection.classList.add("active");
    
    // Remove active class from the others
    fitnessSection.classList.remove("active");
    foodSection.classList.remove("active");
}
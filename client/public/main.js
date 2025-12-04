//switching pages

document.getElementById("fitnessLogBtn").addEventListener("click", fitnessLog);
document.getElementById("nutritionLogBtn").addEventListener("click", nutritionLog);
document.getElementById("progressDashboardBtn").addEventListener("click", progressDashboard);

// Fitness/Workout Logging 
function fitnessLog() {
    Document.getElementbyId("main").innerHTML = "Fitness Log Page";

}

// Meal/Nutrition Logging
function nutritionLog() {
    Document.getElementbyId("main").innerHTML = "Nutrition Log Page";

}

// Progress Dashboard & Visualization
function progressDashboard() {
    Document.getElementbyId("main").innerHTML = "Progress Dashboard Page";
    
}






//switching pages

document.getElementById("fitnessLogBtn").addEventListener("click", fitnessLog);
document.getElementById("nutritionLogBtn").addEventListener("click", nutritionLog);
document.getElementById("progressDashboardBtn").addEventListener("click", progressDashboard);

// Fitness/Workout Logging 
function fitnessLog() {
    Document.getElementbyId("main").innerHTML = "<p>Fitness Log Page</p>";

}

// Meal/Nutrition Logging
function nutritionLog() {
    Document.getElementbyId("main").innerHTML = "<p>Nutrition Log Page</p>";

}

// Progress Dashboard & Visualization
function progressDashboard() {
    Document.getElementbyId("main").innerHTML = "<p>Progress Dashboard Page</p>";
    
}






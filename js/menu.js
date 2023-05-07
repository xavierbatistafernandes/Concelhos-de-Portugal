// Get references to the game type buttons
const gameType1Button = document.getElementById("gameType1");
const gameType2Button = document.getElementById("gameType2");

// Add event listeners to the game type buttons
gameType1Button.addEventListener("click", function() {
    hideMenu();
    showMap();
    updateOEF(1);
});

gameType2Button.addEventListener("click", function() {
    hideMenu();
    showMap();
    updateOEF(2);
});



// Get references to the menu and map container elements
const menu = document.getElementById("menu");

// Function to hide the menu
function hideMenu() {
   menu.style.display = "none";
}

function showMenu() {
    menu.style.display = "block";
}





const gameType1Button = document.getElementById("gameType1");
const gameType2Button = document.getElementById("gameType2");

/* Adding event listeners to the menu buttons */
gameType1Button.addEventListener("click", function() {
    hideMenu();
    initMode1();
    showMap();
});

gameType2Button.addEventListener("click", function() {
    hideMenu();
    initMode2();
    showMap();
});


const menu = document.getElementById("menu");


function hideMenu() {
   menu.style.display = "none";
}

function showMenu() {
    menu.style.display = "block";
}




/* Script relating the 'play.html' page */
const play1_button = document.getElementById("btn-play1");
const play2_button = document.getElementById("btn-play2");

/* Adding event listeners to the menu buttons */
play1_button.addEventListener("click", function() {
    window.location = "map.html?mode=p1";
});

play2_button.addEventListener("click", function() {
    window.location = "map.html?mode=p2";
});

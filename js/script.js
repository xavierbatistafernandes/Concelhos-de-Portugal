
/* Script relating the 'play.html' page */
const play1_button = document.getElementById("btn-play1");
const play2_button = document.getElementById("btn-play2");

const learn1_button = document.getElementById("btn-learn1");

/* Adding event listeners to the menu buttons */
if (play1_button != null)
    play1_button.addEventListener("click", function() {
        window.location = "map.html?mode=p1";
    });

if (play2_button != null)
    play2_button.addEventListener("click", function() {
        window.location = "map.html?mode=p2";
    });


if (learn1_button != null)
    learn1_button.addEventListener("click", function() {
        window.location = "map.html?mode=l1";
    });



function hideContainers () {
    
}
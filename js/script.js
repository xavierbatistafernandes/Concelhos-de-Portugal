
/* Script relating the 'play.html' page */
const play1_button = document.getElementById("btn-play1");
const play2_button = document.getElementById("btn-play2");

const learn1_button = document.getElementById("btn-learn1");

const menu1_div = document.getElementById("menu1");
const menu2_div = document.getElementById("menu2");

const select1_div = document.getElementById("select1");
const select2_div = document.getElementById("select2");

const select1 = document.getElementById("select-play1");
const select2 = document.getElementById("select-play2");

const accept1_button = document.getElementById("btn-accept1");
const accept2_button = document.getElementById("btn-accept2");

/* Adding event listeners to the menu buttons */
if (play1_button != null)
    play1_button.addEventListener("click", function() {
        //window.location = "map.html?mode=p1";
        menu1_div.style.display = 'none';
        select1_div.style.display = 'block';
    });

if (play2_button != null)
    play2_button.addEventListener("click", function() {
        menu2_div.style.display = 'none';
        select2_div.style.display = 'block';
    });


if (learn1_button != null)
    learn1_button.addEventListener("click", function() {
        window.location = "map.html?mode=l1"
    });


if (accept1_button != null)
    accept1_button.addEventListener("click", function() {
        if (select1.value == "Todos")
            window.location = "map.html?mode=p1";
        else
            window.location = "map.html?mode=p1&district=" + select1.value;
    })

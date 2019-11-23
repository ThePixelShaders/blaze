let counters = {}
counters.population = document.getElementById("res_wood");
counters.wood = document.getElementById("res_stone");
counters.stone = document.getElementById("res_petrol");


// Minimum graphical interface
var upperDiv = document.getElementById("info");
function setDiv( text ) { upperDiv.innerHTML = text; }
function logDiv( text ) { upperDiv.innerHTML += text + "<br>"; }

// this is the login div
var middleDiv = document.getElementById("middle");

//middleDiv.style.visibility = "hidden"; 
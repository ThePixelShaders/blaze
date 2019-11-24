// let clockObj = document.getElementById("clock").children[0];
let polutionBar = document.getElementById("inside-polution-bar");


function setTime(sec)
{
    // minutes = Math.floor(sec/ 60);
    // sec = sec - (minutes * 60);    
    // clockObj.innerHTML = minutes + ":" + sec;

    let procent = sec / 120;

    polutionBar.style.width =  (1 - procent) * 100 + "%";
}


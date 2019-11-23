let clockObj = document.getElementById("clock").children[0];



function setTime(sec)
{
    minutes = Math.floor(sec/ 60);
    sec = sec - (minutes * 60);

    clockObj.innerHTML = minutes + ":" + sec;
}


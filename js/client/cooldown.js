let isCooldownReadyBool = true;
let interval;
let progressbar = document.getElementById("progress-bar");
let initialTime = 0;
let finishTime = 0;


function isCooldownReady()
{
    return isCooldownReadyBool;
}

function getCooldown()
{
    let t = finishTime - Date.now();
    if(t < 0){t = 0;}
    return t;
}

function getCooldownPercent()
{
    let a = Date.now();
    if(a > finishTime)
    {
        return 0;
    }else
    {
        let small = a - initialTime;
        let all = finishTime - initialTime;

        return 1 - (small / all);
    }

}

function setCooldown(time, string)
{
    isCooldownReadyBool = false;
    initialTime = Date.now();
    finishTime = initialTime + time;
    interval = setInterval(() => {
        let a = getCooldown();
        setTime((Math.floor(a/1000)));
        if(getCooldown()==0)
        {
            isCooldownReadyBool = true;
            setTime(0);
            clearInterval(interval);
        }
        //clearInterval
    }, 100);

}

setCooldown(1000, "Ț");

function setProgressbar(value){
    value *= 100;
    value += "%";
    progressbar.style.width = value;
}

function itemDetails(wood, rocks, metal, oil, description){
    var woodPrice = document.getElementById("woodPrice");
    var rocksPrice = document.getElementById("rocksPrice");
    var oilPrice = document.getElementById("oilPrice");
    var metalPrice = document.getElementById("metalPrice");

    if(wood != null){
        woodPrice.innerHTML += wood;
    }
    else
    {
        woodPrice.innerHTML = null;
    }

    if(rocks != null){
        rocksPrice.innerHTML += wood;
    }
    else
    {
        rocksPrice.innerHTML = null;
    }

    if(metal != null){
        metalPrice.innerHTML += metal;
    }
    else{
        metalPrice.innerHTML = null;
    }

    if(oil != null){
        oilPrice.innerHTML += oil;
    }
    else{ 
        oilPrice.innerHTML = null;
    }
}
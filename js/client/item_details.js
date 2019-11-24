function itemDetails(wood, rocks, metal, description){
    var woodPrice = document.getElementById("woodPrice");
    var rocksPrice = document.getElementById("rocksPrice");
    var metalPrice = document.getElementById("metalPrice");
    var itemDescription = document.getElementById("item-description");

    if(wood != ""){
        woodPrice.innerHTML = "Wood: " + "<span class=\"priceSpan\" >" + wood + "</span>";
    }
    else
    {
        woodPrice.innerHTML = null;
    }

    if(rocks != ""){
        rocksPrice.innerHTML = "Rocks: " + "<span class=\"priceSpan\" >" + rocks + "</span>";351512
    }
    else
    {
        rocksPrice.innerHTML = null;
    }

    if(metal != ""){
        metalPrice.innerHTML = "Metal: " + "<span class=\"priceSpan\" >" + metal + "</span>";
    }
    else{
        metalPrice.innerHTML = null;
    }

    itemDescription.innerHTML = description;
}
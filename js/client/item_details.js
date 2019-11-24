function itemDetails(currentActive){
    var woodPrice = document.getElementById("woodPrice");
    var rocksPrice = document.getElementById("rocksPrice");
    var metalPrice = document.getElementById("metalPrice");
    var itemDescription = document.getElementById("item-description");
    let wood, rocks, metal, description;
    switch(currentActive){
        case 1:
            wood = "4";
            rocks = "2";
            metal = "";
            description = "description";
            break;
        case 2:
                wood = "42";
                rocks = "25";
                metal = "";
                description = "description1";
            break;
        case 3:
                wood = "14";
                rocks = "52";
                metal = "";
                description = "description2";
            break;
        case 4:
                wood = "14";
                rocks = "26";
                metal = "";
                description = "description3";
            break;
        case 5:
                wood = "234";
                rocks = "52";
                metal = "2";
                description = "description4";
            break;
        case 6:
                wood = "524";
                rocks = "66";
                metal = "6";
                description = "description5";
            break;
        case 7:
                wood = "46";
                rocks = "32";
                metal = "63";
                description = "description6";
            break;
        case 8:
                wood = "1";
                rocks = "";
                metal = "";
                description = "Plant a new tree!";
                break;
    }




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
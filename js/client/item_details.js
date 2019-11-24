function itemDetails(currentActive){
    var woodPrice = document.getElementById("woodPrice");
    var rocksPrice = document.getElementById("rocksPrice");
    var metalPrice = document.getElementById("metalPrice");
    var itemDescription = document.getElementById("item-description");
    let wood, rocks, metal, description;
    switch(currentActive){
        case 1: //House
            wood = "10";
            rocks = "";
            metal = "";
            description = "description";
            break;
        case 2: //Lumberjack
                wood = "15";
                rocks = "1";
                metal = "";
                description = "description1";
            break;
        case 3: //Mine
                wood = "20";
                rocks = "1";
                metal = "";
                description = "description2";
            break;
        case 4: //Oil well
                wood = "10";
                rocks = "10";
                metal = "";
                description = "description3";
            break;
        case 5: //Factory
                wood = "5";
                rocks = "15";
                metal = "2";
                description = "description4";
            break;
        case 6: //Cannon
                wood = "10";
                rocks = "10";
                metal = "10";
                description = "description5";
            break;
        case 7: //Tower
                wood = "5";
                rocks = "5";
                metal = "10";
                description = "description6";
            break;
        case 8: //PlantTree
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
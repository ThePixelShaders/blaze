function hotbar(){

    var input = document.getElementById('hotbar-input');

    switch(input.value){
        case '1':
            $("#hotbar-box-active").removeClass("#hotbar-box-active");

            $("li#hotbar-box1").addClass("hotbar-box-active");
            break;
        case '2':
            $("#hotbar-box-active").removeClass("#hotbar-box-active");

            $("li#hotbar-box2").addClass("hotbar-box-active");
            break;
        case '3':
            $("#hotbar-box-active").removeClass("#hotbar-box-active");

            $("li#hotbar-box3").addClass("hotbar-box-active");
            break;
        case '4':
            $("#hotbar-box-active").removeClass("#hotbar-box-active");

            $("li#hotbar-box4").addClass("hotbar-box-active");
            break;
        case '5':
            $("#hotbar-box-active").removeClass("#hotbar-box-active");

            $("li#hotbar-box5").addClass("hotbar-box-active");
            break;
    }
}
/*
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
*/

var HotBar = {
	currentActive : 1,
	hotbarMapping : [ TotemTypes.empty, TotemTypes.house1, TotemTypes.lumber1, TotemTypes.mine, TotemTypes.petrol, TotemTypes.nuclearplant, TotemTypes.cannon, TotemTypes.tower, TotemTypes.sappling ],

	// this returns a TotemType
	getCurrentActive : function(){
		return this.hotbarMapping [ this.currentActive ];
    },
    
    onDocumentKeyDown : function( event ){
        switch( event.keyCode ){
            case 49: /*1*/ 
                $("li.hotbar-box-active").removeClass("hotbar-box-active");
                $("li#hotbar-box1").addClass("hotbar-box-active");
                HotBar.currentActive = 1;
                itemDetails(HotBar.currentActive);
            break;
            case 50: /*2*/ 
                $("li.hotbar-box-active").removeClass("hotbar-box-active");
                $("li#hotbar-box2").addClass("hotbar-box-active");
                HotBar.currentActive = 2;
                itemDetails(HotBar.currentActive);
            break;
            case 51: /*3*/ 
                $("li.hotbar-box-active").removeClass("hotbar-box-active");
                $("li#hotbar-box3").addClass("hotbar-box-active");
                HotBar.currentActive = 3;
                itemDetails(HotBar.currentActive);
            break;
            case 52: /*4*/ 
                $("li.hotbar-box-active").removeClass("hotbar-box-active");
                $("li#hotbar-box4").addClass("hotbar-box-active");
                HotBar.currentActive = 4;
                itemDetails(HotBar.currentActive);
            break;
            case 53: /*5*/ 
                $("li.hotbar-box-active").removeClass("hotbar-box-active");
                $("li#hotbar-box5").addClass("hotbar-box-active");
                HotBar.currentActive = 5;
                itemDetails(HotBar.currentActive);
            break;
            case 54: /*6*/ 
                $("li.hotbar-box-active").removeClass("hotbar-box-active");
                $("li#hotbar-box6").addClass("hotbar-box-active");
                HotBar.currentActive = 6;
                itemDetails(HotBar.currentActive);
            break;
            case 55: /*7*/ 
                $("li.hotbar-box-active").removeClass("hotbar-box-active");
                $("li#hotbar-box7").addClass("hotbar-box-active");
                HotBar.currentActive = 7;
                itemDetails(HotBar.currentActive);
            break;
            case 56: /*8*/ 
                $("li.hotbar-box-active").removeClass("hotbar-box-active");
                $("li#hotbar-box8").addClass("hotbar-box-active");
                HotBar.currentActive = 8;
                itemDetails(HotBar.currentActive);
            break;
            default:
                return false;
        }
        return true;
    },

    onDocumentWheel : function( event ){
        if(event.deltaY>0){
            HotBar.currentActive++;
            if(HotBar.currentActive == 9)
            {
                HotBar.currentActive = 1;
            }
            $("li.hotbar-box-active").removeClass("hotbar-box-active");
            $("li#hotbar-box" + HotBar.currentActive).addClass("hotbar-box-active");
            itemDetails(HotBar.currentActive);
        }
        else{ 
            HotBar.currentActive--;
            if(HotBar.currentActive == 0)
            {
                HotBar.currentActive = 8;
            }
            $("li.hotbar-box-active").removeClass("hotbar-box-active");
            $("li#hotbar-box" + HotBar.currentActive).addClass("hotbar-box-active");
            itemDetails(HotBar.currentActive);
        }
        //console.log(HotBar.currentActive);
    }
}
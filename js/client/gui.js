var ResourceTypes = {
    wood: 1,
    stone: 2,
    metal: 3,
    petrol: 4
}

var ResourceManager = {

    resources : [0,0,0,0,0,0],

    counters: {},

    init : function(){
        // to implement metal
        this.counters.wood = document.getElementById("res_wood");
        this.counters.stone = document.getElementById("res_stone");
        this.counters.metal = document.getElementById("res_iron");
        this.counters.petrol = document.getElementById("res_petrol");

        this.setResourceCount( ResourceTypes.wood, 7);
        this.setResourceCount( ResourceTypes.stone, 7);
        this.setResourceCount( ResourceTypes.metal, 2);
        this.setResourceCount( ResourceTypes.petrol, 1);
    },

    setResourceCount : function( type, count ) {
        switch( type ){
            case ResourceTypes.wood:
                this.resources[ResourceTypes.wood] = count;
                this.counters.wood.innerHTML = count.toString();
                break;
            case ResourceTypes.stone:
                this.resources[ResourceTypes.stone] = count;
                this.counters.stone.innerHTML = count.toString();
                break;
            case ResourceTypes.metal:
                this.resources[ResourceTypes.metal] = count;
                this.counters.metal.innerHTML = count.toString();
                break;
            case ResourceTypes.petrol:
                this.resources[ResourceTypes.petrol] = count;
                this.counters.petrol.innerHTML = count.toString();
                break;
        }
    },

    getResourceCount : function (type)
    {
        switch( type ){
            case ResourceTypes.wood:
                return this.resources[ResourceTypes.wood];
                break;
            case ResourceTypes.stone:
                return this.resources[ResourceTypes.stone];
                break;
            case ResourceTypes.metal:
                return this.resources[ResourceTypes.metal];
                break;
            case ResourceTypes.petrol:
                return this.resources[ResourceTypes.petrol];
                break;
        }
        return 0;
    },

    getResourceCount : function ( type ){
        return this.resources[type];
    }

}

ResourceManager.init();

// Minimum graphical interface
var upperDiv = document.getElementById("info");
function setDiv( text ) { upperDiv.innerHTML = text; }
function logDiv( text ) { upperDiv.innerHTML += text + "<br>"; }

// this is the login div
var middleDiv = document.getElementById("middle");
var usernameField = document.getElementById("username");

var LoginFunctionality = {

    sendNickname : function(){
        //alert("hello")
        CONTROLLER_DISABLED = false;
        middleDiv.style.display = "none";
        let nickname = usernameField.value;
        //alert(nickname)
        SceneManager.nickname = nickname;
        socket.emit("sendNickname", nickname);
    }
}

//middleDiv.style.display = "none"; 
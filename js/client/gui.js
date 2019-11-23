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
        this.counters.petrol = document.getElementById("res_petrol");

        this.setResourceCount( ResourceTypes.wood, 100 );
        this.setResourceCount( ResourceTypes.petrol, 150 );
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

//middleDiv.style.visibility = "hidden"; 
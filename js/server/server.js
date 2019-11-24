// Require necessary modules
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var admin = require("./admin.js");

var mapseed = 1004; // i love this seed

var Generator = require("../shared/terraingenerator.js")

admin.notify("Server booted");


// WARNING : HARDCODED TO MATCH THE CLIENT VALUE
var waterlevel = 202;

// For serverside checks
console.log("Generating terrain...");
var heightmap = Generator.generateTerrain(mapseed);
var initialTotemMap = Generator.generateTotemMap(heightmap,mapseed);
console.log("Done!");

var totemMap = []; // a clone of the initial, the initial one is left unaltered for keeping track of changes
// note : The generator can recompute amy specific tile, but caching is faster
// if ram explodes, switch to computing each tile every time

var ownerMap = []; // world-size matrix to keep track of ownerships

var deltaBuffer = []; // delta data for people that join later, useful for spectate mode

/*
var OwnershipManager = {
	ownerIDCounter : 1,
	owners: {},
	reverseOwners: {},

	getOwnerFromID : function( socketID ){
		return owners[socketID];
	},

	registerOwner : function ( socketID ){
		this.owners[socketID] = ownerIDCounter;
		this.reverseOwners[this.ownerIDCounter] = socketID;
		this.ownerIDCounter += 1;
		return this.owners[socketID];
	}
}*/

for ( let x = 0; x < Generator.WORLD_WIDTH; x++ ){
	totemMap[x] = [];
	ownerMap[x] = [];
	for ( let y = 0; y < Generator.WORLD_HEIGHT; y++ ){
		totemMap[x][y] = initialTotemMap[x][y];
		ownerMap[x][y]= "none";
	}
}

// This objects holds data about the available places on the map, for spawning
var SpawnManager = {
	maximumLevelDifference: 30, // Maximum level difference between water level and possible spawn locations
	waterLevelOffset: 5, // ( starting from waterlevel + waterLevelOffset, people can spawn ) ( keeps some distance from the actual water )

	availableSpaces: [], // available places ( as coordinates x/y )

	marginoffset : 10,

	// Computes the spaces available to spawn at
	computeAvailableSpaces : function (){
		this.availableSpaces = []; // wipe the other array
		for ( let x = this.marginoffset; x < Generator.WORLD_WIDTH - this.marginoffset; x++ ){
			for ( let y = this.marginoffset; y < Generator.WORLD_HEIGHT - this.marginoffset; y++ ){
				// if the current tile is between the minimum and maximum water levels, people can spawn there
				if ( heightmap[x][y] > waterlevel + this.waterLevelOffset && heightmap[x][y] < waterlevel + this.maximumLevelDifference + this.waterLevelOffset ){
					this.availableSpaces.push( { x: x, y: y } );
				}
			}
		}
	},

	dispatchSpawnPoint : function(){
		// randum = random in range : 0 - availableSpaces.length
		let randnum = Math.floor(Math.random() * this.availableSpaces.length);

		let spawnpoint = this.availableSpaces[randnum];

		// remove from availableSpaces
		this.availableSpaces.splice(randnum, 1);

		return spawnpoint;
	}
}

SpawnManager.computeAvailableSpaces();

// Some sort of getters and setters for the map, that compute deltas
function placeTotem( x, y, type, owner ){ // owner will be the socketID
	totemMap[x][y] = type;
	deltaBuffer = deltaBuffer.filter(function (entry) { return  !(entry.x == x && entry.y == y); });
	ownerMap[x][y] = owner;

	
	if ( initialTotemMap[x][y] != totemMap[x][y] ){
		deltaBuffer.push( {x:x,y:y,type:type, owner:owner} );
	}
	//console.log(deltaBuffer);
}

function removeTotem( x, y ){
	totemMap[x][y] = 0;
	ownerMap[x][y] = "none";

	deltaBuffer = deltaBuffer.filter(function (entry) { return !(entry.x == x && entry.y == y); });
	
	if ( initialTotemMap[x][y] != 0 ){
		deltaBuffer.push( {x:x,y:y,type:0, owner:"none"} );
	}
	
	//console.log(deltaBuffer);
}

app.get('/', function(req, res){
  //res.sendFile(__dirname + '/index.html');
  res.send("Blaze Project SocketIO server");
});

http.listen(port, function(){
  console.log('Listening on *:' + port);
});

io.on('connection', function(socket){
	
	console.log("User connected! " + socket.id.toString());
	admin.notify("User connected!");

	socket.emit("setOwnerID", socket.id);

	socket.on('requestseed', function(msg){
		console.log("Serving seed");
		socket.emit('mapseed', mapseed);

		let newpoint = SpawnManager.dispatchSpawnPoint();
		socket.emit('setSpawnPoint', newpoint.x, newpoint.y );
		console.log("Requested spawnpoint at " + newpoint.x + ' ' + newpoint.y );


	});

	socket.on('sendNickname', function(nickname){
		console.log ( "socket " + socket.id + ' nickname : ' + nickname )
		socket.broadcast.emit('playerNickname',socket.id,nickname)
	});
	
	socket.on('requestdeltas', function(){
		if ( deltaBuffer.length > 0 ){
			console.log("Serving deltas. size : " + deltaBuffer.length);
			socket.emit("deltas",deltaBuffer);
		}
	});
	
	socket.on('placeTotem', function(x,y,type ,notOwned){
		//console.log("placed totem " + type + " at coords : " + x + " " + y);
		placeTotem( x, y,type, socket.id );
		//console.log( x + ' ' + y + ' ' + type + ' ' + socket.id);
		if ( notOwned ){
			socket.broadcast.emit('placeTotem',x,y,type, "none");
		}else{
			socket.broadcast.emit('placeTotem',x,y,type, socket.id);
		}

	});
	
	socket.on('removeTotem', function(x,y){
		//console.log("removed totem at coords : " + x + " " + y);
		removeTotem(x,y);
		socket.broadcast.emit('removeTotem',x,y);
	});
	
	socket.on("disconnect", function(){
		console.log("User disconnected!")
		admin.notify("User disconnected!");
	});
	
});


var serverString;
if ( typeof TEST_ENVIRONMENT !== 'undefined' ){ // config.js
	serverString = "http://localhost:3000";
}
else{
	serverString = "https://blaze.glitch.me";
}

var socket = io( serverString, {
    reconnection: false
});

logDiv( "Connecting to server "  + serverString + " .. " );

socket.on('connect_error', (error) => {
	console.log("ERROR : Couldn't connect to server!");
	logDiv ("Failed to connect to server");
	
	if ( TotemLoader.loaded ) {
		heightmap = Generator.generateTerrain(1004);
		totemMap = Generator.generateTotemMap(heightmap,1004);
		SceneManager.build(heightmap,totemMap);
		//alert("Server seems offline. generated offline mode map")
		setDiv ( "Server seems offline. generated offline mode map<br>" );
		logDiv("Controls : click, shift-click, W,A,S,D to exit spectate mode!");
	}else {
		mapseed = 1004;
	}
	
});

socket.on('connect', () => {
	console.log("Connected to server : " + socket.connected); // true
	logDiv ("Connected to server!");
	socket.emit("requestseed");
});

socket.on('mapseed', function(seed){
	console.log("Received map seed " + seed);
	
	mapseed = seed;
	
	if ( TotemLoader.loaded && worldBuilt == false ) {
		worldBuilt = true;
		heightmap = Generator.generateTerrain(mapseed);
		totemMap = Generator.generateTotemMap(heightmap,mapseed);
		SceneManager.build(heightmap,totemMap);
		
		setDiv ("Connected to server!<br>");
		logDiv ("Controls : click, shift-click, W,A,S,D to exit spectate mode!");
		
		socket.emit("requestdeltas");
	}
});

//socket.broadcast.emit('playerNickname',socket.id,nickname)
socket.on('playerNickname', function(socketid, nick){
	playerNicknames[socketid] = nick;
});

socket.on("setOwnerID", function(socketID) {
	console.log("Received owner id : " + socketID);
	SceneManager.ownerID = socketID;
})

socket.on('setSpawnPoint', function( x, y ){
	SceneManager.addTotem( x, y, TotemTypes.house2, true );
	socket.emit( "placeTotem", x, y, TotemTypes.house2 );
	console.log("Spawnpoint set at " + x + ' ' + y );

	spectateMode = false;

	let currentX = -2125+(x+5)*50
	let currentY = -2125+(y+5)*50

	camera.position.x = currentX;
	camera.position.z = currentY;
	camera.position.y = 700;
	camera.lookAt( currentX-250, 0 , currentY-250 );
})

socket.on('placeTotem', function(x,y,type, owner){
	if ( owner == "none" )
		SceneManager.addTotem( x, y, type, true, true );
	else{
		SceneManager.addTotem( x, y, type, true );
	}
	
	SceneManager.ownerMap[x][y] = owner;
});

socket.on('setTotem', function(x,y,type, owner){
	if ( owner == "none" )
		SceneManager.setTotem( x, y, type, true, true );
	else{
		SceneManager.setTotem( x, y, type, true );
	}
	SceneManager.ownerMap[x][y] = owner;
});

//io.emit("waterLevel",waterlevel)

socket.on("waterLevel",function(level){
	SceneManager.waterlevel = level;
	var waterSmoothInterval = setInterval(function(){
		if ( SceneManager.plane.position.y < SceneManager.waterlevel ){
			SceneManager.plane.position.set(0,SceneManager.plane.position.y+1,0);
		}else{
			clearInterval(waterSmoothInterval);
		}
		
	},100)
	
})


socket.on("launchedProjectile",function(sX,sY,tX,tY) {
	launchProjectile(sX,sY,tX,tY);
})

socket.on("setForcedWaterLevel",function(level){
	SceneManager.waterlevel = level;
	SceneManager.plane.position.set(0,level,0);
})

//io.emit("waveTimer", serverTimer)

socket.on("waveTimer",function(serverTimer){
	setTime(serverTimer)
})

socket.on('removeTotem', function(x,y){
	SceneManager.removeTotem( x, y, true );
	SceneManager.ownerMap[x][y] = "none";
});

socket.on('deltas', function(deltaBuffer){
	console.log(deltaBuffer)
	for ( let i = 0; i < deltaBuffer.length; i++ ){
		SceneManager.setTotem( deltaBuffer[i].x, deltaBuffer[i].y, deltaBuffer[i].type );
		if ( deltaBuffer[i].owner ){
			SceneManager.ownerMap[deltaBuffer[i].x][deltaBuffer[i].y] = deltaBuffer[i].owner;
		}else{
			SceneManager.ownerMap[deltaBuffer[i].x][deltaBuffer[i].y] = "none";
		}
		
	}
	console.log("Received and applied deltas (" + deltaBuffer.length + " changes )");
});
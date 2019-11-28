var HotBar = {
	currentActive : 1,
	hotbarMapping : [ TotemTypes.empty, TotemTypes.house1, TotemTypes.lumber1, TotemTypes.mine, TotemTypes.petrol, TotemTypes.nuclearplant, TotemTypes.cannon, TotemTypes.tower, TotemTypes.sappling ],

	// this returns a TotemType
	getCurrentActive : function(){
		return this.hotbarMapping [ this.currentActive ];
	}
}

var lastCheckX = null
var lastCheckY = null

function checkIfTotemInRange( x, y, type, range ){
	for ( let itx = x-range; itx <= x + range; itx++ ){
		for ( let ity = y-range; ity <= y+ range; ity++ ){
			if ( SceneManager.totemMap[itx][ity] == type ){
				lastCheckX = itx;
				lastCheckY = ity;
				return true;
			}
		}
	}
	return false;
}

function checkIfFriendlyTotemInRange( x, y, range ){
	for ( let itx = x-range; itx <= x + range; itx++ ){
		for ( let ity = y-range; ity <= y+ range; ity++ ){
			if ( SceneManager.ownerMap[itx][ity] == SceneManager.ownerID ){
				return true;
			}
		}
	}
	return false;
}

// This is used for the login screen thing
var CONTROLLER_DISABLED = true;

function onDocumentMouseMove( event ) {

	if ( CONTROLLER_DISABLED ) { return; }

	event.preventDefault();
	
	mouse.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );
	raycaster.setFromCamera( mouse, camera );
	
	var intersects = raycaster.intersectObjects( objects );
	
	if ( intersects.length > 0 ) {
		var intersect = intersects[ 0 ];
			
		let pos = new THREE.Vector3();
		pos.copy( intersect.point ).add( intersect.face.normal );
		pos.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );
		
		let tX = ( pos.x + 2125 ) / 50;
		let tZ = ( pos.z + 2125 ) / 50;

		//selectionCylinder.material.color.setHex(0xff0000);

		//console.log(tX + ' ' + tZ )
		if ( SceneManager.ownerMap[tX][tZ] == "none" ){
			//let own = SceneManager.ownerMap;
			//debugger;
			selectionCylinder.material.color.setHex(0xffff00);
		}else if ( SceneManager.ownerMap[tX][tZ] == SceneManager.ownerID ){
			//let own = SceneManager.ownerMap[tX][tZ];
			//console.log(SceneManager.ownerMap);
			//debugger;
			selectionCylinder.material.color.setHex(0x00ff00);
		}else{
			selectionCylinder.material.color.setHex(0xff0000);
		}
		
		selectionCylinder.position.set(pos.x,heightmap[tX][tZ]+30,pos.z);
	}
}

/*
var ResourceTypes = {
    wood: 1,
    stone: 2,
    metal: 3,
    petrol: 4
}
*/

var RecipeManager = {
	recipes:{
		house: [0,10,0,0,0],
		lumberjack: [0,15,1,0,0],
		mine: [0,20,1,0,0],
		gasWell: [0,10,10,0,0],
		factory: [0,5,15,2,0],
		cannon: [0,10,10,10,0],
		tower: [0,5,5,10,0],
		sapling: [0,1,0,0,0]
	},

	gotMaterial : function( recipe ){
		for ( let i = 1; i <= 4; i++ ){
			if ( ResourceManager.getResourceCount(i) < recipe[i] ){
				return false;
			}
		}
		return true;
	},

	consumeMaterial : function( recipe ){
		for ( let i = 1; i <= 4; i++ ){
			if ( recipe[i] > 0 ){
				ResourceManager.setResourceCount(i,ResourceManager.getResourceCount(i)-recipe[i])
			}
		}
	}

}

var cannonballs = []

function moveCannonballs(){
	for ( let i = 0; i < cannonballs.length; i++ ){

		if ( cannonballs[i].firingDirection == "up" ){
			cannonballs[i].position.y += cannonballs[i].ballspeed;
			if ( cannonballs[i].position.y > cannonballs[i].targetHeightUp ){
				//scene.remove(cannonballs[i])
				//cannonballs.splice(i,1);
				cannonballs[i].firingDirection = "down";
				cannonballs[i].position.x = -2125+cannonballs[i].tX*50;
				cannonballs[i].position.z = -2125+cannonballs[i].tY*50;
			}
		}else{
			cannonballs[i].position.y -= cannonballs[i].ballspeed;
			if ( cannonballs[i].position.y < cannonballs[i].targetHeightDown ){
				scene.remove(cannonballs[i])
				cannonballs.splice(i,1);
			}
		}

	}
}



function launchProjectile( sX, sY, tX, tY, responsibleForRemove ){

	// Set timeout to destroy the attacked building
	if ( responsibleForRemove ){
		setTimeout( function( targetX, targetY ){
			SceneManager.removeTotem(targetX,targetY)
			socket.emit("removeTotem",targetX,targetY)
		}, 3000, tX, tY )
	}

	// Create cannonball and animate it in the loop

	let cannonballGeometry = new THREE.SphereGeometry( 5, 32, 32 );
	let cannonballMaterial = new THREE.MeshBasicMaterial( {color: 0x333333, side: THREE.DoubleSide} );
	var sphere = new THREE.Mesh( cannonballGeometry, cannonballMaterial );
	//voxel.position.set(-2125+x*50,height,-2125+y*50);
	sphere.position.x = -2125+sX*50;
	sphere.position.y = heightmap[sX][sY]+25;
	sphere.position.z = -2125+sY*50;

	sphere.tX = tX;
	sphere.tY = tY;
	sphere.targetHeightUp = sphere.position.y + 300;
	sphere.targetHeightDown = heightmap[tX][tY]+25;
	sphere.ballspeed = ( 300 + 300 + heightmap[sX][sY]+25 - heightmap[tX][tY]-25 )/80;
	sphere.firingDirection = "up";

	scene.add( sphere );

	cannonballs.push(sphere);

}

function onDocumentMouseDown( event ) {

	if ( CONTROLLER_DISABLED ) { return; }
	
	//console.log( event.srcElement.nodeName )
	//if (event.srcElement.nodeName !== 'INPUT') {
	//if (!event.srcElement.classList.contains("GUI2D")) {
		
	event.preventDefault();
	
	mouse.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );
	raycaster.setFromCamera( mouse, camera );
	
	var intersects = raycaster.intersectObjects( objects );
	
	if ( intersects.length > 0 ) {
		
		var intersect = intersects[ 0 ];
		
		if ( isShiftDown ) { // right click is pressed ( you are trying to dig )
			let tX = ( intersect.object.position.x + 2125 ) / 50;
			let tZ = ( intersect.object.position.z + 2125 ) / 50;

			if ( !isCooldownReady() ){
				additionalText.displayText("Wait for the cooldown to finish!");
			}else{

				switch( SceneManager.totemMap[tX][tZ] ){
					case TotemTypes.petrol:
						setCooldown(3000, "Extractig oil...")
						var oilCount = ResourceManager.getResourceCount(ResourceTypes.petrol);
						oilCount = oilCount + Math.floor(Math.random() * 2) + 4;
						ResourceManager.setResourceCount(ResourceTypes.petrol, oilCount);

						break;
					case TotemTypes.forest:
						if ( checkIfTotemInRange(tX,tZ,TotemTypes.lumber1, 4) ){ // if there is a lumberjack nearby
							// cut the forest
								//ResourceManager.

								SceneManager.removeTotem( tX, tZ, true );
								socket.emit("removeTotem",tX,tZ);

								setCooldown(3000, "Cutting Forest...")

								var woodCount = ResourceManager.getResourceCount(ResourceTypes.wood);
								woodCount = woodCount + Math.floor(Math.random() * 2) + 4;
								ResourceManager.setResourceCount(ResourceTypes.wood, woodCount);

						}else {
							// set warning that you're trying to cut forest too far away
							additionalText.displayText("You're trying to cut a forest too far away from a lumberjack");
						}
						break;
					case TotemTypes.rocky:
						if ( checkIfTotemInRange(tX,tZ,TotemTypes.mine, 4) ){ // if there is a lumberjack nearby
							SceneManager.removeTotem( tX, tZ, true );
							socket.emit("removeTotem",tX,tZ);

							setCooldown(3000, "Mining Rocks...")

							var stoneCount = ResourceManager.getResourceCount(ResourceTypes.stone);
							stoneCount = stoneCount + Math.floor(Math.random() * 4) + 6;
							ResourceManager.setResourceCount(ResourceTypes.stone, stoneCount);
						}else {
							// set warning that you're trying to cut forest too far away
							additionalText.displayText("You're trying to mine rocks too far away from a mine");
						}

						break;

					case TotemTypes.nuclearplant:
							var metalcount = ResourceManager.getResourceCount(ResourceTypes.metal);
							
						if(ResourceManager.getResourceCount(ResourceTypes.stone) >= 1){		
							setCooldown(3000, "Smelting metal...");

							metalcount += 1;

							ResourceManager.setResourceCount(ResourceTypes.stone, (ResourceManager.getResourceCount(ResourceTypes.stone) - 1));
							ResourceManager.setResourceCount(ResourceTypes.metal, metalcount);
						}
						else {
							// set warning that you're trying to cut forest too far away
							additionalText.displayText("You don't have enough ore");
						}
							break;
					// default:
					// 	SceneManager.removeTotem( tX, tZ, true );
					// 	socket.emit("removeTotem",tX,tZ);
				}

			}
			

			
		} else { // left click is pressed
			let pos = new THREE.Vector3();
			pos.copy( intersect.point ).add( intersect.face.normal );
			pos.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );
			
			let tX = ( pos.x + 2125 ) / 50;
			let tZ = ( pos.z + 2125 ) / 50;
			
			/*
			if ( Math.random() > 0.5 ){
				SceneManager.addTotem( tX, tZ, TotemTypes.forest, true );
				socket.emit("placeTotem",tX,tZ, TotemTypes.forest);
			}
			else if ( Math.random() > 0.1 ) {
				SceneManager.addTotem( tX, tZ, TotemTypes.rocky, true );
				socket.emit("placeTotem",tX,tZ, TotemTypes.rocky);
			}else {
				SceneManager.addTotem( tX, tZ, TotemTypes.residential, true );
				socket.emit( "placeTotem", tX, tZ, TotemTypes.residential );
			}*/

			if ( SceneManager.totemMap[tX][tZ] != TotemTypes.empty ){

				if ( SceneManager.ownerMap[tX][tZ] != "none" ){
					if ( SceneManager.ownerMap[tX][tZ] != SceneManager.ownerID ) {// if the clicked thing is not oursx
						if ( checkIfTotemInRange(tX,tZ,TotemTypes.cannon, 8) ){
							// if there is an available cannon in range
							// taraneala pe lastCheckX, lastCheckY
							if(ResourceManager.getResourceCount(ResourceTypes.petrol) >= 5){
								launchProjectile(lastCheckX,lastCheckY, tX, tZ, true);
								socket.emit( "launchProjectile", lastCheckX, lastCheckY, tX, tZ );
								ResourceManager.setResourceCount(ResourceTypes.petrol, ResourceManager.getResourceCount(ResourceTypes.petrol) - 5);
							}
							else{ 
								additionalText.displayText("You don't have enough oil!");
							}

							// Also... check for a recipe and consume materials
						}else{
							additionalText.displayText("No available cannon nearby!");
						}
					}else{
						additionalText.displayText("Cannot place over existing objects!");
					}
				}

				
			}else{
				if ( heightmap[tX][tZ] < SceneManager.waterlevel-25 ){
					additionalText.displayText("You're attempting to place underwater!");
				}else{
					if ( !isCooldownReady() ){
						additionalText.displayText("Wait for the cooldown to finish!");
					}else{

						// Checks if you're attempting to build in a range of maximum 5 meters from a nearby structure you own
						if ( !checkIfFriendlyTotemInRange( tX, tZ, 5 ) ){
							additionalText.displayText("Too far away from your structures!");
						}else{

							let totemtype = HotBar.getCurrentActive();

							switch( totemtype ){
								case TotemTypes.house1:
										if ( RecipeManager.gotMaterial( RecipeManager.recipes.house ) ){
											SceneManager.addTotem( tX, tZ, totemtype, true ); // animated, not owned ( last true, true )
											socket.emit( "placeTotem", tX, tZ, totemtype); // not owned
											//additionalText.displayText("You need ");
											RecipeManager.consumeMaterial( RecipeManager.recipes.house );
											setCooldown(3000, "Building house...");
										}else{
											additionalText.displayText("Not enough resources to build a house!");
										}
									break;
								case TotemTypes.mine:
										if ( RecipeManager.gotMaterial( RecipeManager.recipes.mine ) ){
											SceneManager.addTotem( tX, tZ, totemtype, true ); // animated, not owned ( last true, true )
											socket.emit( "placeTotem", tX, tZ, totemtype); // not owned
											//additionalText.displayText("You need ");
											RecipeManager.consumeMaterial( RecipeManager.recipes.mine );
											setCooldown(3000, "Digging mine...");
										}else{
											additionalText.displayText("Not enough resources to dig a mine!");
										}
									break;
								case TotemTypes.petrol:
									if ( RecipeManager.gotMaterial( RecipeManager.recipes.gasWell ) ){
										SceneManager.addTotem( tX, tZ, totemtype, true ); // animated, not owned ( last true, true )
										socket.emit( "placeTotem", tX, tZ, totemtype); // not owned
										//additionalText.displayText("You need ");
										RecipeManager.consumeMaterial( RecipeManager.recipes.gasWell );
										setCooldown(3000, "Assembling gas well...");
									}else{
										additionalText.displayText("Not enough resources to assemble a gas well!");
									}
									break;
					
								case TotemTypes.nuclearplant:
										if ( RecipeManager.gotMaterial( RecipeManager.recipes.factory ) ){
											SceneManager.addTotem( tX, tZ, totemtype, true ); // animated, not owned ( last true, true )
											socket.emit( "placeTotem", tX, tZ, totemtype); // not owned
											//additionalText.displayText("You need ");
											RecipeManager.consumeMaterial( RecipeManager.recipes.factory );
											setCooldown(3000, "Building factory...");
										}else{
											additionalText.displayText("Not enough resources to build a factory!");
										}
									break;
								case TotemTypes.cannon:
									if ( RecipeManager.gotMaterial( RecipeManager.recipes.cannon ) ){
										SceneManager.addTotem( tX, tZ, totemtype, true ); // animated, not owned ( last true, true )
										socket.emit( "placeTotem", tX, tZ, totemtype); // not owned
										//additionalText.displayText("You need ");
										RecipeManager.consumeMaterial( RecipeManager.recipes.cannon );
										setCooldown(3000, "Building a cannon...");
									}else{
										additionalText.displayText("Not enough resources to build a cannon!");
									}
								break;
								case TotemTypes.tower:
									if ( RecipeManager.gotMaterial( RecipeManager.recipes.tower ) ){
										SceneManager.addTotem( tX, tZ, totemtype, true ); // animated, not owned ( last true, true )
										socket.emit( "placeTotem", tX, tZ, totemtype); // not owned
										//additionalText.displayText("You need ");
										RecipeManager.consumeMaterial( RecipeManager.recipes.tower );
										setCooldown(3000, "Building tower...");
									}else{
										additionalText.displayText("Not enough resources to build a tower!");
									}
								break;
								case TotemTypes.lumber1:
									if ( RecipeManager.gotMaterial( RecipeManager.recipes.lumberjack ) )
									{
										SceneManager.addTotem( tX, tZ, totemtype, true );
										socket.emit( "placeTotem", tX, tZ, totemtype );
										//additionalText.displayText("You need ");
										RecipeManager.consumeMaterial( RecipeManager.recipes.lumberjack );
										setCooldown(3000, "Building Lumberjack...");
										//ResourceManager.setResourceCount(ResourceTypes.wood, ResourceManager.getResourceCount(ResourceTypes.wood) - 4);
										//ResourceManager.setResourceCount(ResourceTypes.stone, ResourceManager.getResourceCount(ResourceTypes.stone) - 2);
										//let debug = ResourceManager.resources;
										//debugger;
									}else{
										additionalText.displayText("Not enough resources for lumberjack!");
									}

									break;
								case TotemTypes.sappling:
									if ( RecipeManager.gotMaterial( RecipeManager.recipes.sapling ) ){
										SceneManager.addTotem( tX, tZ, totemtype, true, true ); // animated, not owned ( last true, true )
										socket.emit( "placeTotem", tX, tZ, totemtype, true ); // not owned
										//additionalText.displayText("You need ");
										RecipeManager.consumeMaterial( RecipeManager.recipes.sapling );
										setCooldown(3000, "Planting tree...");
									}else{
										additionalText.displayText("Not enough resources to plant tree!");
									}

									break;	
								default:
									//addTotemInList(totemtype, tX, tZ);
									SceneManager.addTotem( tX, tZ, totemtype, true );
									socket.emit( "placeTotem", tX, tZ, totemtype );
									setCooldown(3000, "Building...")
							}
						}
					}
				}
			}
			
		}
	}
}

var isLeftDown = false;
var isRightDown = false;
var isUpDown = false; // very inspiring, what can i say
var isDownDown = false;
var isShiftDown = false;



function onDocumentKeyDown( event ) {

	if ( CONTROLLER_DISABLED ) { return; }

	switch ( event.keyCode ) {
		case 16: isShiftDown = true; break;

		case 38: /*up*/
		case 87: /*W*/
			isUpDown = true;
		break;

		case 37: /*left*/
		case 65: /*A*/
			isLeftDown = true;
		break;

		case 40: /*down*/
		case 83: /*S*/
			isDownDown = true;
		break;

		case 39: /*right*/
		case 68: /*D*/
			isRightDown = true;
			//scoreboard.addScore("vasile", 420);
		break;

		case 82: /*R*/ this.moveUp = true;
		//renderScoreBoard();
		break;
		case 70: /*F*/ this.moveDown = true;
		//scoreboard.addScore("ion", 69); 
		break;

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
	}

}

function onDocumentKeyUp( event ) {

	if ( CONTROLLER_DISABLED ) { return; }

	switch ( event.keyCode ) {
		case 16: isShiftDown = false; break;

		case 38: /*up*/
		case 87: /*W*/
			isUpDown = false;
		break;

		case 37: /*left*/
		case 65: /*A*/
			isLeftDown = false;
		break;

		case 40: /*down*/
		case 83: /*S*/
			isDownDown = false;
		break;

		case 39: /*right*/
		case 68: /*D*/
			isRightDown = false;
		break;

		case 82: /*R*/ this.moveUp = true; break;
		case 70: /*F*/ this.moveDown = true; break;

	}

}

function onDocumentWheel ( event ){
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
	console.log(HotBar.currentActive);
}

var spectateMode = true;

let targetTurn = 0;

let vectorup = new THREE.Vector3(0,1,0);
let vectorright = new THREE.Vector3(1,0,0);

let speed = new THREE.Vector3(0,0,0);

//camera.position.x -= 1000;
//camera.position.z -= 300;


function processInput() {

	if ( CONTROLLER_DISABLED ) { return; }
	
	if ( spectateMode ){
		camera.lookAt( 0, 0, 0 );
		camera.translateX( +3 );
	}else{
		camera.lookAt( camera.position.x+Math.sin(targetTurn)*10, camera.position.y, camera.position.z+Math.cos(targetTurn)*10 );
		// camera.rotateOnAxis ( vectorright, );
		// camera.rotateOnWorldAxis ( vectorup,-mouse.x/50 );

		camera.rotation.x = 215 * Math.PI / 180;
		camera.position.y = 800;
	}
	
	if ( spectateMode && ( isLeftDown || isRightDown || isUpDown || isDownDown ) ){
		spectateMode = false;
		camera.rotation.x = 0;
		camera.rotation.y = 0;
		camera.rotation.z = 0;
	}
	
	if ( isLeftDown ){
		//targetTurn += 0.01;
		//camera.rotateOnWorldAxis ( vectorup,0.01 );
		//camera.translateX( -3 );
		speed.x -= 0.6;
	}else if ( isRightDown ){
		//targetTurn -= 0.01;
		//camera.rotateOnWorldAxis ( vectorup,-0.01 );
		speed.x += 0.6;
	}else if ( isUpDown ){
		//camera.translateZ( -3 );
		speed.z -= 0.6;
	}else if ( isDownDown ){
		//camera.translateZ( +3 );
		speed.z += 0.6;
	}

	camera.translateX(speed.x);
	camera.translateZ(speed.z);
	
	speed.multiplyScalar(0.9);
	
	// if ( speed.length() > 0.0001 ){
	// 	let x = ( camera.position.x + 2125 ) / 50;
	// 	let y = ( camera.position.z + 2125 ) / 50;
		
	// 	let x0 = Math.floor ( x );
	// 	let y0 = Math.floor ( y );
	// 	let x1 = x0+1;
	// 	let y1 = y0+1;
		
	// 	let sx = x - x0;
	// 	let sy = y - y0;

	// 	if ( heightmap[x0] ){
	// 		if ( heightmap[x0][y0] ){ // make sure we're in bounds
	// 			let top = Perlin.lerp ( heightmap[x0][y0], heightmap[x1][y0], sx );
	// 			let bottom = Perlin.lerp ( heightmap[x0][y1], heightmap[x1][y1], sx );
	// 			let xlerp = Perlin.lerp ( top,bottom, sy );
	// 			let left = Perlin.lerp ( heightmap[x0][y0], heightmap[x0][y1], sy );
	// 			let right = Perlin.lerp ( heightmap[x1][y0], heightmap[x1][y1], sy );
	// 			let ylerp = Perlin.lerp ( left,right, sx );
	// 			let val = Perlin.lerp( xlerp, ylerp, 0.5 );
				
	// 			camera.position.y = camera.position.y*0.8 + (val+300)*0.2;
	// 		}
	// 	}
		

	// }
}
var HotBar = {
	currentActive : 1,
	hotbarMapping : [ TotemTypes.empty, TotemTypes.house1, TotemTypes.lumber1, TotemTypes.mine, TotemTypes.petrol, TotemTypes.nuclearplant, TotemTypes.cannon, TotemTypes.settlement ],

	// this returns a TotemType
	getCurrentActive : function(){
		return this.hotbarMapping [ this.currentActive ];
	}
}

function checkIfTotemInRange( x, y, type, range ){
	for ( let itx = x-range; itx <= x + range; itx++ ){
		for ( let ity = y-range; ity <= y+ range; ity++ ){
			if ( SceneManager.totemMap[itx][ity] == type ){
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

function onDocumentMouseMove( event ) {
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
		lumberjack: [0,4,2,0,0],
		mine: [0,12,1,0,0],
		//factory: [0,]
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

function onDocumentMouseDown( event ) {
	
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
					default:
						SceneManager.removeTotem( tX, tZ, true );
						socket.emit("removeTotem",tX,tZ);
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

			if ( !isCooldownReady() ){
				additionalText.displayText("Wait for the cooldown to finish!");
			}else{

				// Checks if you're attempting to build in a range of maximum 5 meters from a nearby structure you own
				if ( !checkIfFriendlyTotemInRange( tX, tZ, 5 ) ){
					additionalText.displayText("Too far away from your structures!");
				}else{

					let totemtype = HotBar.getCurrentActive();

					switch( totemtype ){
						case TotemTypes.lumber1:
							if ( RecipeManager.gotMaterial( RecipeManager.recipes.lumberjack ) )
							{
								SceneManager.addTotem( tX, tZ, totemtype, true );
								socket.emit( "placeTotem", tX, tZ, totemtype );
								//additionalText.displayText("You need ");
								RecipeManager.consumeMaterial( RecipeManager.recipes.lumberjack )
								//ResourceManager.setResourceCount(ResourceTypes.wood, ResourceManager.getResourceCount(ResourceTypes.wood) - 4);
								//ResourceManager.setResourceCount(ResourceTypes.stone, ResourceManager.getResourceCount(ResourceTypes.stone) - 2);
								//let debug = ResourceManager.resources;
								//debugger;
							}else{
								additionalText.displayText("Not enough resources for lumberjack!");
							}

							break;
						default:
							SceneManager.addTotem( tX, tZ, totemtype, true );
							socket.emit( "placeTotem", tX, tZ, totemtype );
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
			scoreboard.addScore("vasile", 420);
		break;

		case 82: /*R*/ this.moveUp = true;
		renderScoreBoard(); break;
		case 70: /*F*/ this.moveDown = true;
		scoreboard.addScore("ion", 69); break;

		case 49: /*1*/ 
			$("li.hotbar-box-active").removeClass("hotbar-box-active");
			$("li#hotbar-box1").addClass("hotbar-box-active");
			HotBar.currentActive = 1;
		break;
		case 50: /*2*/ 
			$("li.hotbar-box-active").removeClass("hotbar-box-active");
			$("li#hotbar-box2").addClass("hotbar-box-active");
			HotBar.currentActive = 2;
		break;
		case 51: /*3*/ 
			$("li.hotbar-box-active").removeClass("hotbar-box-active");
			$("li#hotbar-box3").addClass("hotbar-box-active");
			HotBar.currentActive = 3;
		break;
		case 52: /*4*/ 
			$("li.hotbar-box-active").removeClass("hotbar-box-active");
			$("li#hotbar-box4").addClass("hotbar-box-active");
			HotBar.currentActive = 4;
		break;
		case 53: /*5*/ 
			$("li.hotbar-box-active").removeClass("hotbar-box-active");
			$("li#hotbar-box5").addClass("hotbar-box-active");
			HotBar.currentActive = 5;
		break;
		case 54: /*6*/ 
			$("li.hotbar-box-active").removeClass("hotbar-box-active");
			$("li#hotbar-box6").addClass("hotbar-box-active");
			HotBar.currentActive = 6;
		break;
		case 55: /*7*/ 
			$("li.hotbar-box-active").removeClass("hotbar-box-active");
			$("li#hotbar-box7").addClass("hotbar-box-active");
			HotBar.currentActive = 7;
		break;
	}

}

function onDocumentKeyUp( event ) {
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

var spectateMode = true;

let targetTurn = 0;

let vectorup = new THREE.Vector3(0,1,0);
let vectorright = new THREE.Vector3(1,0,0);

let speed = new THREE.Vector3(0,0,0);

function processInput() {
	
	if ( spectateMode ){
		camera.lookAt( 0, 0, 0 );
		camera.translateX( +3 );
	}else{
		//camera.lookAt( camera.position.x+Math.sin(targetTurn)*10, camera.position.y+mouse.y-5, camera.position.z+Math.cos(targetTurn)*10 );
		camera.rotateOnAxis ( vectorright,mouse.y/100 );
		camera.rotateOnWorldAxis ( vectorup,-mouse.x/50 );
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
	
	if ( speed.length() > 0.0001 ){
		let x = ( camera.position.x + 2125 ) / 50;
		let y = ( camera.position.z + 2125 ) / 50;
		
		let x0 = Math.floor ( x );
		let y0 = Math.floor ( y );
		let x1 = x0+1;
		let y1 = y0+1;
		
		let sx = x - x0;
		let sy = y - y0;

		if ( heightmap[x0] ){
			if ( heightmap[x0][y0] ){ // make sure we're in bounds
				let top = Perlin.lerp ( heightmap[x0][y0], heightmap[x1][y0], sx );
				let bottom = Perlin.lerp ( heightmap[x0][y1], heightmap[x1][y1], sx );
				let xlerp = Perlin.lerp ( top,bottom, sy );
				let left = Perlin.lerp ( heightmap[x0][y0], heightmap[x0][y1], sy );
				let right = Perlin.lerp ( heightmap[x1][y0], heightmap[x1][y1], sy );
				let ylerp = Perlin.lerp ( left,right, sx );
				let val = Perlin.lerp( xlerp, ylerp, 0.5 );
				
				camera.position.y = camera.position.y*0.8 + (val+300)*0.2;
			}
		}
		

	}
}
// cubes
cubeGeo = new THREE.CubeGeometry( 50, 50, 50 );

var grassUV = [ new THREE.Vector2(0, 0.5),new THREE.Vector2(1, 0.5),new THREE.Vector2(1, 1),new THREE.Vector2(0, 1) ];
var sideUV = [ new THREE.Vector2(0, 0.5), new THREE.Vector2(0, 0),new THREE.Vector2(1, 0),new THREE.Vector2(1, 0.5) ];

// earth cubes UV Mapping

cubeGeo.faceVertexUvs[0][0] = [sideUV[0],sideUV[1],sideUV[3]];
cubeGeo.faceVertexUvs[0][1] = [sideUV[1],sideUV[2],sideUV[3]];

cubeGeo.faceVertexUvs[0][2] = [sideUV[0],sideUV[1],sideUV[3]];
cubeGeo.faceVertexUvs[0][3] = [sideUV[1],sideUV[2],sideUV[3]];

//top face
cubeGeo.faceVertexUvs[0][4] = [grassUV[0],grassUV[1],grassUV[3]];
cubeGeo.faceVertexUvs[0][5] = [grassUV[1],grassUV[2],grassUV[3]];

cubeGeo.faceVertexUvs[0][6] = [sideUV[0],sideUV[1],sideUV[3]];
cubeGeo.faceVertexUvs[0][7] = [sideUV[1],sideUV[2],sideUV[3]];

cubeGeo.faceVertexUvs[0][8] = [sideUV[0],sideUV[1],sideUV[3]];
cubeGeo.faceVertexUvs[0][9] = [sideUV[1],sideUV[2],sideUV[3]];

cubeGeo.faceVertexUvs[0][10] = [sideUV[0],sideUV[1],sideUV[3]];
cubeGeo.faceVertexUvs[0][11] = [sideUV[1],sideUV[2],sideUV[3]];


var texture = new THREE.TextureLoader().load( 'textures/atlas.png' )
texture.magFilter = THREE.NearestFilter

var texturesand = new THREE.TextureLoader().load( 'textures/sand.png' )
texturesand.magFilter = THREE.NearestFilter

var texturesnow = new THREE.TextureLoader().load( 'textures/snow.png' )
texturesnow.magFilter = THREE.NearestFilter

cubeMaterial = new THREE.MeshLambertMaterial( {  map: texture } );
cubeMaterialSand = new THREE.MeshLambertMaterial( {  map: texturesand } );
cubeMaterialSnow = new THREE.MeshLambertMaterial( {  map: texturesnow } );

var selectionCylinder;

SceneManager = {
	
	objects : [],
	totemMap : null,
	heightmap : null,
	placedTotems : null,
	ownerMap : [],
	ownerID : "none", // this is the client's owner ID ( serverside socket id )
	
	dirtyBlocks : [],
	
	init : function () {
		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color( 0xf0f0f0 );
		
		let selectionMaterial = new THREE.MeshBasicMaterial( { color: 0xffff00, opacity: 0.5, transparent: true, side: THREE.DoubleSide } );
		let cylinderGeo = new THREE.CylinderGeometry( 24, 24, 5, 32, 1, true );
		selectionCylinder = new THREE.Mesh( cylinderGeo, selectionMaterial );
		this.scene.add( selectionCylinder );
		
		var ambientLight = new THREE.AmbientLight( 0x606060 );
		this.scene.add( ambientLight );
		
		var directionalLight = new THREE.DirectionalLight( 0xffffff );
		directionalLight.position.set( 1, 0.75, 0.5 ).normalize();
		this.scene.add( directionalLight );

		for (let x = 0; x < 80; x++) {
			this.ownerMap[x] = [];
			for (let y = 0; y < 80; y++) {
				this.ownerMap[x][y] = "none";
			}
		}
	},
	
	build : function ( heightmap, totems ) {
		
		this.totemMap = totems;
		this.heightmap = heightmap;
		
		this.placedTotems = [];
		
		for (let x = 0; x < 80; x++) {
			this.placedTotems[x] = [];
			for (let y = 0; y < 80; y++) {
				this.placedTotems[x][y] = 0;
			}
		}
		
		for ( let x = 0; x < 80; x++ ){
			for ( let y = 0; y < 80; y++ ){
				let height = heightmap[x][y];
				//height = Math.floor(height/2)*2;
				
				var voxel;
				if ( height > 330 ){
                    voxel = new THREE.Mesh( cubeGeo, cubeMaterialSnow );
                }else if ( height > 200 ){
					voxel = new THREE.Mesh( cubeGeo, cubeMaterial );
				}else{
					voxel = new THREE.Mesh( cubeGeo, cubeMaterialSand );
				}
				
				voxel.position.set(-2125+x*50,height,-2125+y*50);
				this.scene.add( voxel );
				this.objects.push( voxel );
				
				voxel.matrixAutoUpdate = false;
				voxel.updateMatrix();
				
				let totemType = totems[x][y];
				
				if ( totemType != 0 ){
					
					let totem = TotemLoader.cloneMesh( totemType, height );
					
					totem.position.set(-2125+x*50,height+25,-2125+y*50);
					this.scene.add(totem);
					
					this.placedTotems[x][y] = totem;
				}
			}
		}
		
		let planeGeometry = new THREE.PlaneGeometry( 5000, 5000, 32 );
		let waterMat = new THREE.MeshBasicMaterial( {color: 0x0000ff, side: THREE.DoubleSide} );
		waterMat.opacity = 0.3;
		waterMat.transparent = true;
		let plane = new THREE.Mesh( planeGeometry, waterMat );
		this.waterlevel = 202;
		plane.position.set(0,this.waterlevel,0);
		plane.rotateX(3.14/2);
		this.scene.add( plane );
	},
	
	update : function ( delta ){
		let dirty = false;
		for ( let i = 0; i < this.dirtyBlocks.length; i++ ){
			let anim = this.dirtyBlocks[i];
			let step = 1/16;
			if ( anim[1] + step < 1 ){
				anim[1] += step;
				let scale;
				if ( anim[2] == 1 ){
					scale = anim[1]*(50/16); // linear, can use another easing function
				}else{
					scale = (1-anim[1])*(50/16);
				}
				anim[0].scale.x = scale;anim[0].scale.y = scale;anim[0].scale.z = scale;
			}else{
				// dirty flag triggers cleanup
				dirty = true;
				anim[4] = true;
				if ( anim[2] == 0 ){
					this.scene.remove( anim[0] );
					//console.log("removed");
				}else {
					anim[0].scale.x = 50/16;anim[0].scale.y = 50/16;anim[0].scale.z = 50/16;
				}
			}
		}
		if ( dirty ){
			this.dirtyBlocks = this.dirtyBlocks.filter(function (entry) { return  !(entry[4]) });
			dirty = false;
		}
	},
	
	animate : function ( totem, growing ){
		// animation entity in dirtyBlocks : [ totem, progress (0->1), growing bool, isMarkedForDeletion bool ]
		this.dirtyBlocks.push([totem,0,growing,false]); // this is the reason for which typescript sounds good
	},
	
	addTotem : function ( x, y, totemType, animated ){
		if ( this.totemMap[x][y] != 0 ){
			//console.log("Error : addTotem called on existing totem tile " + this.totemMap[x][y]);
			return;
		}
		
		this.totemMap[x][y] = totemType;
		let height = this.heightmap[x][y];
		
		let totem = TotemLoader.cloneMesh( totemType, height );
		
		totem.position.set(-2125+x*50,height+25,-2125+y*50);
		this.scene.add(totem);
		
		this.placedTotems[x][y] = totem;
		this.ownerMap[x][y] = this.ownerID;
		
		if ( animated ){
			totem.scale.x = 1/16; totem.scale.y = 1/16; totem.scale.z = 1/16;
			this.animate( totem, true );
		}
		
		//this.objects.push( totem );
		
		//console.log("added block at " + x + " " + y );
		
	},
	
	removeTotem : function ( x, y, animated ){
		
		if ( this.totemMap[x][y] != 0 ){
			this.totemMap[x][y] = 0;

			let totem = this.placedTotems[x][y];
			this.placedTotems[x][y] = 0;
			this.ownerMap[x][y] = "none";
			
			
			//this.dirtyBlocks.push([totem,0,false,false]);
			
			if ( animated ){
				this.animate( totem, false );
			}else{
				this.scene.remove( totem );
			}
			
			//this.objects.splice( objects.indexOf( totem ), 1 );
			//console.log("removed block at " + x + " " + y );
		}else{
			//console.log( "Error : attempt to remove totem at empty position " + x + " " + y );
		}
	},
	
	setTotem : function ( x, y, totemType ){
		this.removeTotem(x,y);
		if ( totemType != 0 ){
			this.addTotem(x,y,totemType);
		}
	}
};

SceneManager.init();
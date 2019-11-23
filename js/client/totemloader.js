var TotemLoader = {
	
	items : ["forest","forest_snow","rocks","rocks_snow","block","samsite","house1", "lumber1", "cannon", "house2", "lumber2"],
	totems : {},
	
	loaded : false,
	loadedItems : 0,

	init : function(){
		this.loader = new THREE.GLTFLoader().setPath( 'models/' );
	},

	load : function( callback ){
		
		for ( let i = 0; i < this.items.length; i++ ){
			this.loader.load( this.items[i] + ".glb", function ( gltf ) {
				
				let totem = gltf.scene.children[0];
				totem.scale.x = 50/16;
				totem.scale.y = 50/16;
				totem.scale.z = 50/16;
				
				//console.log( "loaded : " + TotemLoader.items[i] );
				
				TotemLoader.totems[TotemLoader.items[i]] = totem;
				
				TotemLoader.loadedItems += 1;
				if ( TotemLoader.loadedItems == TotemLoader.items.length ) {
					TotemLoader.loaded = true;
					console.log ( "TotemLoader : Loaded " + TotemLoader.items.length + " totems!");
					callback();
				}
			} );
		}
	},
	
	cloneMesh : function( totemType, height ){
		let totem = null;
		
		if ( height == null ) { height = 0; }
		
		switch( totemType ){
			case TotemTypes.forest:
				if ( height < 330 ) { totem = TotemLoader.totems.forest.clone(); }
				else { totem = TotemLoader.totems.forest_snow.clone(); }
				break;
			case TotemTypes.rocky:
				if ( height < 330 ) { totem = TotemLoader.totems.rocks.clone(); }
				else { totem = TotemLoader.totems.rocks_snow.clone(); }
				break;
			case TotemTypes.residential:
				totem = TotemLoader.totems.block.clone();
				break;
			case TotemTypes.launchsite:
				totem = TotemLoader.totems.samsite.clone();
				break;
			case TotemTypes.house1:
				totem = TotemLoader.totems.house1.clone();
				break;
			case TotemTypes.lumber1:
				totem = TotemLoader.totems.lumber1.clone();
				break;
			case TotemTypes.cannon:
				totem = TotemLoader.totems.cannon.clone();
				break;
			case TotemTypes.house2:
				totem = TotemLoader.totems.house2.clone();
				break;
			case TotemTypes.lumber2:
				totem = TotemLoader.totems.lumber2.clone();
				break;
		}
		
		if ( totem == null ){
			console.log( "cloneMesh couldn't resolve totem : totemType : " + totemType + " height : " + height );
		}

		return totem;
	}
};

TotemLoader.init();


// gltf.scene.traverse( function ( child ) {
	// if ( child.isMesh ) {
		// // child.material.envMap = envMap;
	// }
// } );


/*
					
					// Instantiate a loader
var loader = new THREE.GLTFLoader();

var LOADED_TREE;

// Load a glTF resource
loader.load(
	// resource URL
	'models/tree.glb',
	// called when the resource is loaded
	function ( gltf ) {

		//scene.add( gltf.scene );
		
		console.log("LOADED TREE");
		
		//let treemesh = LOADED_TREE.scene.children[0];
		//treemesh.position.set(0,waterlevel,0);
	
		//scene.add(treemesh);
		
		LOADED_TREE = gltf;

		
		// gltf.animations; // Array<THREE.AnimationClip>
		// gltf.scene; // THREE.Scene
		// gltf.scenes; // Array<THREE.Scene>
		// gltf.cameras; // Array<THREE.Camera>
		// gltf.asset; // Object
		
		
		console.log(gltf.scene);

	},
	// called while loading is progressing
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' );

	}
);
*/
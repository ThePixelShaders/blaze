if ( WEBGL.isWebGLAvailable() === false ) {
	document.body.appendChild( WEBGL.getWebGLErrorMessage() );
}

var camera, scene, renderer;
var mouse, raycaster;

var objects = SceneManager.objects;
scene = SceneManager.scene;

var heightmap;
var totemMap;

var mapseed = null;
var worldBuilt = false;

TotemLoader.load( () => {
	if ( mapseed != null && worldBuilt == false ){
		worldBuilt = true;
		heightmap = Generator.generateTerrain(mapseed);
		totemMap = Generator.generateTotemMap(heightmap,mapseed);
		SceneManager.build(heightmap,totemMap);
		
		setDiv ("Connected to server!<br>");
		logDiv ("Controls : click, shift-click, W,A,S,D to exit spectate mode!");
		
		socket.emit("requestdeltas");
	}
});

init();

function init() {
	camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.set( 500, 800, 1300 );
	camera.lookAt( 0, 0, 0 );

	raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	document.addEventListener( 'keydown', onDocumentKeyDown, false );
	document.addEventListener( 'keyup', onDocumentKeyUp, false );
	document.addEventListener( "wheel", onDocumentWheel, false );

	window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function render() {
	processInput();
	
	SceneManager.update();
	
	renderer.render( SceneManager.scene, camera );
	window.requestAnimationFrame(render);
}
window.requestAnimationFrame(render);

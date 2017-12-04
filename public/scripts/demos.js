//////////////////////////////
///// ROTATING CUBE DEMO /////
//////////////////////////////

/*
// sets up the scene, camera and renderer
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight); 
document.body.appendChild(renderer.domElement);

// creates the spinning cube
let geometry = new THREE.BoxGeometry(1,1,1);
let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
let cube = new THREE.Mesh(geometry, material);
scene.add(cube);
camera.position.z = 5;

// renders the scene
function animate() {
	requestAnimationFrame(animate);

	// animates the cube
	cube.rotation.x += 0.1;
	cube.rotation.y += 0.1;

	renderer.render(scene, camera);
}
animate();*/

///////////////////////////////
///// DRAWING A LINE DEMO /////
///////////////////////////////

/*
// sets up the scene, camera and renderer
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
let camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight, 1, 500);
camera.position.set(0,0,100);
camera.lookAt(new THREE.Vector3(0,0,0));
let scene = new THREE.Scene();

// creates a blue line material
let material = new THREE.LineBasicMaterial({color: 0x0000ff});

// creates vertices for line
let geometry = new THREE.Geometry();
geometry.vertices.push(new THREE.Vector3(-20,0,0));
geometry.vertices.push(new THREE.Vector3(0,10,0));
geometry.vertices.push(new THREE.Vector3(10,0,0));

// creates a line
let line = new THREE.Line(geometry, material);

// adds line to the scene
scene.add(line);

// renders the scene
// renderer.render(scene, camera);
function animate() {
	requestAnimationFrame(animate);

	// animates the line
	//line.rotation.x += 0.1;
	//line.rotation.y += 0.1;
	//line.rotation.z += 0.1;

	renderer.render(scene, camera);
}
animate();*/

//////////////////////////
///// RECTANGLE DEMO /////
//////////////////////////

/*
// Grab our container div
let container = document.getElementById("container");

// Create the Three.js renderer, add it to our div
let renderer = new THREE.WebGLRenderer();
renderer.setSize(container.offsetWidth, container.offsetHeight);
container.appendChild( renderer.domElement );

// Create a new Three.js scene
let scene = new THREE.Scene();

// Create a camera and add it to the scene
let camera = new THREE.PerspectiveCamera( 45, container.offsetWidth / container.offsetHeight, 1, 4000 );
camera.position.set( 0, 0, 3.3333 );
scene.add( camera );

// Now, create a rectangle and add it to the scene
let geometry = new THREE.PlaneGeometry(1, 1);               
let mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( ) );
scene.add( mesh );

// Render it
renderer.render( scene, camera );*/

//////////////////////////////////
///// 3D ENDLESS RUNNER DEMO /////
//////////////////////////////////

/*
var sceneWidth;
var sceneHeight;
var camera;
var scene;
var renderer;
var dom;
var hero;
var sun;
var ground;
var orbitControl;

init();
function init() {
	// set up the scene
	createScene();

	//call game loop
	update();
}

function createScene(){
  sceneWidth=window.innerWidth;
  sceneHeight=window.innerHeight;
  scene = new THREE.Scene();//the 3d scene
  //scene.fog = new THREE.Fog(0x00ff00, 50, 800);//enable fog
  camera = new THREE.PerspectiveCamera( 60, sceneWidth / sceneHeight, 0.1, 1000 );//perspective camera
  renderer = new THREE.WebGLRenderer({alpha:true});//renderer with transparent backdrop
  renderer.shadowMap.enabled = true;//enable shadow
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setSize( sceneWidth, sceneHeight );
  dom = document.getElementById('TutContainer');
	dom.appendChild(renderer.domElement);
	
	//add items to scene
	var heroGeometry = new THREE.BoxGeometry( 1, 1, 1 );//cube
	var heroMaterial = new THREE.MeshBasicMaterial( { color: 0x883333 } );
	hero = new THREE.Mesh( heroGeometry, heroMaterial );
	hero.castShadow=true;
	hero.receiveShadow=false;
	hero.position.y=2;
	scene.add( hero );
	var planeGeometry = new THREE.PlaneGeometry( 5, 5, 4, 4 );
	var planeMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	ground = new THREE.Mesh( planeGeometry, planeMaterial );
	ground.receiveShadow = true;
	ground.castShadow=false;
	ground.rotation.x=-Math.PI/2;
	scene.add( ground );

	camera.position.z = 5;
	camera.position.y = 1;
	
	sun = new THREE.DirectionalLight( 0xffffff, 0.8);
	sun.position.set( 0,4,1 );
	sun.castShadow = true;
	scene.add(sun);
	//Set up shadow properties for the sun light
	sun.shadow.mapSize.width = 256;
	sun.shadow.mapSize.height = 256;
	sun.shadow.camera.near = 0.5;
	sun.shadow.camera.far = 50 ;
	
	// add these back in after you add orbit controls
	orbitControl = new THREE.OrbitControls( camera, renderer.domElement );//helper to rotate around in scene
	orbitControl.addEventListener( 'change', render );
	orbitControl.enableZoom = false;
	
	//var helper = new THREE.CameraHelper( sun.shadow.camera );
	//scene.add( helper );// enable to see the light cone
	
	window.addEventListener('resize', onWindowResize, false);//resize callback
}

function update(){
    //animate
    hero.rotation.x += 0.01;
    hero.rotation.y += 0.01;
    render();
	requestAnimationFrame(update);//request next update
}
function render(){
    renderer.render(scene, camera);//draw
}
function onWindowResize() {
	//resize & align
	sceneHeight = window.innerHeight;
	sceneWidth = window.innerWidth;
	renderer.setSize(sceneWidth, sceneHeight);
	camera.aspect = sceneWidth/sceneHeight;
	camera.updateProjectionMatrix();
}*/

//////////////////////////////////////
///// PHYSIJS ENGINE FOR THREEJS /////
//////////////////////////////////////

/*// 'use strict';
	
	// let Physijs = './js/physijs_worker';
	Physijs.scripts.worker = '../scripts/controls/physijs_worker.js';
	Physijs.scripts.ammo = 'ammo.js';
	
	var initScene, render, renderer, scene, camera, box;
	
	initScene = function() {
		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize( window.innerWidth, window.innerHeight );
		document.getElementById( 'MarioKart' ).appendChild( renderer.domElement );
		
		scene = new Physijs.Scene;
		
		camera = new THREE.PerspectiveCamera(
			35,
			window.innerWidth / window.innerHeight,
			1,
			1000
		);
		camera.position.set( 60, 50, 60 );
		camera.lookAt( scene.position );
		scene.add( camera );
		
		// Box
		box = new Physijs.BoxMesh(
			new THREE.CubeGeometry( 5, 5, 5 ),
			new THREE.MeshBasicMaterial({ color: 0x888888 })
		);
		scene.add( box );
		
		requestAnimationFrame( render );
	};
	
	render = function() {
		scene.simulate(); // run physics
		renderer.render( scene, camera); // render the scene
		requestAnimationFrame( render );
	};
	
	window.onload = initScene();*/

/////////////////////
///// TEXT DEMO /////
/////////////////////

/*if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
THREE.Cache.enabled = true;
var container, stats, permalink, hex, color;
var camera, cameraTarget, scene, renderer;
var group, textMesh1, textMesh2, textGeo, materials;
var firstLetter = true;
var text = "three.js",
	height = 20,
	size = 70,
	hover = 30,
	curveSegments = 4,
	bevelThickness = 2,
	bevelSize = 1.5,
	bevelSegments = 3,
	bevelEnabled = true,
	font = undefined,
	fontName = "helvetiker", // helvetiker, optimer, gentilis, droid sans, droid serif
	fontWeight = "bold"; // normal bold
var mirror = true;
var fontMap = {
	"helvetiker": 0,
	"optimer": 1,
	"gentilis": 2,
	"droid/droid_sans": 3,
	"droid/droid_serif": 4
};
var weightMap = {
	"regular": 0,
	"bold": 1
};
var reverseFontMap = [];
var reverseWeightMap = [];
for ( var i in fontMap ) reverseFontMap[ fontMap[i] ] = i;
for ( var i in weightMap ) reverseWeightMap[ weightMap[i] ] = i;
var targetRotation = 0;
var targetRotationOnMouseDown = 0;
var mouseX = 0;
var mouseXOnMouseDown = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var fontIndex = 1;
init();
animate();
function decimalToHex( d ) {
	var hex = Number( d ).toString( 16 );
	hex = "000000".substr( 0, 6 - hex.length ) + hex;
	return hex.toUpperCase();
}
function init() {
	container = document.createElement( 'div' );
	document.body.appendChild( container );
	permalink = document.getElementById( "permalink" );
	// CAMERA
	camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 1500 );
	camera.position.set( 0, 400, 700 );
	cameraTarget = new THREE.Vector3( 0, 150, 0 );
	// SCENE
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x000000 );
	scene.fog = new THREE.Fog( 0x000000, 250, 1400 );
	// LIGHTS
	var dirLight = new THREE.DirectionalLight( 0xffffff, 0.125 );
	dirLight.position.set( 0, 0, 1 ).normalize();
	scene.add( dirLight );
	var pointLight = new THREE.PointLight( 0xffffff, 1.5 );
	pointLight.position.set( 0, 100, 90 );
	scene.add( pointLight );
	// Get text from hash
	var hash = document.location.hash.substr( 1 );
	if ( hash.length !== 0 ) {
		var colorhash  = hash.substring( 0, 6 );
		var fonthash   = hash.substring( 6, 7 );
		var weighthash = hash.substring( 7, 8 );
		var bevelhash  = hash.substring( 8, 9 );
		var texthash   = hash.substring( 10 );
		hex = colorhash;
		pointLight.color.setHex( parseInt( colorhash, 16 ) );
		fontName = reverseFontMap[ parseInt( fonthash ) ];
		fontWeight = reverseWeightMap[ parseInt( weighthash ) ];
		bevelEnabled = parseInt( bevelhash );
		text = decodeURI( texthash );
		updatePermalink();
	} else {
		pointLight.color.setHSL( Math.random(), 1, 0.5 );
		hex = decimalToHex( pointLight.color.getHex() );
	}
	materials = [
		new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } ), // front
		new THREE.MeshPhongMaterial( { color: 0xffffff } ) // side
	];
	group = new THREE.Group();
	group.position.y = 100;
	scene.add( group );
	loadFont();
	var plane = new THREE.Mesh(
		new THREE.PlaneBufferGeometry( 10000, 10000 ),
		new THREE.MeshBasicMaterial( { color: 0xffffff, opacity: 0.5, transparent: true } )
	);
	plane.position.y = 100;
	plane.rotation.x = - Math.PI / 2;
	scene.add( plane );
	// RENDERER
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );
	// STATS
	stats = new Stats();
	//container.appendChild( stats.dom );
	// EVENTS
	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	document.addEventListener( 'touchstart', onDocumentTouchStart, false );
	document.addEventListener( 'touchmove', onDocumentTouchMove, false );
	document.addEventListener( 'keypress', onDocumentKeyPress, false );
	document.addEventListener( 'keydown', onDocumentKeyDown, false );
	document.getElementById( "color" ).addEventListener( 'click', function() {
		pointLight.color.setHSL( Math.random(), 1, 0.5 );
		hex = decimalToHex( pointLight.color.getHex() );
		updatePermalink();
	}, false );
	document.getElementById( "font" ).addEventListener( 'click', function() {
		fontIndex ++;
		fontName = reverseFontMap[ fontIndex % reverseFontMap.length ];
		loadFont();
	}, false );
	document.getElementById( "weight" ).addEventListener( 'click', function() {
		if ( fontWeight === "bold" ) {
			fontWeight = "regular";
		} else {
			fontWeight = "bold";
		}
		loadFont();
	}, false );
	document.getElementById( "bevel" ).addEventListener( 'click', function() {
		bevelEnabled = !bevelEnabled;
		refreshText();
	}, false );
	//
	window.addEventListener( 'resize', onWindowResize, false );
}
function onWindowResize() {
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}
//
function boolToNum( b ) {
	return b ? 1 : 0;
}
function updatePermalink() {
	var link = hex + fontMap[ fontName ] + weightMap[ fontWeight ] + boolToNum( bevelEnabled ) + "#" + encodeURI( text );
	permalink.href = "#" + link;
	window.location.hash = link;
}
function onDocumentKeyDown( event ) {
	if ( firstLetter ) {
		firstLetter = false;
		text = "";
	}
	var keyCode = event.keyCode;
	// backspace
	if ( keyCode == 8 ) {
		event.preventDefault();
		text = text.substring( 0, text.length - 1 );
		refreshText();
		return false;
	}
}
function onDocumentKeyPress( event ) {
	var keyCode = event.which;
	// backspace
	if ( keyCode == 8 ) {
		event.preventDefault();
	} else {
		var ch = String.fromCharCode( keyCode );
		text += ch;
		refreshText();
	}
}
function loadFont() {
	var loader = new THREE.FontLoader();
	loader.load( 'styles/fonts/' + fontName + '_' + fontWeight + '.typeface.json', function ( response ) {
		font = response;
		refreshText();
	} );
}
function createText() {
	textGeo = new THREE.TextGeometry( text, {
		font: font,
		size: size,
		height: height,
		curveSegments: curveSegments,
		bevelThickness: bevelThickness,
		bevelSize: bevelSize,
		bevelEnabled: bevelEnabled,
		material: 0,
		extrudeMaterial: 1
	});
	textGeo.computeBoundingBox();
	textGeo.computeVertexNormals();
	// "fix" side normals by removing z-component of normals for side faces
	// (this doesn't work well for beveled geometry as then we lose nice curvature around z-axis)
	if ( ! bevelEnabled ) {
		var triangleAreaHeuristics = 0.1 * ( height * size );
		for ( var i = 0; i < textGeo.faces.length; i ++ ) {
			var face = textGeo.faces[ i ];
			if ( face.materialIndex == 1 ) {
				for ( var j = 0; j < face.vertexNormals.length; j ++ ) {
					face.vertexNormals[ j ].z = 0;
					face.vertexNormals[ j ].normalize();
				}
				var va = textGeo.vertices[ face.a ];
				var vb = textGeo.vertices[ face.b ];
				var vc = textGeo.vertices[ face.c ];
				var s = THREE.GeometryUtils.triangleArea( va, vb, vc );
				if ( s > triangleAreaHeuristics ) {
					for ( var j = 0; j < face.vertexNormals.length; j ++ ) {
						face.vertexNormals[ j ].copy( face.normal );
					}
				}
			}
		}
	}
	var centerOffset = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
	textMesh1 = new THREE.Mesh( textGeo, materials );
	textMesh1.position.x = centerOffset;
	textMesh1.position.y = hover;
	textMesh1.position.z = 0;
	textMesh1.rotation.x = 0;
	textMesh1.rotation.y = Math.PI * 2;
	group.add( textMesh1 );
	if ( mirror ) {
		textMesh2 = new THREE.Mesh( textGeo, materials );
		textMesh2.position.x = centerOffset;
		textMesh2.position.y = -hover;
		textMesh2.position.z = height;
		textMesh2.rotation.x = Math.PI;
		textMesh2.rotation.y = Math.PI * 2;
		group.add( textMesh2 );
	}
}
function refreshText() {
	updatePermalink();
	group.remove( textMesh1 );
	if ( mirror ) group.remove( textMesh2 );
	if ( !text ) return;
	createText();
}
function onDocumentMouseDown( event ) {
	event.preventDefault();
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'mouseup', onDocumentMouseUp, false );
	document.addEventListener( 'mouseout', onDocumentMouseOut, false );
	mouseXOnMouseDown = event.clientX - windowHalfX;
	targetRotationOnMouseDown = targetRotation;
}
function onDocumentMouseMove( event ) {
	mouseX = event.clientX - windowHalfX;
	targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.02;
}
function onDocumentMouseUp( event ) {
	document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
	document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
	document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
}
function onDocumentMouseOut( event ) {
	document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
	document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
	document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
}
function onDocumentTouchStart( event ) {
	if ( event.touches.length == 1 ) {
		event.preventDefault();
		mouseXOnMouseDown = event.touches[ 0 ].pageX - windowHalfX;
		targetRotationOnMouseDown = targetRotation;
	}
}
function onDocumentTouchMove( event ) {
	if ( event.touches.length == 1 ) {
		event.preventDefault();
		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.05;
	}
}
//
function animate() {
	requestAnimationFrame( animate );
	render();
	stats.update();
}
function render() {
	group.rotation.y += ( targetRotation - group.rotation.y ) * 0.05;
	camera.lookAt( cameraTarget );
	renderer.clear();
	renderer.render( scene, camera );
}*/

////////////////////////
///// MINIMAP DEMO /////
////////////////////////

// MAIN
// standard global variables
var container, scene, renderer, controls, stats;
var keyboard; // = new THREEx.KeyboardState();
var clock = new THREE.Clock();
// custom global variables
var MovingCube;
var perspectiveCamera;
var mapCamera, mapWidth = 240, mapHeight = 160; // w/h should match div dimensions
init();
animate();
// FUNCTIONS 		
function init() 
{
	// SCENE
	scene = new THREE.Scene();
	// CAMERA
	var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
	var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
	// perspective cameras
	perspectiveCamera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
	perspectiveCamera.position.set(0,200,550);
	perspectiveCamera.lookAt(scene.position);
	scene.add(perspectiveCamera);
	
	// orthographic cameras
	mapCamera = new THREE.OrthographicCamera(
    window.innerWidth / -2,		// Left
    window.innerWidth / 2,		// Right
    window.innerHeight / 2,		// Top
    window.innerHeight / -2,	// Bottom
    -5000,            			// Near 
    10000 );           			// Far 
	mapCamera.up = new THREE.Vector3(0,0,-1);
	mapCamera.lookAt( new THREE.Vector3(0,-1,0) );
	scene.add(mapCamera);
	
	// RENDERER
	if ( Detector.webgl )
		renderer = new THREE.WebGLRenderer( {antialias:true} );
	else
		renderer = new THREE.CanvasRenderer(); 
	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
	container = document.getElementById( 'MarioKart' );
	container.appendChild( renderer.domElement );
	
	// EVENTS
	// THREEx.WindowResize(renderer, mapCamera);
	// THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });
	// STATS
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '0px';
	stats.domElement.style.zIndex = 100;
	container.appendChild( stats.domElement );
	// LIGHT
	var light = new THREE.PointLight(0xffffff);
	light.position.set(0,250,0);
	scene.add(light);
	// FLOOR
	// var floorTexture = new THREE.ImageUtils.loadTexture( 'images/uvgrid01.jpg' );
	// floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
	// floorTexture.repeat.set( 10, 10 );
	var floorMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.DoubleSide } );
	var floorGeometry = new THREE.PlaneGeometry(2000, 2000, 10, 10);
	var floor = new THREE.Mesh(floorGeometry, floorMaterial);
	floor.position.y = -0.5;
	floor.rotation.x = Math.PI / 2;
	scene.add(floor);
	
	////////////
	// CUSTOM //
	////////////
	
	// create an array with six textures for cube
	var materialArray = [];
	// materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/xpos.png' ) }));
	// materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/xneg.png' ) }));
	// materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/ypos.png' ) }));
	// materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/yneg.png' ) }));
	// materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/zpos.png' ) }));
	// materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/zneg.png' ) }));
	var MovingCubeMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
	var MovingCubeGeom = new THREE.CubeGeometry( 50, 50, 50, 1, 1, 1 ); //materialArray
	MovingCube = new THREE.Mesh( MovingCubeGeom, MovingCubeMat );
	MovingCube.position.set(0, 25.1, 0);
	scene.add( MovingCube );	
	
	// a little bit of scenery...
	var ambientlight = new THREE.AmbientLight(0x111111);
	scene.add( ambientlight );
	// torus knot
	var colorMaterial = new THREE.MeshLambertMaterial( { color: 0xff3333 } );
	var shape = new THREE.Mesh( new THREE.TorusKnotGeometry( 30, 6, 160, 10, 2, 5 ), colorMaterial );
	shape.position.set(-200, 50, -200);
	scene.add( shape );
	// torus knot
	var colorMaterial = new THREE.MeshLambertMaterial( { color: 0x33ff33 } );
	var shape = new THREE.Mesh( new THREE.TorusKnotGeometry( 30, 6, 160, 10, 3, 2 ), colorMaterial );
	shape.position.set(200, 50, -200);
	scene.add( shape );
	// torus knot
	var colorMaterial = new THREE.MeshLambertMaterial( { color: 0xffff33 } );
	var shape = new THREE.Mesh( new THREE.TorusKnotGeometry( 30, 6, 160, 10, 4, 3 ), colorMaterial );
	shape.position.set(200, 50, 200);
	scene.add( shape );
	// torus knot
	var colorMaterial = new THREE.MeshLambertMaterial( { color: 0x3333ff } );
	var shape = new THREE.Mesh( new THREE.TorusKnotGeometry( 30, 6, 160, 10, 3, 4 ), colorMaterial );
	shape.position.set(-200, 50, 200);
	scene.add( shape );
	
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor( 0x000000, 1 );
	renderer.autoClear = false;
}
function animate() 
{
    requestAnimationFrame( animate );
	render();		
	update();
}
function update()
{
	var delta = clock.getDelta(); // seconds.
	var moveDistance = 200 * delta; // 200 pixels per second
	var rotateAngle = Math.PI / 2 * delta;   // pi/2 radians (90 degrees) per second
	
	// local transformations
	// move forwards/backwards/left/right
	/*if ( keyboard.pressed("W") )
		MovingCube.translateZ( -moveDistance );
	if ( keyboard.pressed("S") )
		MovingCube.translateZ(  moveDistance );
	if ( keyboard.pressed("Q") )
		MovingCube.translateX( -moveDistance );
	if ( keyboard.pressed("E") )
		MovingCube.translateX(  moveDistance );	
	// rotate left/right/up/down
	var rotation_matrix = new THREE.Matrix4().identity();
	if ( keyboard.pressed("A") )
		MovingCube.rotateOnAxis( new THREE.Vector3(0,1,0), rotateAngle);
	if ( keyboard.pressed("D") )
		MovingCube.rotateOnAxis( new THREE.Vector3(0,1,0), -rotateAngle);
	
	if ( keyboard.pressed("Z") )
	{
		MovingCube.position.set(0,25.1,0);
		MovingCube.rotation.set(0,0,0);
	}*/
	stats.update();
}
function render() 
{
	var w = window.innerWidth, h = window.innerHeight;
	// setViewport parameters:
	//  lower_left_x, lower_left_y, viewport_width, viewport_height
	renderer.setViewport( 0, 0, w, h );
	renderer.clear();
	
	// full display
	// renderer.setViewport( 0, 0, SCREEN_WIDTH - 2, 0.5 * SCREEN_HEIGHT - 2 );
	renderer.render( scene, perspectiveCamera );
	
	// minimap (overhead orthogonal camera)
	//  lower_left_x, lower_left_y, viewport_width, viewport_height
	renderer.setViewport( 10, h - mapHeight - 10, mapWidth, mapHeight );
	renderer.render( scene, mapCamera );
}
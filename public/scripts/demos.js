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

// 'use strict';
	
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
	
	window.onload = initScene();
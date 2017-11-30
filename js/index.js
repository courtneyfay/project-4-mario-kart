let sceneHeight;
let sceneWidth;
let camera;
let scene;
let renderer;
let dom;
let cube;
let sun;

init();

function init() {
	
	// sets up the scene, camera, renderer and 3D objects
	createScene();

	// calls game loop/animations
	animate();
}

function createScene(){
	// sets the scene
	scene = new THREE.Scene();

	// sets the camera and its position
	sceneWidth = window.innerWidth;
  sceneHeight = window.innerHeight;
	camera = new THREE.PerspectiveCamera(60, sceneWidth/sceneHeight, 0.1, 1000);
	camera.position.z = 5;
	camera.position.y = 1;

	// sets the renderer
	renderer = new THREE.WebGLRenderer({alpha:true});
	renderer.setSize(sceneWidth, sceneHeight); 
	
	// adds shadow map
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	
	// appends scene to the DOM
	dom = document.getElementById('TutContainer');
	dom.appendChild(renderer.domElement);

	// creates racecube and adds to scene
	let cubeGeometry = new THREE.BoxGeometry(1,1,1);
	let cubeMaterial = new THREE.MeshStandardMaterial({color: 0xE50009, side: THREE.DoubleSide}); //Mario red
	cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
	cube.castShadow = true;
	cube.receiveShadow = false;
	cube.position.y = 1;
	scene.add(cube);

	// creates racetrack and adds to scene
	let racetrackGeometry = new THREE.PlaneGeometry(11,11);
	let racetrackMaterial = new THREE.MeshStandardMaterial({color: 0x576259}); //asphalt grey
	let racetrack = new THREE.Mesh(racetrackGeometry, racetrackMaterial);
	racetrack.receiveShadow = true;
	racetrack.castShadow = false;
	racetrack.rotation.x -= Math.PI/2;
	racetrack.position.y = -1;
	scene.add(racetrack);

	// creates sun and lighting effects
	sun = new THREE.DirectionalLight(0xFFFFFF, 0.8); //dark shadows
	sun.position.set(0,4,1);
	sun.castShadow = true;
	sun.shadow.mapSize.width = 256;
	sun.shadow.mapSize.height = 256;
	sun.shadow.camera.near = 0.5;
	sun.shadow.camera.far = 50;
	scene.add(sun);

	// enables you to see the light cone from the sun
	//let helper = new THREE.CameraHelper(sun.shadow.camera);
	//scene.add(helper); 

	window.addEventListener('resize', onWindowResize, false);
}

function animate() {
	
	// animates the cube
	//cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;
	render();
	requestAnimationFrame(animate);
}

function render() {
	renderer.render(scene, camera);
}

function onWindowResize() {
	
	// resizes and aligns depending on user screen size
	sceneHeight = window.innerHeight;
	sceneWidth = window.innerWidth;
	renderer.setSize(sceneWidth, sceneHeight);
	camera.aspect = sceneWidth / sceneHeight;
	camera.updateProjectionMatrix();
}
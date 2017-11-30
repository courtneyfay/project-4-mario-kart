let sceneHeight, sceneWidth;
let camera, scene, renderer;
let dom;
let cube;
let sun;
var clock = new THREE.Clock();

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
  let viewAngle = 55;
  let aspect = sceneWidth / sceneHeight;
  let near = 0.1;
  let far = 1000; //2000
	camera = new THREE.PerspectiveCamera(viewAngle, aspect, near, far);
	camera.position.set(0, 1, 5); //(0, 0, 100); // x y z

	// sets the renderer
	renderer = new THREE.WebGLRenderer({alpha:true});
	renderer.setSize(sceneWidth, sceneHeight); 
	
	// adds shadow map
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	
	// appends scene to the DOM
	dom = document.getElementById('MarioKart');
	dom.appendChild(renderer.domElement);

	// creates sky blue color and adds to the scene
	scene.background = new THREE.Color(0x90A2C5); //skyblue	

	// creates green grass color and adds to scene
	let grassWidth = 2000;
	let grassLength = 800;
	let grassGeometry = new THREE.PlaneGeometry(grassWidth, grassLength);
	let grassMaterial = new THREE.MeshStandardMaterial({color: 'green'});	
	let grass = new THREE.Mesh(grassGeometry, grassMaterial);
	grass.rotation.x = -Math.PI / 2;
	grass.position.y = -1.1;
	scene.add(grass);

	// creates grey racetrack color and adds to scene
	let racetrackWidth = 11;
	let racetrackHeight = 800;
	let racetrackGeometry = new THREE.PlaneGeometry(racetrackWidth, racetrackHeight);
	let racetrackMaterial = new THREE.MeshLambertMaterial({color: 0x576259}); //asphalt grey
	let racetrack = new THREE.Mesh(racetrackGeometry, racetrackMaterial);
	racetrack.receiveShadow = true;
	racetrack.castShadow = false;
	racetrack.rotation.x = -Math.PI / 2;
	racetrack.position.y = -1;
	scene.add(racetrack);

	// creates starting line and adds to scene
	let startingLineMaterial = new THREE.LineBasicMaterial({color: 0xffffff}); // white starting line
	let startingLineGeometry = new THREE.Geometry();
		startingLineGeometry.vertices.push(new THREE.Vector3(-1.7, 0, 0)); // x y z
		startingLineGeometry.vertices.push(new THREE.Vector3(1.7, 0, 0)); // x y z
	let startingLine = new THREE.LineSegments(startingLineGeometry, startingLineMaterial);
	startingLine.position.y = 0.4;
	scene.add(startingLine);

	// creates racecube and adds to scene
	let cubeGeometry = new THREE.BoxGeometry(1,1,1);
	let cubeMaterial = new THREE.MeshLambertMaterial({color: 'red'}); //0xE50009 Mario red
	cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
	cube.castShadow = true;
	cube.receiveShadow = false;
	cube.position.y = -0.5;
	scene.add(cube);

	// creates starting line banner and adds to scene
	// let poleGeometry = new THREE.CylinderGeometry(5, 5, 20, 32);
	// let poleMaterial = new THREE.MeshBasicMaterial({color: 0xffff00});
	// let pole = new THREE.Mesh(poleGeometry, poleMaterial);
	// pole.position.y = 10;
	// scene.add(pole);

	// creates ambient light
	let ambient = new THREE.AmbientLight(0xffffff, 0.5);
	scene.add(ambient);

	// creates sun with directional lighting effects
	light = new THREE.DirectionalLight(0xFFFFFF, 0.8); 
	light.position.set(3,6,5);
	light.castShadow = true;
	light.shadow.mapSize.width = 256;
	light.shadow.mapSize.height = 256;
	light.shadow.camera.near = 0.5;
	light.shadow.camera.far = 50;
	scene.add(light);

	// enables you to see the light cone from the directional light
	//let helper = new THREE.CameraHelper(light.shadow.camera);
	//scene.add(helper); 

	// enables you to visualize the x y and z axes
	// let axes = new THREE.AxesHelper(100);
	// scene.add(axes);

	// event listeners
	window.addEventListener('resize', onWindowResize, false);
}

function animate() {
	
	// animates the cube
	cube.rotation.y += 0.01;
	requestAnimationFrame(animate);
	render();
	update();
}

function render() {
	renderer.render(scene, camera);
}

function update() {
	document.addEventListener("keypress", onKeypress, false);

	let moveDistance = 50 * clock.getDelta();
}

function onKeypress() {
	if (keyboard.down("left")) {
		console.log("moving left");
		// cube.translateX(-50);
	}

	if (keyboard.down("right")) {
		console.log("moving right");
		//cube.translateX(50);
	}
}

function onWindowResize() {
	
	// resizes and aligns depending on user screen size
	sceneHeight = window.innerHeight;
	sceneWidth = window.innerWidth;
	renderer.setSize(sceneWidth, sceneHeight);
	camera.aspect = sceneWidth / sceneHeight;
	camera.updateProjectionMatrix();
}

///////////////////////////////
////////// GRAVEYARD //////////
///////////////////////////////

// creates sky and adds to scene -- not working
// let skyGeometry = new THREE.SphereGeometry(100000, 25, 25); 
// let loader  = new THREE.TextureLoader();
// loader.setCrossOrigin("");
// texture = loader.load("./images/sky2.jpeg");
// let material = new THREE.MeshPhongMaterial({map: texture});
// let sky = new THREE.Mesh(skyGeometry, material);
// sky.material.side = THREE.BackSide;
// scene.add(sky);

// point light: alternative to directional light
// let light = new THREE.PointLight(0xffffff);
// light.position.set(10,10,10);
// scene.add(light);
// enables you to see the light cone from the point light
// let pointLightHelper = new THREE.PointLightHelper(pointLight, 1);
// scene.add(pointLightHelper);
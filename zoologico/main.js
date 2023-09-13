import './style.css'

import * as THREE from 'three';

import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

import { MapControls } from 'three/addons/controls/MapControls.js';


//import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const scene = new THREE.Scene();
//scene.fog = new THREE.FogExp2( 0xcccccc, 0.02 );

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight,0.1,1000);

const render = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});

render.setPixelRatio (window.devicePixelRatio);
render.setSize( window.innerWidth,window.innerHeight);
camera.position.setZ(30);
//camera.position.set( 0, 20, -100 );


render.render(scene, camera);



//const geometry = new THREE.TorusGeometry(10,3,16,100);
//const material = new THREE.MeshStandardMaterial({ color: 0xFF6347});
//const torus = new THREE.Mesh( geometry,material);


const RingGeometry = new THREE.ConeGeometry(5,10,6,1,3.04,6.2)
const material2 = new THREE.MeshStandardMaterial( {color: 0xffff00} );
const ring = new THREE.Mesh(RingGeometry,material2)

const sphereGeometry = new THREE.SphereGeometry(3,32,27,0,6.2,0,6.25)
const material3 = new THREE.MeshStandardMaterial({color: 0xffff11})
const sphere = new THREE.Mesh(sphereGeometry,material3)

sphere.position.set(25,25,25)
//scene.add(torus,ring,sphere);
scene.add(ring,sphere);

const loader = new GLTFLoader();
let mixer;
const clock = new THREE.Clock()

loader.load( 'scene.glb', function ( gltf ) {

    const model = gltf.scene;
	scene.add( model);
    mixer = new THREE.AnimationMixer(model);
    const clips = gltf.animations;
    const clip = THREE.AnimationClip.findByName(clips,'ArmatureAction');
    const action = mixer.clipAction(clip);
    action.play();

}, undefined, function ( error ) {

	console.error( error );

} );

render.setAnimationLoop(animate);

const positionLinght = new THREE.PointLight(0xffffff,10000);
positionLinght.position.set(25,25,25)
const ambientLight = new THREE.AmbientLight(0xffffff)


scene.add(positionLinght, ambientLight);

const lightHelper = new THREE.PointLightHelper(positionLinght)
const gridHelper = new THREE.GridHelper(200,50)
scene.add(lightHelper,gridHelper)

const controls  = new OrbitControls(camera,render.domElement)
//const controls = new MapControls(camera, render.domElement) 


const background = new THREE.TextureLoader().load('butter dog.jpg');
scene.background = background;

function animate() {
    requestAnimationFrame( animate);
    //torus.rotation.x += 0.01;
    //torus.rotation.y += 0.005;
    //torus.rotation.z += 0.01;
    //torus.position.y = 0.1;

   mixer.update(clock.getDelta()); 

    ring.position.x += .05;
    controls.update();
    render.render(scene, camera);

}
animate();
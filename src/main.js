import './css/style.css'

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { MapControls } from 'three/addons/controls/MapControls.js';
//import * as TWEEN from '@tweenjs/tween.js'

import gsap from 'gsap'
//import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { InteractionManager } from "three.interactive";

import {CSS2DObject, CSS2DRenderer} from 'three/examples/jsm/renderers/CSS2DRenderer'

const scene = new THREE.Scene();
//scene.fog = new THREE.FogExp2( 0xcccccc, 0.02 );

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const render = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});

render.setPixelRatio(window.devicePixelRatio);
render.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
//para que tengan sombras los modelos
// render.setClearColor(0xA3A3A3)
// render.shadowMap.enabled = true

camera.position.set(0, 20, -10);

const labelRenderer = new CSS2DRenderer()
labelRenderer.setSize(window.innerWidth, window.innerHeight)
labelRenderer.domElement.style.position = 'absolute'
labelRenderer.domElement.style.top = '0px'
labelRenderer.domElement.style.pointerEvents = 'none'
labelRenderer.domElement.style.zIndex = '2'
document.body.appendChild(labelRenderer.domElement)

render.render(scene, camera);

const progressBar = document.getElementById('progress-bar')

const LoadingManager = new THREE.LoadingManager()

LoadingManager.onProgress = (url, loaded, total) => {
    progressBar.value = (loaded / total) * 100;
}

const progressBarContainer = document.querySelector('.progress-bar-container')

LoadingManager.onLoad = () => {
    progressBarContainer.style.display = 'none';
}

const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFFFF, side: THREE.DoubleSide, dithering: true })
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.rotation.x = -0.5 * Math.PI
scene.add(plane)
// plane.receiveShadow = true

const loader = new GLTFLoader(LoadingManager);
let mixer;
const clock = new THREE.Clock()

const interactionManager = new InteractionManager(
    render,
    camera,
    render.domElement
);

let model
loader.load('/models/scene.glb', function (gltf) {

    model = gltf.scene;
    scene.add(model);
    model.position.set(10, 0, 10)
    mixer = new THREE.AnimationMixer(model);
    const clips = gltf.animations;
    const clip = THREE.AnimationClip.findByName(clips, 'ArmatureAction');
    const action = mixer.clipAction(clip);
    action.play();

    // model.traverse((node)=>{
    //     if(node.isMesh){
    //         node.castShadow = true
    //     }
    // })

    model.traverse((node) => {
        if (node.isMesh) console.log(node.id)
    });

}, undefined, function (error) {

    console.error(error);

});

render.setAnimationLoop(animate);

const positionLinght = new THREE.PointLight(0xffffff, 10000);
positionLinght.position.set(25, 25, 25)
const ambientLight = new THREE.AmbientLight(0xffffff)

scene.add(positionLinght, ambientLight);

// positionLinght.castShadow = true
// positionLinght.shadow.mapSize.width = 1024
// positionLinght.shadow.mapSize.height = 1024
// positionLinght.shadow.camera.near = 5
// positionLinght.shadow.camera.far = 20
// positionLinght.shadow.focus = 1

const lightHelper = new THREE.PointLightHelper(positionLinght)
const gridHelper = new THREE.GridHelper(200, 50)
scene.add(lightHelper, gridHelper)

//const controls  = new OrbitControls(camera,render.domElement)
const controls = new MapControls(camera, render.domElement)


const background = new THREE.TextureLoader().load('img/butter dog.jpg');
scene.background = background;

function animate(time) {
    requestAnimationFrame(animate);
    //torus.rotation.x += 0.01;
    //torus.rotation.y += 0.005;
    //torus.rotation.z += 0.01;
    //torus.position.y = 0.1;
    //if (mixer)
    mixer.update(clock.getDelta());
    //interactionManager.update();
    labelRenderer.render(scene,camera)
    controls.update();
    render.render(scene, camera);

}
//animate();
const mousePosition = new THREE.Vector2()

const rayCaster = new THREE.Raycaster()

render.domElement.addEventListener('dblclick', (e) => {

    mousePosition.x = ((e.clientX - render.domElement.getBoundingClientRect().left) / render.domElement.clientWidth) * 2 - 1;
    mousePosition.y = -((e.clientY - render.domElement.getBoundingClientRect().top) / render.domElement.clientHeight) * 2 + 1;

    rayCaster.setFromCamera(mousePosition, camera)
    const intersects = rayCaster.intersectObjects(model.children, true)
    for (let i = 0; i < intersects.length; i++) {
        if (intersects[i].object.id == 29 |
            intersects[i].object.id == 31 |
            intersects[i].object.id == 33 |
            intersects[i].object.id == 34 |
            intersects[i].object.id == 32 |
            intersects[i].object.id == 30) {
            console.log(camera.position)
            // camera.position.set( 6.2, 5, -6 );
            const tl = gsap.timeline();
            tl.to(camera.position, {
                x: 6.2,
                y: 5,
                z: -6,
                duration: 1.5,
                onUpdate: () => {
                    camera.lookAt(1, 0, 0)
                }
            })
            tl.to(camera.position, {
                x: 15,
                y: 5,
                z: -6,
                duration: 1.5,
                onUpdate: () => {
                    camera.lookAt(1, 0, 0)
                }
            }, 2);

            controls.enabled = false

            const cont1 = document.createElement("div")
            cont1.id = "cont1"
            const cont2 = document.createElement("div")
            cont2.id = "cont2"
            const cont3 = document.createElement("div")
            cont3.id = "cont3"

            const btnCerrar = document.createElement('button')
            btnCerrar.id = "btnCerrar"


            const iconoAnimal = document.createElement('img')
            iconoAnimal.id = "iconoAnimal"
            iconoAnimal.src = "../img/Leon.png"

            const p = document.createElement('p')
            p.id = "infoAnimal"
            p.textContent = `El león es un animal majestuoso que vive principalmente en África y Asia. Es conocido como el Rey de la Selva por su gran tamaño y su rugido fuerte que se puede escuchar a kilómetros de distancia. Los leones son carnívoros y se alimentan de otros animales como búfalos, cebras y gacelas. Los machos se distinguen por su melena grande y las hembras, que no tienen melena, son las que suelen cazar para la manada. Los leones son muy sociables y viven en grupos llamados manadas`

            const nombreAnimal = document.createElement('h1')
            nombreAnimal.id = "nombreAnimal"
            nombreAnimal.textContent = "León"

            const btnSonido = document.createElement("button")
            btnSonido.id = "btnSonido"

            const divInfo = document.createElement('div')
            divInfo.id = "divInfo"

            cont1.appendChild(btnCerrar)
            cont2.appendChild(iconoAnimal)
            cont2.appendChild(nombreAnimal)
            cont2.appendChild(p)
            cont3.appendChild(btnSonido)
            
           divInfo.appendChild(cont1)
           divInfo.appendChild(cont2)
           divInfo.appendChild(cont3)
            
            const cDiv = new CSS2DObject(divInfo)
            //const cPintLabel = new CSS2DObject(p)
            scene.add(cDiv)
        }
    }
});

// render.domElement.addEventListener('click', (e)=>{
//     const audio = new Audio("/public/audio/sonidoLeon.mp3")
//     audio.play()
// })

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    render.setSize(window.innerWidth / window.innerHeight)
})

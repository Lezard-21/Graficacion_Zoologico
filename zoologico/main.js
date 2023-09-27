import './style.css'

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
loader.load('scene.glb', function (gltf) {

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


const background = new THREE.TextureLoader().load('butter dog.jpg');
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

            const p = document.createElement('p')
            p.textContent = `El león (Panthera leo) es un mamífero carnívoro de la familia de los félidos y una de las cinco especies del género Panthera. Los leones salvajes viven en poblaciones cada vez más dispersas y fragmentadas del África subsahariana (a excepción de las regiones selváticas de la costa del Atlántico y la cuenca del Congo) y una pequeña zona del noroeste de India (una población en peligro crítico en el parque nacional del Bosque de Gir y alrededores), habiendo desaparecido del resto de Asia del Sur, Asia Occidental, África del Norte y la península balcánica en tiempos históricos. Hasta finales del Pleistoceno, hace aproximadamente diez mil años, de los grandes mamíferos terrestres, el león era el más extendido tras los humanos. Su distribución cubría la mayor parte de África, gran parte de Eurasia, desde el oeste de Europa hasta la India, y en América, desde el río Yukón hasta el sur de México.3​4​5​ `
            const divInfo = document.createElement('div')
            divInfo.appendChild(p)
            divInfo.id = "divInfo"
            const cDiv = new CSS2DObject(divInfo)
            //const cPintLabel = new CSS2DObject(p)
            scene.add(cDiv)
        }
    }
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    render.setSize(window.innerWidth / window.innerHeight)
})

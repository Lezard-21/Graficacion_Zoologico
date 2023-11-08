import '../css/style.css'
import * as THREE from 'three';
import { MapControls } from 'three/addons/controls/MapControls.js';
import {CSS2DRenderer} from 'three/examples/jsm/renderers/CSS2DRenderer'
import Mono from './Mono.js'
import Leon from './Leon.js'
import Pinguino from './Pinguino'
import Sabana from './Sabana';
import Tundra from './Tundra';
import Bosque from './Bosque';
import Zorro from './Zorro';
import Oso from './Oso';

export default class SceneManager {
    constructor(canvas) {

        const clock = new THREE.Clock();

        const scene = buildScene();
        const renderer = buildRender();
        const camera = buildCamera();
        setLights(scene);

        const labelRenderer = new CSS2DRenderer()
        labelRenderer.setSize(window.innerWidth, window.innerHeight)
        labelRenderer.domElement.id = 'laberRenderer'
        labelRenderer.domElement.style.position = 'absolute'
        labelRenderer.domElement.style.top = '0px'
        labelRenderer.domElement.style.pointerEvents = 'none'
        labelRenderer.domElement.style.zIndex = '2'
        document.body.appendChild(labelRenderer.domElement)
        
        this.controls = new MapControls(camera, renderer.domElement)
        const conts = this.controls;

        const LoadingManager = setProgressBar();
        renderer.render(scene,camera);

        this.sceneSubjects = createSceneSubjects(scene,LoadingManager);
        //variable de prueba 
        let angle = 0; 
        setListeners(this.sceneSubjects);

        //helpers
        const gridHelper = new THREE.GridHelper(200, 50)
        scene.add(gridHelper)

        function buildScene() {
            const scene = new THREE.Scene();
            scene.background = new THREE.TextureLoader().load('img/butter dog.jpg');
            return scene;
        }

        function buildRender() {
            const render = new THREE.WebGLRenderer({
                canvas: canvas,
              });
            render.setPixelRatio(window.devicePixelRatio);
            render.setSize(window.innerWidth, window.innerHeight);
            return render;
        }

        function buildCamera() {
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.set(0, 20, 30);
            return camera;
        }

        function setLights(scene) {
            const positionLinght = new THREE.PointLight(0xffffff, 10000);
            positionLinght.position.set(0, 50, 0)
            const ambientLight = new THREE.AmbientLight(0xffffff)

            //helper
            const lightHelper = new THREE.PointLightHelper(positionLinght)
            scene.add(lightHelper, positionLinght, ambientLight);
        }

        function setListeners(sceneSubjets) {
            const mousePosition = new THREE.Vector2()
            const rayCaster = new THREE.Raycaster()
            renderer.domElement.addEventListener('dblclick', (e) => {

                mousePosition.x = ((e.clientX - renderer.domElement.getBoundingClientRect().left) / renderer.domElement.clientWidth) * 2 - 1;
                mousePosition.y = -((e.clientY - renderer.domElement.getBoundingClientRect().top) / renderer.domElement.clientHeight) * 2 + 1;
            
                rayCaster.setFromCamera(mousePosition, camera)

                sceneSubjets.forEach(e => {
                    const intersects = rayCaster.intersectObjects(e.getModel().children, true);
                    let nodeMap = new Map();
                    nodeMap = e.getNodes();
                    //este es para que pare el bucle y isintersected es unico para cada animal
                    let intersection = false;
                    for (let i = 0; i < intersects.length; i++) {
                        nodeMap.forEach(element => {
                            if (intersects[i].object.id == element) {
                                if (!intersection) {
                                    document.body.appendChild(labelRenderer.domElement)
                                    e.setCard(scene,camera,conts,labelRenderer);
                                    e.setIntersected()
                                    intersection = true;
                                }
                            }
                        });
                        console.log(intersects.length)
                    }
                });
            });

            window.addEventListener('keyup', (e) => {
                console.log(camera.position)
                console.log(camera.rotation)
                camera.position.x = 30 * Math.cos(angle);
                camera.position.z = 30 * Math.sin(angle);
                angle += 0.5;
            });
            
        }

        function setProgressBar(){
            const labelRenderer = new CSS2DRenderer()
            labelRenderer.setSize(window.innerWidth, window.innerHeight)
            labelRenderer.domElement.style.position = 'absolute'
            labelRenderer.domElement.style.top = '0px'
            labelRenderer.domElement.style.pointerEvents = 'none'
            labelRenderer.domElement.style.zIndex = '2'
            document.body.appendChild(labelRenderer.domElement)

            const progressBar = document.getElementById('progress-bar')

            const LoadingManager = new THREE.LoadingManager()

            LoadingManager.onProgress = (url, loaded, total) => {
                progressBar.value = (loaded / total) * 100;
            }

            const progressBarContainer = document.querySelector('.progress-bar-container')

            LoadingManager.onLoad = () => {
                progressBarContainer.style.display = 'none';
            }
            return LoadingManager;
        }

        function createSceneSubjects(scene, LoadingManager) {
            const sceneSubjects = [
                //aqui solo se crean mas entidades para agregarlas a la esena 10,0,-10
                new Mono(scene,LoadingManager,16,0,-14),
                new Pinguino(scene,LoadingManager,-13,5,-20),
                new Leon(scene,LoadingManager,10,0,10),
                new Zorro(scene,LoadingManager,-20,2,40),
                new Oso(scene,LoadingManager,-17,0,10),
                /**dolores vargas*/
                new Bosque(scene, LoadingManager,-28,-9,8),
                new Bosque(scene, LoadingManager,-28,-9,38),
                new Tundra(scene, LoadingManager,-5,2.3,-25),
                new Sabana(scene, LoadingManager,20,-1,-25),
                new Sabana(scene, LoadingManager,20,-1,15),
                // //new SceneSubject(scene)
            ];
            return sceneSubjects;
        }

        this.update = ()=> {
            const elapsedTime = clock.getDelta();
            for (let i = 0; i < this.sceneSubjects.length; i++)
                 this.sceneSubjects[i].update(elapsedTime);
            this.controls.update()
            labelRenderer.render(scene,camera)
            renderer.render(scene, camera);
        };

        this.onWindowResize = ()=> {
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
            renderer.setSize(window.innerWidth / window.innerHeight)
        };
    }
}
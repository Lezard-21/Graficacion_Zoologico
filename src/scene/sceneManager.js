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
import gsap from 'gsap'

export default class SceneManager {
    constructor(canvas) {

        const clock = new THREE.Clock();

        let ModelsCoords = [[],[]];
        ModelsCoords = setCoords(5,100);
        let cameraCoords = [[],[]];
        cameraCoords = setCoords(5,130);
        let keyCont = 0; 
        let animationCoords = [[],[]];
        animationCoords = setCoords(5,115)

        const ModelsCoordsY = [[],[]]
        ModelsCoordsY[0][0] = 0;
        ModelsCoordsY[0][1] = 5;
        ModelsCoordsY[0][2] = 0;
        ModelsCoordsY[0][3] = 2;
        ModelsCoordsY[0][4] = 1.7;


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
        this.controls.enabled = false;

        const LoadingManager = setProgressBar();
        renderer.render(scene,camera);

        this.sceneSubjects = createSceneSubjects(scene,LoadingManager);
        this.sceneHabitads = createSceneHabitats(scene,LoadingManager);

        //variable de prueba 
        setSubjectsListeners(this.sceneSubjects);
        setKeysListeners();
        //helpers
        // const gridHelper = new THREE.GridHelper(200, 50)
        // scene.add(gridHelper)

        function buildScene() {
            const scene = new THREE.Scene();
            scene.background = new THREE.TextureLoader().load('img/butter dog.jpg');
            // scene.fog = new THREE.FogExp2( 0xcccccc,.019 );
            scene.fog = new THREE.Fog( 0xcff1fa, 50, 70 );
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
            camera.position.set(0, 10, 30);
            return camera;
        }

        function setLights(scene) {
            const positionLinght = new THREE.PointLight(0xffffff, 10000);
            positionLinght.position.set(0, 50, 0)
            const ambientLight = new THREE.AmbientLight(0xffffff)

            // //helper
            // const lightHelper = new THREE.PointLightHelper(positionLinght)
            scene.add(positionLinght, ambientLight);
        }

        function setSubjectsListeners(sceneSubjets) {
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

                                    const tl = gsap.timeline();
                                    tl.to(camera.position, {
                                        x: animationCoords[0][keyCont-1],
                                        y: ModelsCoordsY[0][keyCont-1]+4,
                                        z: animationCoords[1][keyCont-1],
                                        duration: 2
                                    })  
                                    camera.lookAt(ModelsCoords[0][keyCont],0,ModelsCoords[1][keyCont])
                                    e.setIntersected()
                                    intersection = true;
                                }
                            }
                        });
                    }
                });
            });
        }

        function setKeysListeners() {
            window.addEventListener('keyup', (e) => {
                if (keyCont<=4) {
                    console.log("keycont: r"+keyCont)
                    const tl = gsap.timeline();
                    tl.to(camera.position, {
                        x: cameraCoords[0][keyCont],
                        y: 10,
                        z: cameraCoords[1][keyCont],
                        duration: 2
                    })  
                    camera.lookAt(ModelsCoords[0][keyCont],0,ModelsCoords[1][keyCont])
                    keyCont++;
                }else{
                    keyCont = 0;
                }
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
                const tl = gsap.timeline();
                tl.to(camera.position, {
                    x: cameraCoords[0][keyCont],
                    y: 10,
                    z: cameraCoords[1][keyCont],
                    duration: 3,
                    onUpdate: () => {
                        camera.lookAt(ModelsCoords[0][keyCont],0,ModelsCoords[1][keyCont]);
                    }
                })
                keyCont++;
            }
            return LoadingManager;
        }

        function setCoords(numObjects,radius){
            // const numObjects = 5; //numero de objetos
            // const radius = 100;  //distancia respecto al centro
            const angleStep = 2 * Math.PI / numObjects;  // dividir el círculo completo (2 * PI radianes) en x partes
            let coords = [[],[]];  
            for (let i = 0; i < numObjects; i++) {
                let angle = i * angleStep;
                let x = radius * Math.cos(angle);
                let z = radius * Math.sin(angle);
                coords[0][i] = x;
                coords[1][i] = z;
            }
            return coords;
        }

        function createSceneSubjects(scene, LoadingManager) {
            const sceneSubjects = [
                //aqui solo se crean mas entidades para agregarlas a la esena 10,0,-10
                new Mono(scene,LoadingManager,ModelsCoords[0][0],ModelsCoordsY[0][0],ModelsCoords[1][0]),
                new Pinguino(scene,LoadingManager,ModelsCoords[0][1],ModelsCoordsY[0][1],ModelsCoords[1][1]),
                new Leon(scene,LoadingManager,ModelsCoords[0][2],ModelsCoordsY[0][2],ModelsCoords[1][2]),
                new Zorro(scene,LoadingManager,ModelsCoords[0][3],ModelsCoordsY[0][3],ModelsCoords[1][3]),
                new Oso(scene,LoadingManager,ModelsCoords[0][4],ModelsCoordsY[0][4],ModelsCoords[1][4]),
                // //new SceneSubject(scene)
            ];
            const planeGeometry = new THREE.PlaneGeometry(500,500);
            const planeMaterial = new THREE.MeshStandardMaterial({color:0x1a98c9, side:THREE.DoubleSide})
            const plane = new THREE.Mesh(planeGeometry,planeMaterial)
            plane.rotation.x = -0.5 * Math.PI
            plane.setY = 5
            scene.add(plane)
            return sceneSubjects;
        }
        function createSceneHabitats(scene, LoadingManager) {
            const habitads = [
                /**dolores vargas*/
                new Sabana(scene, LoadingManager,ModelsCoords[0][0],-1,ModelsCoords[1][0]),
                new Tundra(scene, LoadingManager,ModelsCoords[0][1],2.3,ModelsCoords[1][1]),
                new Sabana(scene, LoadingManager,ModelsCoords[0][2],-1,ModelsCoords[1][2]),
                new Bosque(scene, LoadingManager,ModelsCoords[0][3],-8,ModelsCoords[1][3]),
                new Bosque(scene, LoadingManager,ModelsCoords[0][4]-10,-8,ModelsCoords[1][4])
            ]
            return habitads;
        }

        this.update = ()=> {
            const elapsedTime = clock.getDelta();
            for (let i = 0; i < this.sceneSubjects.length; i++){
                 this.sceneSubjects[i].update(elapsedTime);
                 this.sceneSubjects[i].lookAt(camera.position)
                }
            for (let i = 0; i < this.sceneSubjects.length; i++){
                 this.sceneHabitads[i].lookAt(camera.position)
                }
            this.controls.update()
            labelRenderer.render(scene,camera);
            renderer.render(scene, camera);
        };

        this.onWindowResize = ()=> {
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
            renderer.setSize(window.innerWidth / window.innerHeight)
        };
    }
}
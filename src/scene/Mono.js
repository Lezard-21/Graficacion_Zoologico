import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';
import gsap from 'gsap'
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer'

class Mono {
  constructor(scene, LoadingManager, x, y, z) {
    this.cDiv;
    this.intersected = false;
    const loader = new GLTFLoader(LoadingManager);
    let mixer;
    let model;
    let nodes = new Map();
    let cont = 0;
    model = loader.load('models/mono.glb', function (gltf) {
      model = gltf.scene;
      scene.add(model);
      model.position.set(x, y, z)
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
        if (node.isMesh) {
          nodes.set(cont, node.id);
          cont++;
        }
      });
      console.log(nodes);

    }, undefined, function (error) {
      console.error(error);
    });

    this.update = (delta) => {
      if (mixer) mixer.update(delta);
    }

    this.getModel = () => {
      return model;
    }

    this.getNodes = () => {
      return nodes;
    }
    this.setIntersected = ()=>{
      this.intersected = true;
    }
    this.isIntersected = ()=>{
      return this.intersected;
    }
    

    this.setCard = (scene, camera, controls,labelRenderer,intersection) => {

      this.scene = scene;
      const tl = gsap.timeline();
      //0,20,30
      tl.to(camera.position, {
        x: -5,
        y: 10,
        z: 20,
        duration: 2,
        onUpdate: () => {
          camera.lookAt(1, 5, 0)
        }
      })
      tl.to(camera.position, {
        x: -9,
        y: 3,
        z: 15,
        duration: 1.5,
        onUpdate: () => {
          camera.lookAt(1, 5, 0)
        }
      }, 2);

      controls.enabled = false
      if(!this.isIntersected() && !intersection){
        this.cDiv = this.getHtml(camera,labelRenderer,controls);
        scene.add(this.cDiv)
      }else{
        scene.add(this.cDiv)
      }
      
    }

    this.getHtml = (camera,labelRenderer,controls)=> {
      const audio = new Audio('/audio/sonidoMono.mp3');
      audio.play();

      const gridCont = document.createElement("div")
      gridCont.id = "gridCont"

      const infGeneral = document.createElement("div")
      infGeneral.id = "infGeneral"

      const pesoAnimal = document.createElement("p")
      pesoAnimal.id = "pesoAnimal"
      pesoAnimal.textContent="Peso promedio: 100g - 35Kg "

      const alimentacion = document.createElement("p")
      alimentacion.id = "alimentacion"
      alimentacion.textContent="Alimentacion: Omnivoros"

      const habitadAnimal = document.createElement("p")
      habitadAnimal.id = "habitadAnimal"
      habitadAnimal.textContent= "Habitad: Calidos y Tropicales"

      const contVideo = document.createElement("div")
      contVideo.id = "contVideo"

      const videoAnimal = '<iframe width="400" height="300" src="https://www.youtube.com/embed/l-hMxW7kaEQ?si=6wsXE-xTimk4x2lf" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>'
      

      const cont1 = document.createElement("div")
      cont1.id = "cont1"
      const cont2 = document.createElement("div")
      cont2.id = "cont2"
      const cont3 = document.createElement("div")
      cont3.id = "cont3"

      const btnCerrar = this.getCloseButon(camera,labelRenderer,controls);

      const iconoAnimal = document.createElement('img')
      iconoAnimal.id = "iconoAnimal"
      iconoAnimal.src = "../img/Mono.jfif"

      const p = document.createElement('p')
      p.id = "infoAnimal"
      p.textContent = `Los monos son animales muy inteligentes y divertidos. Viven en diferentes partes del mundo, como África, Asia y América. Los monos son muy parecidos a los humanos en muchos aspectos, por eso debemos respetarlos y protegerlos  .`

      const nombreAnimal = document.createElement('h1')
      nombreAnimal.id = "nombreAnimal"
      nombreAnimal.textContent = "Mono"
      nombreAnimal.style.backgroundColor = "rgb(0, 153, 0)"

      const btnSonido = this.getAudioeButon(audio);

      const divInfo = document.createElement('div')
      divInfo.id = "divInfo"
      divInfo.style.backgroundImage = "linear-gradient(rgba(0,0,0,0.30),rgba(0,0,0,0.10)), url('img/fondoSelva.jfif')"

      cont1.appendChild(btnCerrar)
      cont2.appendChild(iconoAnimal)
      cont2.appendChild(nombreAnimal)
      cont2.appendChild(p)
      cont3.appendChild(btnSonido)

      divInfo.appendChild(cont1)
      divInfo.appendChild(cont2)
      divInfo.appendChild(cont3)

      infGeneral.appendChild(pesoAnimal)
      infGeneral.appendChild(alimentacion)
      infGeneral.appendChild(habitadAnimal)

      contVideo.insertAdjacentHTML("afterbegin",videoAnimal)


      gridCont.appendChild(divInfo)
      gridCont.appendChild(infGeneral)
      gridCont.appendChild(contVideo)

      gridCont.style.pointerEvents = "stroke"

      return new CSS2DObject(gridCont)
    }

    this.getCloseButon = (camera,labelRenderer,controls)=> {
      const btnCerrar = document.createElement('button')
      btnCerrar.id = "btnCerrar"
      btnCerrar.style.pointerEvents = "stroke"
      btnCerrar.addEventListener('pointerdown', () => {
        const tl = gsap.timeline();
        tl.to(camera.position, {
          x: 0,
          y: 20,
          z: 30,
          duration: 2,
          onUpdate: () => {
            camera.lookAt(1, 0, 0)
          }
        })
        controls.enabled = true;
        this.scene.remove(this.cDiv)
         labelRenderer.domElement.removeChild(this.cDiv);
      });
      return btnCerrar;
    }

    this.getAudioeButon = (audio)=>{
      const btnSonido = document.createElement("button")
      btnSonido.id = "btnSonido"
      btnSonido.style.backgroundImage = "url('img/sound4.png')"
      // Esta linea permite ponerle un event listener
      btnSonido.style.pointerEvents = "stroke"
      btnSonido.addEventListener('pointerdown', () => {
        audio.play()
      });
      return btnSonido;
    }
  }
}

export default Mono;

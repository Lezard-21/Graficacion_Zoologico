import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';
import gsap from 'gsap'
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer'

class Oso {
  constructor(scene, LoadingManager, x, y, z) {
    const loader = new GLTFLoader(LoadingManager);
    let mixer;
    let model;
    let nodes = new Map();
    let cont = 0;
    this.lookAt = lookAt;
    model = loader.load('models/oso.glb', function (gltf) {
      model = gltf.scene;
      model.scale.set(0.1, 0.1, 0.1);
      model.rotateY(55);
      scene.add(model);
      model.position.set(x, y, z)
      mixer = new THREE.AnimationMixer(model);
      const clips = gltf.animations;
      const clip = THREE.AnimationClip.findByName(clips, 'ArmatureAction.001');
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
    
    function lookAt(v){
      if (model) {
        const vector = new THREE.Vector3().copy(v);
        vector.setY(y);
        model.lookAt(vector);
        model.rotateY(55);
      }
    }

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
      // const tl = gsap.timeline();
      // //0,20,30
      // tl.to(camera.position, {
      //   x: -5,
      //   y: 10,
      //   z: 20,
      //   duration: 2,
      //   onUpdate: () => {
      //     camera.lookAt(1, 5, 0)
      //   }
      // })
      // tl.to(camera.position, {
      //   x: -9,
      //   y: 3,
      //   z: 15,
      //   duration: 1.5,
      //   onUpdate: () => {
      //     camera.lookAt(-9, 3, 15)
      //   }
      // }, 2);

      controls.enabled = false
      if(!this.isIntersected() && !intersection){
        this.cDiv = this.getHtml(camera,labelRenderer,controls);
        scene.add(this.cDiv)
      }else{
        const audio = new Audio('/audio/sonidoOso.mp3');
        audio.play();
        scene.add(this.cDiv)
      }
      
    }

    this.getHtml = (camera,labelRenderer,controls)=> {
      const audio = new Audio('/audio/sonidoOso.mp3');
      audio.play();

      const cont1 = document.createElement("div")
      cont1.id = "cont1"
      const cont2 = document.createElement("div")
      cont2.id = "cont2"
      const cont3 = document.createElement("div")
      cont3.id = "cont3"

      const gridCont = document.createElement("div")
      gridCont.id = "gridCont"

      const infGeneral = document.createElement("div")
      infGeneral.id = "infGeneral"

      const pesoAnimal = document.createElement("p")
      pesoAnimal.id = "pesoAnimal"
      pesoAnimal.textContent="Peso promedio: +350Kg "

      const alimentacion = document.createElement("p")
      alimentacion.id = "alimentacion"
      alimentacion.textContent="Alimentacion: Carnivoros"

      const habitadAnimal = document.createElement("p")
      habitadAnimal.id = "habitadAnimal"
      habitadAnimal.textContent= "Habitad: Bosques"

      const contVideo = document.createElement("div")
      contVideo.id = "contVideo"

      const videoAnimal = '<iframe width="400" height="300" src="https://www.youtube.com/embed/IgVB1tJe1XI?si=xn-LCi-zqtgMrPsY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>'
      
      const btnCerrar = this.getCloseButon(camera,labelRenderer,controls);

      const iconoAnimal = document.createElement('img')
      iconoAnimal.id = "iconoAnimal"
      iconoAnimal.src = "../img/oso.jpeg"

      const p = document.createElement('p')
      p.id = "infoAnimal"
      p.textContent = `Los osos son animales grandes y fuertes que viven en diferentes partes del mundo. Hay ocho tipos de osos, y cada uno tiene un color y un hábitat diferente. Algunos osos son blancos y viven en el hielo, como el oso polar. Los osos tienen un buen olfato y una buena vista, pero sus oídos son pequeños. Por eso, hay que respetarlos y cuidarlos.`

      const nombreAnimal = document.createElement('h1')
      nombreAnimal.id = "nombreAnimal"
      nombreAnimal.textContent = "Oso"
      nombreAnimal.style.backgroundColor = "rgb(100, 56, 16)"

      const btnSonido = this.getAudioeButon(audio);

      const divInfo = document.createElement('div')
      divInfo.id = "divInfo"
      divInfo.style.backgroundImage = "linear-gradient(rgba(0,0,0,0.30),rgba(0,0,0,0.10)), url('img/fondoBosque.jfif')"

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

    this.getCloseButon = (camera,labelRenderer,controls)=> {
      const btnCerrar = document.createElement('button')
      btnCerrar.id = "btnCerrar"
      btnCerrar.style.pointerEvents = "stroke"
      btnCerrar.addEventListener('pointerdown', () => {
        let ModelsCoords = [[],[]];
        ModelsCoords = setCoords(5,130);
        const tl = gsap.timeline();
        tl.to(camera.position, {
          x: ModelsCoords[0][4],
          y: 10,
          z: ModelsCoords[1][4],
          duration: 2,
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
      btnSonido.style.backgroundImage = "url('img/sound2.png')"
      // Esta linea permite ponerle un event listener
      btnSonido.style.pointerEvents = "stroke"
      btnSonido.addEventListener('pointerdown', () => {
        audio.play()
      });
      return btnSonido;
    }
  }
}

export default Oso;
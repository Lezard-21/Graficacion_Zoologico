import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';
import gsap from 'gsap'
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer'

class Zorro {
  constructor(scene, LoadingManager, x, y, z) {
    const loader = new GLTFLoader(LoadingManager);
    let mixer;
    let model;
    let nodes = new Map();
    let cont = 0;
    model = loader.load('models/zorro.glb', function (gltf) {
      model = gltf.scene;
      model.rotateY(110);
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
        x: 5,
        y: 3,
        z: 20,
        duration: 2,
        onUpdate: () => {
          camera.lookAt(10, 5, 0)
        }
      })

      controls.enabled = false
      if(!this.isIntersected() && !intersection){
        this.cDiv = this.getHtml(camera,labelRenderer,controls);
        scene.add(this.cDiv)
      }else{
        scene.add(this.cDiv)
      }
      
    }

    this.getHtml = (camera,labelRenderer,controls)=> {
      const audio = new Audio('/audio/sonidoLeon.mp3');
      audio.play();

      const cont1 = document.createElement("div")
      cont1.id = "cont1"
      const cont2 = document.createElement("div")
      cont2.id = "cont2"
      const cont3 = document.createElement("div")
      cont3.id = "cont3"

      const btnCerrar = this.getCloseButon(camera,labelRenderer,controls);

      const iconoAnimal = document.createElement('img')
      iconoAnimal.id = "iconoAnimal"
      iconoAnimal.src = "../img/zorro.jfif"

      const p = document.createElement('p')
      p.id = "infoAnimal"
      p.textContent = `El zorro es un animal muy inteligente y astuto, que pertenece a la familia de los cánidos, como los perros y los lobos. Hay muchos tipos de zorros, que se diferencian por su color, tamaño y hábitat. Algunos ejemplos son el zorro rojo, el zorro ártico, el zorro fénec y el zorro gris. Los zorros son omnívoros, es decir, que comen tanto plantas como animales. Su dieta puede incluir frutas, semillas, insectos, roedores, aves y huevos. Los zorros son animales nocturnos, que salen a cazar y explorar por la noche. Durante el día, duermen en sus madrigueras, que pueden ser cuevas, troncos o agujeros en el suelo. Los zorros son muy ágiles y veloces, y pueden correr hasta 60 km/h. También tienen un buen sentido del olfato, la vista y el oído, que les ayudan a encontrar su comida y a evitar a sus enemigos.Sin embargo, también pueden ser peligrosos si se sienten amenazados o si tienen rabia. Por eso, hay que respetarlos y protegerlos.`

      const nombreAnimal = document.createElement('h1')
      nombreAnimal.id = "nombreAnimal"
      nombreAnimal.textContent = "Zorro"
      nombreAnimal.style.backgroundColor = "rgb(218, 95, 24)"

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

      return new CSS2DObject(divInfo)
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

export default Zorro;
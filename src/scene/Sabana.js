import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

class Sabana {
  constructor(scene, LoadingManager, x, y, z) {
    const loader = new GLTFLoader(LoadingManager);
    let mixer;
    let model;
    // let nodes = new Map();
    // let cont = 0;
    model = loader.load('models/paisaje.glb', function (gltf) {
      model = gltf.scene;
      scene.add(model);
      model.position.set(x, y, z)
      // mixer = new THREE.AnimationMixer(model);
      // const clips = gltf.animations;
      // const clip = THREE.AnimationClip.findByName(clips, 'ArmatureAction');
      // const action = mixer.clipAction(clip);
      // action.play();

      // // model.traverse((node)=>{
      // //     if(node.isMesh){
      // //         node.castShadow = true
      // //     }
      // // })

      // model.traverse((node) => {
      //   if (node.isMesh) {
      //     nodes.set(cont, node.id);
      //     cont++;
      //   }
      // });
      // console.log(nodes);

    }, undefined, function (error) {
      console.error(error);
    });

    this.update = (delta) => {
      //if (mixer) mixer.update(delta);
    }

    this.getModel = () => {
      return model;
    }
  }
}

export default Sabana;
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

class Bosque {
  constructor(scene, LoadingManager, x, y, z) {
    const loader = new GLTFLoader(LoadingManager);
    let mixer;
    let model;
    // let nodes = new Map();
    // let cont = 0;
    model = loader.load('models/bosque.glb', function (gltf) {
      model = gltf.scene;
      scene.add(model);
      model.position.set(x, y, z)

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

export default Bosque;
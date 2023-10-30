import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

class Tundra {
  constructor(scene, LoadingManager, x, y, z) {
    const loader = new GLTFLoader(LoadingManager);
    let mixer;
    let model;
    // let nodes = new Map();
    // let cont = 0;
    model = loader.load('models/nieve.glb', function (gltf) {
      model = gltf.scene;
      model.scale.set(0.35, 0.35, 0.35);
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

export default Tundra;
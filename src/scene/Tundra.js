import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

class Tundra {
  constructor(scene, LoadingManager, x, y, z) {
    const loader = new GLTFLoader(LoadingManager);
    let model;
    this.lookAt = lookAt;
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
    function lookAt(v){
      if (model) {
        const vector = new THREE.Vector3().copy(v);
        vector.setY(y);
        model.lookAt(vector);
        model.rotateY(110);
      }
    }
    this.getModel = () => {
      return model;
    }
  }
}

export default Tundra;
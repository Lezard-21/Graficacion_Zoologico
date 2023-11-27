import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

class Sabana {
  constructor(scene, LoadingManager, x, y, z) {
    const loader = new GLTFLoader(LoadingManager);
    this.lookAt = lookAt;
    let model;
    // let nodes = new Map();
    // let cont = 0;
    model = loader.load('models/grass2.glb', function (gltf) {
      model = gltf.scene;
      model.scale.set(0.3, 0.3, 0.3);
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
      }
    }
    this.getModel = () => {
      return model;
    }
  }
}

export default Sabana;
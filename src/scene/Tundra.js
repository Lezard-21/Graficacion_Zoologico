import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

class Tundra {
  constructor(scene, LoadingManager, x, y, z) {
    // const loader = new GLTFLoader(LoadingManager);
    // let mixer;
    // let model;
    // model = loader.load('models/scene.glb', function (gltf) {
    //     model = gltf.scene;
    //     model.rotateY(110);
    //     scene.add(model);
    //     model.position.set(0, 0, -1)
    //     mixer = new THREE.AnimationMixer(model);
    //     const clips = gltf.animations;
    //     const clip = THREE.AnimationClip.findByName(clips, 'ArmatureAction');
    //     const action = mixer.clipAction(clip);
    //     action.play();
    
    //     // model.traverse((node)=>{
    //     //     if(node.isMesh){
    //     //         node.castShadow = true
    //     //     }
    //     // })
    
    //     model.traverse((node) => {
    //         if (node.isMesh) console.log(node.id)
    //     });
    
    // }, undefined, function (error) {
    //     console.error(error);
    // }); 

    const planeGeometry = new THREE.PlaneGeometry(30, 30);
    const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFFFF, side: THREE.DoubleSide, dithering: true })
    const plane = new THREE.Mesh(planeGeometry, planeMaterial)
    plane.rotation.x = -0.5 * Math.PI
    plane.position.set(x,y,z)
    scene.add(plane)

    this.update =(delta)=>{
    //   if (mixer) mixer.update(delta);
    } 

    this.getModel =  ()=>{
      return model;
    }
  }
}

export default Tundra;
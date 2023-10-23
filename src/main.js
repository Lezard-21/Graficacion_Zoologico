import './css/style.css'
import SceneManager from './scene/SceneManager';

const canvas = document.getElementById('bg');
const ObjSceneManager = new SceneManager(canvas);

// bindEventListeners();
render();

// function bindEventListeners() {
// 	window.onresize = resizeCanvas();
// 	resizeCanvas();	
// }

// function resizeCanvas() {
//     ObjSceneManager.onWindowResize();
// }

 function render() {
     requestAnimationFrame(render);
     ObjSceneManager.update();
 }

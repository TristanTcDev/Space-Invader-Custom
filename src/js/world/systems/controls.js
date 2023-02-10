import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Doc : https://threejs.org/docs/#examples/en/controls/OrbitControls

function createControls(camera, canvas) {
    const controls  = new OrbitControls(camera, canvas);
    controls.target = new THREE.Vector3(0, 0, 0);  // replace camera.lookAt
    controls.tick = () => controls.update();

  return controls;
}

export { createControls };
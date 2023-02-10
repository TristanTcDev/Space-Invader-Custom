import * as THREE from 'three';

// Doc : https://threejs.org/docs/#api/en/cameras/Camera

function createCamera() {
  
  const center = new THREE.Vector3(0, 0, 0);

  const h = window.innerHeight;
  const w = window.innerWidth;
  const aspectRatio = w / h;

  const camera = new THREE.PerspectiveCamera( 75, w / h, 0.1, 1000 );
  camera.position.z = 0;
  camera.position.y = 20;
  camera.lookAt(center);

  return camera;
}

export { createCamera };

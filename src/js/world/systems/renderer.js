import * as THREE from 'three';

// Doc : https://threejs.org/docs/#api/en/renderers/WebGLRenderer

function createRenderer() {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.outputEncoding = THREE.sRGBEncoding;
  //document.body.appendChild( renderer.domElement );
  return renderer;
}

export { createRenderer };




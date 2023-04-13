import * as THREE from 'three';

function createRenderer() {
  const renderer = new THREE.WebGLRenderer({ 
    powerPreference:"high-performance",
    antialias: false, 
  });
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.shadowMap.enabled = true;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.localClippingEnabled = true;
  document.body.appendChild( renderer.domElement );
  return renderer;
}

export { createRenderer };




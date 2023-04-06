import * as THREE from 'three';

// Doc : https://threejs.org/docs/#api/en/lights/Light

function createLights(scene, helpersLayer) {

  //lights, 3 point lighting
  const col_light = 0xffffff; // set

  //const light = new THREE.AmbientLight(col_light, 0.6);

  const keyLight = new THREE.DirectionalLight(col_light, 0.6);
  keyLight.position.set(20, 30, 10);
  keyLight.castShadow = true;

  scene.add( keyLight);
/*
  const keyLightHelper = new THREE.DirectionalLightHelper(keyLight);
  const shadowHelper = new THREE.CameraHelper(keyLight.shadow.camera);
  
  const helpersGroup = new THREE.Group();
  helpersGroup.add(keyLightHelper, shadowHelper);  
  
  // Put helpers in a separate layer
  helpersGroup.traverse( (child) => {
    child.layers.set(helpersLayer);
  })
  
  scene.add(helpersGroup);*/
}

export { createLights };

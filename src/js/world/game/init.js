import * as THREE from "three";

import { spawnEnnemy } from "./game";
import { Level } from "./config";
import { generateAbris } from "./abris";


function initGame(scene, camera) {
    createStar(scene);
    const areturn = spawnEnnemy(scene, camera);
    generateAbris(scene);
    return areturn;
  }

function createStar( scene) {
  Level.starbox = new THREE.BufferGeometry();
  Level.verticestar = {
      positions: [],
      accelerations: [],
      velocities: []
  };
  for(let i = 0; i < 5000; i++) {
    Level.verticestar.positions.push(Math.random() * 600 - 300);
      if (i % 3 === 0) {
        Level.verticestar.accelerations.push(0)
        Level.verticestar.velocities.push(.2)
      }
  }
  Level.starbox.setAttribute('position', new THREE.BufferAttribute(new Float32Array(Level.verticestar.positions), 3));
  let starMaterial = new THREE.PointsMaterial({
    color: 0xaaaaaa,
    size: 0.7
  });

  Level.stars = new THREE.Points(Level.starbox,starMaterial);
  scene.add(Level.stars);
}

export { initGame };
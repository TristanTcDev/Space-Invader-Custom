import * as THREE from 'three';
import { Ennemy, Level } from './config';


function spawnEnnemy(scene) {
    var geometry = new THREE.SphereGeometry( Ennemy.radius, Ennemy.segments, Ennemy.segments );
    var normalMesh = new THREE.MeshNormalMaterial();
    Level.wave++;
    if (Level.wave == 1) {
      Level.levelactuelle = Level.lvl1;
      console.log(Level.levelactuelle);
    }
    else if (Level.wave == 2) {
      Level.levelactuelle = Level.lvl2;
      console.log(Level.levelactuelle);
    }
    else if (Level.wave == 3) {
      alert("Gagné");
      return;
    }
    for (let i = 0; i < Level.nbligne; i++) {
      Level.tab[i] = [];
    }
    for (let j = 0; j < Level.nbligne; j++) {
      let ecart = 0;
      for (let i = 0; i < Level.nbcolonne; i++) {
        if (Level.levelactuelle[j][i] != 0) {
          let sphere = new THREE.Mesh( geometry, normalMesh );
          if (i == 0) { 
            sphere.position.set(-7.8 + ecart, 0, -j);
          }
          else { 
            sphere.position.set(-7.8 + ecart, 0, -j);
          }
          scene.add(sphere);
          Level.tab[j][i] = sphere;
  
          ecart += 3.5 * Ennemy.radius;
       }
       else {
          Level.tab[j][i] = 0;
          ecart += 3.5 * Ennemy.radius;
       }
      }
    }
    for (let j = 0; j <= Level.nbligne-1; j++) {
      for (let i = 0; i <= 9; i++) {
        if (Level.tab[j][i] == 0) {
          Level.tab[j].splice(i, 1);
          Level.levelactuelle[j].splice(i, 1);
        }
      }
    }

}


export { spawnEnnemy };
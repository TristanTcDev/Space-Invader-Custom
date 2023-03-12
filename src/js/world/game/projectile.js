

import * as THREE from 'three';
import { Ennemy, Level, Player } from './config';
import { playAnimationEnnemy } from './animation';


var boxGeometry = new THREE.BoxGeometry(0.3, 0.3, 1);
var boxMaterial = new THREE.MeshNormalMaterial();


function getRandomInt(i) {
    return Math.floor(Math.random() * i);
  }
// Fonction pour crée un nouveau projectile ennemie
function createProjectileEnnemie(scene) {
    if (!Level.started) return;
    if (Level.tab[0].length == 0) return;
    var newProjectileEnnemy = new THREE.Mesh(boxGeometry, boxMaterial);

    let numalienj = getRandomInt(Level.tab.length);
    let numalieni = getRandomInt(Level.tab[numalienj].length);

    let bug = 0;
    while (Math.abs(Level.tab[numalienj][numalieni].position.x - Player.playerModel.position.x) > 10 / Level.wave && bug < 100 ) {
      numalienj = getRandomInt(Level.tab.length);
      numalieni = getRandomInt(Level.tab[numalienj].length);
      bug++;
    }
    console.log("nb iteration: " + bug);

    playAnimationEnnemy(3,1, Ennemy.ennemybodyData[0], Level.tab[numalienj][numalieni], numalienj, numalieni, Ennemy.ennemymixer[numalienj][numalieni]);
    
    newProjectileEnnemy.position.set(Level.tab[numalienj][numalieni].position.x, Level.tab[0][0].position.y, Level.tab[numalienj][numalieni].position.z);
    switch (Level.levelactuelle[numalienj][numalieni]) {
      case 1:
        newProjectileEnnemy.velocity = new THREE.Vector3(0, 0, Ennemy.projectilespeedEnnemy);
        break;
      case 2:
        newProjectileEnnemy.velocity = new THREE.Vector3(0, 0, Ennemy.projectilespeedEnnemy);
        break;
      case 3:
        newProjectileEnnemy.velocity = new THREE.Vector3(0, 0, Ennemy.projectilespeedEnnemy);
        break;
      case 4:
        newProjectileEnnemy.velocity = new THREE.Vector3(0, 0, Ennemy.projectilespeedEnnemy);
        break;
      default:
        console.log("error dans projectile.js");
        break;
    }

    scene.add(newProjectileEnnemy);
    Ennemy.projectilesEnnemy.push(newProjectileEnnemy);

    setTimeout(function() {
      console.log("test");
      if (Level.tab[numalienj][numalieni] != undefined) {
        playAnimationEnnemy(13,1, Ennemy.ennemybodyData[0], Level.tab[numalienj][numalieni], numalienj, numalieni, Ennemy.ennemymixer[numalienj][numalieni]);
      }
    }, 1900);


    return [numalienj, numalieni];
  }

function createProjectile(scene) {
  if (!Level.started) return;
  if (Player.projectiles.length >= Player.projectilesmaxPlayer) return;
  var newProjectile = new THREE.Mesh(boxGeometry, boxMaterial);
  newProjectile.position.set(Player.playerModel.position.x, Player.playerModel.position.y + 1, Player.playerModel.position.z - 1.2);
  newProjectile.velocity = new THREE.Vector3(0, 0, - Player.projectilespeed);
  scene.add(newProjectile);
  Player.projectiles.push(newProjectile);
}

export { createProjectileEnnemie, createProjectile }
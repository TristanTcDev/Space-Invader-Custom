

import * as THREE from 'three';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { Ennemy, Level, Player, musicANDsound } from './config';
import { playAnimationEnnemy } from './animation';


function getRandomInt(i) {
    return Math.floor(Math.random() * i);
  }
// Fonction pour crée un nouveau projectile ennemie
function createProjectileEnnemie(scene) {
    if (!Level.started) return;
    if (Level.tab[0].length == 0) return;
    var newProjectileEnnemy = clone(Ennemy.ennemyModel[4]);

    let numalienj = getRandomInt(Level.tab.length);
    let numalieni = getRandomInt(Level.tab[numalienj].length);

    let maxboucle = 0;
    // Plus le nombre de vague augmente plus la probabilité que l'ennemie qui tir soit en face du joueur augmente
    while (Math.abs(Level.tab[numalienj][numalieni].position.x - Player.playerModel[0].position.x) > 10 / Level.wave && maxboucle < 100 ) {
      numalienj = getRandomInt(Level.tab.length);
      numalieni = getRandomInt(Level.tab[numalienj].length);
      maxboucle++;
    }

    if (Ennemy.ennemyanim[numalienj][numalieni]._clip.name == "yuumi_crit01") {
      return;
    }
    Ennemy.ennemyanim[numalienj][numalieni] = playAnimationEnnemy(3,1, Ennemy.ennemybodyData[0], Level.tab[numalienj][numalieni], numalienj, numalieni, Ennemy.ennemymixer[numalienj][numalieni]);
    
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
      if (Level.tab[numalienj][numalieni] != undefined) {
        Ennemy.ennemyanim[numalienj][numalieni] = playAnimationEnnemy(13,1, Ennemy.ennemybodyData[0], Level.tab[numalienj][numalieni], numalienj, numalieni, Ennemy.ennemymixer[numalienj][numalieni]);
      }
    }, 1900);


    return [numalienj, numalieni];
  }

function createProjectile(scene) {
  if (!Level.started) return;
  if (Player.projectiles.length >= Player.projectilesmaxPlayer) return;
  musicANDsound.soundeffectArray["corkishoot"].play();
  var newProjectile = clone(Player.playerModel[1]);
  newProjectile.position.set(Player.playerModel[0].position.x, Player.playerModel[0].position.y + 1, Player.playerModel[0].position.z - 1.2);
  newProjectile.velocity = new THREE.Vector3(0, 0, - Player.projectilespeed);
  scene.add(newProjectile);
  Player.projectiles.push(newProjectile);
}

export { createProjectileEnnemie, createProjectile }
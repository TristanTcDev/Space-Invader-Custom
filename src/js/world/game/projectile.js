

import * as THREE from 'three';
import { Ennemy, Level, Player } from './config';


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
    console.log(numalieni + " " + numalienj);
    console.log(Level.tab);
    newProjectileEnnemy.position.set(Level.tab[numalienj][numalieni].position.x, Level.tab[0][0].position.y, Level.tab[numalienj][numalieni].position.z);
    newProjectileEnnemy.velocity = new THREE.Vector3(0, 0, Ennemy.projectilespeedEnnemy);
    scene.add(newProjectileEnnemy);
    Ennemy.projectilesEnnemy.push(newProjectileEnnemy);
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
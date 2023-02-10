import * as THREE from 'three'
import { gsap } from "gsap";
import buzz from 'buzz';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Key, Keyboard } from 'keyboard-ts';
import { World } from './world/world.js';


const container = document.querySelector('#canvas');
console.log(container);

const world = new World(container);

var radius = 0.5;
var segments = 32;
var geometry = new THREE.SphereGeometry( radius, segments, segments );
var normalMesh = new THREE.MeshNormalMaterial();
var boxHelper;

var playerspeed = 1.5;
var vie = 1;
var animationPlayed = true;

var mixer, action, clip, bodyData, playerModel;
const clock = new THREE.Clock();

var boxGeometry = new THREE.BoxGeometry(0.3, 0.3, 1);
var boxMaterial = new THREE.MeshNormalMaterial();
var projectiles = [];
var projectilespeed = 0.4;
var projectilesmaxPlayer = 1;

var center = new THREE.Vector3(0, 0, 0);
var quelcamera = 0;
let cameraTransitionInProgress = false;
var scene, camera, renderer;
// function to generate a random number between 0 and i
function getRandomInt(i) {
  return Math.floor(Math.random() * i);
}

// Fonction pour créer un nouveau projectile


const keyboardid = document.getElementById('keyboard')
const keyboard = new Keyboard(keyboardid)
// listen to Del + Esc
/*
keyboard.on([ Key.LeftArrow ], () => {
  if (started == true && !paused && tab[0].length > 0) { // flèche gauche
    gsap.to(playerModel.position, {
      duration: 0.1,
      x: playerModel.position.x - playerspeed,
      ease: "linear",
    });
    if (quelcamera == 1) {
        gsap.to(camera.position, {
            duration: 0.1,
            x: camera.position.x - playerspeed,
            ease: "linear",
        });
    }
  }
})

keyboard.on([ Key.RightArrow ], () => {
  if (started == true && !paused && tab[0].length > 0) { // flèche droite
    gsap.to(playerModel.position, {
      duration: 0.1,
      x: playerModel.position.x + playerspeed,
      ease: "linear",
    });
    if (quelcamera == 1) {
        gsap.to(camera.position, {
            duration: 0.1,
            x: camera.position.x + playerspeed,
            ease: "linear",
        });
    }
  }
})*/

document.addEventListener('keydown', function(event) {
  if (event.code === "ArrowLeft" && started == true && !paused && tab[0].length > 0) { // flèche gauche
    gsap.to(playerModel.position, {
      duration: 0.1,
      x: playerModel.position.x - playerspeed,
      ease: "linear",
    });
    if (quelcamera == 1) {
        gsap.to(camera.position, {
            duration: 0.1,
            x: camera.position.x - playerspeed,
            ease: "linear",
        });
    }
  }
  if (event.code == "ArrowRight" && started == true && !paused && tab[0].length > 0) { // flèche droite
    gsap.to(playerModel.position, {
      duration: 0.1,
      x: playerModel.position.x + playerspeed,
      ease: "linear",
    });
    if (quelcamera == 1) {
        gsap.to(camera.position, {
            duration: 0.1,
            x: camera.position.x + playerspeed,
            ease: "linear",
        });
    }
  }
 });

function scaleModel(model, scale) {
  model.scale.set(scale, scale, scale);
}

async function main() {
  init();
  await initAsync();
  animate();
}
main();
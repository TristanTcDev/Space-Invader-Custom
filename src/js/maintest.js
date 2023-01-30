import * as THREE from 'three'
import { gsap } from "gsap";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

var xSpeed = 0.01;
var radius = 0.5;
var segments = 32;
var geometry = new THREE.SphereGeometry( radius, segments, segments );
var normalMesh = new THREE.MeshNormalMaterial();

var cubespeed = 0.8;
var cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
var normalMaterial = new THREE.MeshNormalMaterial();
var cube = new THREE.Mesh(cubeGeometry, normalMaterial);
var vie = 3;

var invincible = false;
var started = false;
var paused = false;
var tab = [];
var nbligne = 5;
var nbcolonne = 10;
var levelactuelle = [];
var score = 0;
var wave = 1;

console.log(levelactuelle);
var lvl1 = [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3]]

var lvl2 = [[1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
            [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3]]
levelactuelle = lvl1;
for (let i = 0; i < nbligne; i++) {
  tab[i] = [];
}
console.log(levelactuelle);

var boxGeometry = new THREE.BoxGeometry(0.3, 0.3, 1);
var boxMaterial = new THREE.MeshNormalMaterial();
var projectiles = [];
var projectilespeed = 0.8;

var projectilesEnnemy = [];
var projectilespeedEnnemy = 0.1;

var center = new THREE.Vector3(0, 0, 0);
var quelcamera = 0;
let cameraTransitionInProgress = false;
var scene, camera, renderer;

var probability = 0.01; // probabilité de tirer un projectile (entre 0 et 1)
function getRandomNumber() {
  return Math.random();
}
// function to generate a random number between 0 and i
function getRandomInt(i) {
  return Math.floor(Math.random() * i);
}




// Fonction pour créer un nouveau projectile
function createProjectile() {
  if (!started) return;
  if (projectiles.length >= 1) return;
  var newProjectile = new THREE.Mesh(boxGeometry, boxMaterial);
  newProjectile.position.set(cube.position.x, cube.position.y, cube.position.z);
  newProjectile.velocity = new THREE.Vector3(0, 0, - projectilespeed);
  scene.add(newProjectile);
  projectiles.push(newProjectile);
}

// Fonction pour crée un nouveau projectile ennemie
function createProjectileEnnemie() {
  if (!started) return;
  if (projectilesEnnemy.length >= 5) return;

  if (tab[0].length == 0) return;
  var newProjectileEnnemy = new THREE.Mesh(boxGeometry, boxMaterial);
  var numalien = getRandomInt(tab[0].length)
  newProjectileEnnemy.position.set(tab[0][numalien].position.x, tab[0][0].position.y, tab[0][numalien].position.z);
  newProjectileEnnemy.velocity = new THREE.Vector3(0, 0, projectilespeedEnnemy);
  scene.add(newProjectileEnnemy);
  projectilesEnnemy.push(newProjectileEnnemy);
}


document.addEventListener('keydown', function(event) {
  if (event.code === 'Space' && tab[0].length > 0) {
    createProjectile();
  }
  if (event.code === "Numpad0" && !cameraTransitionInProgress) {
    cameraTransitionInProgress = true;
    gsap.to(camera.position, {
        duration: 3,
        x: 0,
        y: 20,
        z: 0,
        onComplete: function() {
          cameraTransitionInProgress = false;
        }
    });
    quelcamera = 0;
  }
  if (event.code === "Numpad1" && !cameraTransitionInProgress) {
    cameraTransitionInProgress = true;
    gsap.to(camera.position, {
        duration: 0.5,
        x: cube.position.x,
        y: cube.position.y + 2,
        z: cube.position.z + 2,
        onComplete: function() {
          cameraTransitionInProgress = false;
        }
    });
    quelcamera = 1;
  }
  if (event.code === "Numpad2" && !cameraTransitionInProgress) {
    cameraTransitionInProgress = true;
    gsap.to(camera.position, {
        duration: 4,
        x: 20,
        y: 20,
        z: 0,
        onComplete: function() {
          cameraTransitionInProgress = false;
        }
    });
    quelcamera = 2;
  }
  if (event.code === "ArrowLeft" && started == true && !paused && tab[0].length > 0) { // flèche gauche
    gsap.to(cube.position, {
      duration: 0.1,
      x: cube.position.x - cubespeed,
      ease: "linear",
  });
    if (quelcamera == 1) {
        gsap.to(camera.position, {
            duration: 0.1,
            x: camera.position.x - cubespeed,
            ease: "linear",
        });
    }
  }
  if (event.code == "ArrowRight" && started == true && !paused && tab[0].length > 0) { // flèche droite
    gsap.to(cube.position, {
      duration: 0.1,
      x: cube.position.x + cubespeed,
      ease: "linear",
  });
    if (quelcamera == 1) {
        gsap.to(camera.position, {
            duration: 0.1,
            x: camera.position.x + cubespeed,
            ease: "linear",
        });
    }
  }
  if (event.code == "KeyI" && started == true && !paused && tab[0].length > 0) { // Invincible
    invincible = !invincible;
    console.log(invincible);
  }
  if (event.code == "KeyK" &&  started == true && !paused && tab[0].length > 0) { // Kill all aliens
    console.log(tab)
    for (var k = 0; k < tab.length; k++){
      for (var j = 0; j < tab[k].length; j++) {
        scene.remove(tab[k][j]); // Retirer la sphère de la scène
      }
      tab[k].splice(0, tab[k].length); // Retirer les sphère du tableau
    }
    console.log(tab)
  }
});

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  camera.position.z = 0;
  camera.position.y = 20;
  camera.lookAt(center);
  
  
  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );


  cube.position.set(0, 0, 10); // initialise la position du cube
  scene.add(cube);
  
  for (let j = 0; j < nbligne; j++) {
    let ecart = 0;
    for (let i = 0; i < nbcolonne; i++) {
      if (levelactuelle[j][i] != 0) {
        console.log("ok");
        let sphere = new THREE.Mesh( geometry, normalMesh );
        if (i == 0) { 
          sphere.position.set(-7.8 + ecart, 0, -j);
        }
        else { 
          sphere.position.set(-7.8 + ecart, 0, -j);
        }
        scene.add(sphere);
        tab[j][i] = sphere;
        //console.log(tab);
        //console.log(tab[i].position.x)
        ecart += 3.5 * radius;
     }
     else {
        tab[j][i] = 0;
        console.log(tab[j].length);
        ecart += 3.5 * radius;
        console.log(tab);
     }
    }
  }
  for (let j = 0; j <= nbligne-1; j++) {
    for (let i = 0; i <= 9; i++) {
      if (tab[j][i] == 0) {
        tab[j].splice(i, 1);
        levelactuelle[j].splice(i, 1);
      }
    }
  }
  console.log(tab);
  console.log(tab[0].length);
  
  camera.position.z = 5;
  
  
  var animate = function () {
    requestAnimationFrame( animate );
    if (quelcamera == 1) {
      camera.lookAt(cube.position.x, 0, 0);
    }
    else {
      camera.lookAt(center);
    }
    if (cube.position.x < -10) {
      cube.position.x = -10;
    }
    if (cube.position.x > 10) {
        cube.position.x = 10;
    }
    if(started && !paused && tab[0].length > 0) {
      if (!invincible) {
        for (let j = 0; j < tab.length; j++) {
          for (let i = 0; i < tab[j].length; i++) {
            if (tab[j][i] != undefined) {
              tab[j][i].position.x += xSpeed;
              if(tab[j][i].position.x > 10 - radius  || tab[j][i].position.x < -10 + radius ) { 
                xSpeed = -xSpeed;
                for (let m = 0; m < tab.length; m++) {
                  for (let n = 0; n < tab[m].length; n++) {
                    if (tab[m][n] != undefined) {
                      tab[m][n].position.z += 0.5;
                    }
                  }
                }
              }
              //console.log(tab[2][9])
            }
          }
        }
      }
      for (let i = 0; i < projectiles.length; i++) {
        projectiles[i].position.add(projectiles[i].velocity);
        // Vérifier si le projectile est sorti de la zone de jeu
        if (projectiles[i].position.z < -10) {
          
          scene.remove(projectiles[i]);
          projectiles.splice(i, 1);
          i--;
        }
        for (let k = 0; k < tab.length; k++) {
          for (let j = 0; j < tab[k].length; j++) {
            if (tab[k][j] != undefined) {
              if (projectiles[i].position.distanceTo(tab[k][j].position) <= radius * 1.5) {
                  if (levelactuelle[k][j] == 1) score += 10;
                  else if (levelactuelle[k][j] == 2) score += 20;
                  else if (levelactuelle[k][j] == 3) score += 30;
                  console.log(score);
                  scene.remove(tab[k][j]); // Retirer la sphère de la scène
                  if (tab[k].length == 1) {
                    if (tab.length == 1) {
                      tab[k].splice(j, 1);
                      alert("Gagner");
                    }
                    else {
                      tab[k].splice(j, 1);
                      tab.splice(k, 1);
                      k--;
                      j--;
                      console.log(tab);
                    }
                  }
                  else {
                    tab[k].splice(j, 1); // Retirer la sphère du tableau
                  }
                  scene.remove(projectiles[i]); // Retirer le projectile de la scène
                  projectiles.splice(i, 1); // Retirer le projectile du tableau
                  i--;
                  //break;
              }
            }
          }
        }
      }
      if (!invincible) {
        for (let i = 0; i < projectilesEnnemy.length; i++) {
          projectilesEnnemy[i].position.add(projectilesEnnemy[i].velocity);
          // Vérifier si le projectile est sorti de la zone de jeu
          if (projectilesEnnemy[i].position.z > 10) {  
              scene.remove(projectilesEnnemy[i]);
              projectilesEnnemy.splice(i, 1);
              i--;
            }
          else if (projectilesEnnemy[i].position.distanceTo(cube.position) <= radius * 1.5) {
              console.log("cube toucher");
              vie -= 1;
              scene.remove(projectilesEnnemy[i]);
              projectilesEnnemy.splice(i, 1);
              i--;
            }
        }
        if (tab[0].length > 0) {
          if (getRandomNumber() < probability) {
            createProjectileEnnemie();
            console.log("ça tire !");
          }
        }
      }
      if (tab[0][0].position.z > 10 || vie == 0) {
        alert("Perdu !");
        started = false;
        paused = true;
        for (let i = 0; i < projectiles.length; i++) {
          scene.remove(projectiles[i]);
          projectiles.splice(i, 1);
          i--;
        }
        for (let i = 0; i < projectilesEnnemy.length; i++) {
          scene.remove(projectilesEnnemy[i]);
          projectilesEnnemy.splice(i, 1);
          i--;
        }
        for (let i = 0; i < tab.length; i++) {
          for (let j = 0; j < tab[i].length; j++) {
            scene.remove(tab[i][j]);
            tab[i].splice(j, 1);
            j--;
          }
        }
      }
    }
    renderer.render( scene, camera );
  };
  
  animate();
  createMenu();
  scene.add(new THREE.AxesHelper(10))
  scene.add(new THREE.GridHelper(20, 20))
}
document.addEventListener("DOMContentLoaded", function(event) { 
  init();
});

function createMenu() {
    var creditBtn = document.createElement("BUTTON");
    creditBtn.innerHTML = "Crédits";
    creditBtn.style.position = "absolute";
    creditBtn.style.top = "20px";
    creditBtn.style.left = "10px";
    creditBtn.onclick = function() {
      alert("Crédits");
    };
    document.body.appendChild(creditBtn);

    var startBtn = document.createElement("BUTTON");
    startBtn.innerHTML = "Débuter";
    startBtn.style.position = "absolute";
    startBtn.style.top = "20px";
    startBtn.style.left = "4%";
    startBtn.onclick = function() {
      started = true;
    };
    document.body.appendChild(startBtn);

    var optionBtn = document.createElement("BUTTON");
    optionBtn.innerHTML = "Options";
    optionBtn.style.position = "absolute";
    optionBtn.style.top = "20px";
    optionBtn.style.left = "8%";
    optionBtn.onclick = function() {
      alert("Options");
    };
    document.body.appendChild(optionBtn);

    var quitBtn = document.createElement("BUTTON");
    quitBtn.innerHTML = "Quitter";
    quitBtn.style.position = "absolute";
    quitBtn.style.top = "20px";
    quitBtn.style.left = "16%";
    quitBtn.onclick = function() {
      alert("Quitter");
    };
    document.body.appendChild(quitBtn);

    var pauseBtn = document.createElement("BUTTON");
    pauseBtn.innerHTML = "Pause";
    pauseBtn.style.position = "absolute";
    pauseBtn.style.top = "20px";
    pauseBtn.style.left = "12%";
    pauseBtn.onclick = function() {
      paused = !paused;
    };
    document.body.appendChild(pauseBtn);
}



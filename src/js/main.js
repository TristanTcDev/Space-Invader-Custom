import * as THREE from 'three'
import { gsap } from "gsap";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

var xSpeed = 0.01;
var radius = 0.5;
var segments = 32;
var geometry = new THREE.SphereGeometry( radius, segments, segments );
var normalMesh = new THREE.MeshNormalMaterial();
var playerModel;

var cubespeed = 0.8;
var cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
var normalMaterial = new THREE.MeshNormalMaterial();
var cube = new THREE.Mesh(cubeGeometry, normalMaterial);
var vie = 3;
var animationPlayed = true;

let mixer, action, clip, bodyData;
const clock = new THREE.Clock();
const loopOn = true;

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
levelactuelle = lvl2;
for (let i = 0; i < nbligne; i++) {
  tab[i] = [];
}
console.log(levelactuelle);

var boxGeometry = new THREE.BoxGeometry(0.3, 0.3, 1);
var boxMaterial = new THREE.MeshNormalMaterial();
var projectiles = [];
var projectilespeed = 0.2;

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


function playsound(pathing) {
  let audio = new Audio(pathing);
  audio.play();
}

// Fonction pour créer un nouveau projectile
function createProjectile() {
  if (!started) return;
  if (projectiles.length >= 1) return;
  var newProjectile = new THREE.Mesh(boxGeometry, boxMaterial);
  newProjectile.position.set(playerModel.position.x, playerModel.position.y + 1, playerModel.position.z - 1.2);
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
  if (event.code === 'Space' && tab[0].length > 0 && projectiles.length == 0 && started && !paused && animationPlayed) {
    animationPlayed = false;    
    playAnimation(2);
    setTimeout(function() {
      createProjectile();
      
    }, 300);
    setTimeout(function() {
      playAnimation(9);
      animationPlayed = true
    }, 600);
    
    
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
        x: playerModel.position.x,
        y: playerModel.position.y + 3,
        z: playerModel.position.z + 3,
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
    gsap.to(playerModel.position, {
      duration: 0.1,
      x: playerModel.position.x - cubespeed,
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
    gsap.to(playerModel.position, {
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
  
  
  renderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.outputEncoding = THREE.sRGBEncoding;
  document.body.appendChild( renderer.domElement );

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0,0,0);
  controls.update();
  controls.addEventListener('change', render);


  cube.position.set(0, 0, 10); // initialise la position du cube
  //scene.add(cube);
  // add a plate
  var geometryplate = new THREE.PlaneGeometry( 20, 20, 32 );
  var materialplate = new THREE.MeshBasicMaterial( {color: 0xeeeeee, side: THREE.DoubleSide} );
  var plane = new THREE.Mesh( geometryplate, materialplate );
  plane.position.set(0, -1, 0);
  plane.rotation.x = Math.PI / 2;
  scene.add( plane );
  
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
  
  render();
  createMenu();
  scene.add(new THREE.AxesHelper(10))
  scene.add(new THREE.GridHelper(20, 20))
}

function animate() {
  requestAnimationFrame( animate );
  if (quelcamera == 1) {
    camera.lookAt(playerModel.position.x, 0, 0);
  }
  else {
    camera.lookAt(center);
  }
  if (playerModel.position.x < -10) {
    playerModel.position.x = -10;
  }
  if (playerModel.position.x > 10) {
    playerModel.position.x = 10;
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
        else if (projectilesEnnemy[i].position.distanceTo(playerModel.position) <= 1.5) {
            console.log("playerModel toucher");
            if(vie >= 3) playsound('src/medias/sounds/douleur_1.mp3');
            else if(vie == 2) playsound('src/medias/sounds/douleur_2.mp3');
            else if(vie == 1) playsound('src/medias/sounds/douleur_3.mp3');
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
  render();
  const delta = clock.getDelta();
  mixer.update(delta);
  renderer.render(scene, camera);

}
function loop(isOn) {

  clock.getDelta();
  renderer.setAnimationLoop( !isOn ? null : animate);
  }

function render() {
  renderer.render(scene, camera);
}

function scaleModel(model, scale) {
  model.scale.set(scale, scale, scale);
}

async function initAsync() {
  const loader = new GLTFLoader();
  bodyData = await loader.loadAsync('./src/medias/models/scene.gltf');
  playerModel = bodyData.scene;
  scaleModel(playerModel, 0.01);
  playerModel.position.set(0, -1, 10);
  playerModel.rotation.y = Math.PI;
  console.log(playerModel);
  scene.add(playerModel);
  playAnimation(9);

  render();
}

function playAnimation(numAnim) {
  //anim 9 tout le temps, 3 quand on tire, 7 pour esquiver, 24 tir du cheater qui OS tout le monde, 8 quand on meurt
  clip = bodyData.animations[numAnim];
  mixer = new THREE.AnimationMixer(playerModel);
  action = mixer.clipAction(clip);
  action.play();
  action.paused = !loopOn;
}

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
      playsound('src/medias/sounds/C_EST_PARTI.mp3');
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

async function main() {
  init();
  await initAsync();
  animate();
}
main();
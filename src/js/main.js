import * as THREE from 'three'
import { gsap } from "gsap";
import buzz from 'buzz';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Key, Keyboard } from 'keyboard-ts';

const container = document.querySelector('#canvas');
console.log(container);

var xSpeed = 0.05;
var radius = 0.5;
var segments = 32;
var geometry = new THREE.SphereGeometry( radius, segments, segments );
var normalMesh = new THREE.MeshNormalMaterial();
var boxHelper;

var playerspeed = 1.5;
var vie = 1;
var animationPlayed = true;


var smallennemyscore = 10;
var mediumennemyscore = 20;
var bigennemyscore = 30;


var mixer, action, clip, bodyData, playerModel;
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
var wave = 0;
var limgauche = 15;
var limdroite = 15;

var soundeffectArray = [];
soundeffectArray["C_EST_PARTI"] = new buzz.sound("src/medias/sounds/C_EST_PARTI.mp3");
soundeffectArray["C_EST_PARTI"].setVolume(60);
soundeffectArray["douleur_1"] = new buzz.sound("src/medias/sounds/douleur_1.mp3");
soundeffectArray["douleur_2"] = new buzz.sound("src/medias/sounds/douleur_2.mp3");
soundeffectArray["douleur_3"] = new buzz.sound("src/medias/sounds/douleur_3.mp3");


var musicArray = [];
musicArray["music_intro"] = new buzz.sound("src/medias/sounds/music_intro.mp3");
musicArray["music_intro"].setVolume(15);
musicArray["music_ambiance"] = new buzz.sound("src/medias/sounds/music_ambiance.mp3");
musicArray["music_ambiance"].setVolume(15);
musicArray["music_ambiance"].loop();

console.log(musicArray.length);

var lvl1 = [[0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3]]

var lvl2 = [[1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
            [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3]]
levelactuelle = lvl1;

var boxGeometry = new THREE.BoxGeometry(0.3, 0.3, 1);
var boxMaterial = new THREE.MeshNormalMaterial();
var projectiles = [];
var projectilespeed = 0.4;
var projectilesmaxPlayer = 1;

var projectilesEnnemy = [];
var projectilespeedEnnemy = 0.1;
var projectilesmaxEnnemy = 1;

var center = new THREE.Vector3(0, 0, 0);
var quelcamera = 0;
let cameraTransitionInProgress = false;
var scene, camera, renderer;
// function to generate a random number between 0 and i
function getRandomInt(i) {
  return Math.floor(Math.random() * i);
}


function spawnEnnemy() {
  wave++;
  if (wave == 1) {
    levelactuelle = lvl1;
    console.log(levelactuelle);
  }
  else if (wave == 2) {
    levelactuelle = lvl2;
    console.log(levelactuelle);
  }
  else if (wave == 3) {
    alert("Gagné");
    return;
  }
  for (let i = 0; i < nbligne; i++) {
    tab[i] = [];
  }
  for (let j = 0; j < nbligne; j++) {
    let ecart = 0;
    for (let i = 0; i < nbcolonne; i++) {
      if (levelactuelle[j][i] != 0) {
        let sphere = new THREE.Mesh( geometry, normalMesh );
        if (i == 0) { 
          sphere.position.set(-7.8 + ecart, 0, -j);
        }
        else { 
          sphere.position.set(-7.8 + ecart, 0, -j);
        }
        scene.add(sphere);
        tab[j][i] = sphere;

        ecart += 3.5 * radius;
     }
     else {
        tab[j][i] = 0;
        ecart += 3.5 * radius;
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

}

// Fonction pour créer un nouveau projectile
function createProjectile() {
  if (!started) return;
  if (projectiles.length >= projectilesmaxPlayer) return;
  var newProjectile = new THREE.Mesh(boxGeometry, boxMaterial);
  newProjectile.position.set(playerModel.position.x, playerModel.position.y + 1, playerModel.position.z - 1.2);
  newProjectile.velocity = new THREE.Vector3(0, 0, - projectilespeed);
  scene.add(newProjectile);
  projectiles.push(newProjectile);
}

// Fonction pour crée un nouveau projectile ennemie
function createProjectileEnnemie() {
  if (!started) return;
  if (tab[0].length == 0) return;
  var newProjectileEnnemy = new THREE.Mesh(boxGeometry, boxMaterial);
  let numalieni = getRandomInt(tab[0].length)
  let numalienj = getRandomInt(tab.length)
  newProjectileEnnemy.position.set(tab[numalienj][numalieni].position.x, tab[0][0].position.y, tab[numalienj][numalieni].position.z);
  newProjectileEnnemy.velocity = new THREE.Vector3(0, 0, projectilespeedEnnemy);
  scene.add(newProjectileEnnemy);
  projectilesEnnemy.push(newProjectileEnnemy);
}

const keyboardid = document.getElementById('keyboard')
const keyboard = new Keyboard(keyboardid)
// listen to Del + Esc
keyboard.on([ Key.Space ], () => {
  if (tab[0].length > 0 && projectiles.length < projectilesmaxPlayer && started && !paused && animationPlayed) {
    event.preventDefault();
    animationPlayed = false;    
    playAnimation(2, 2);
    setTimeout(function() {
      createProjectile();
      
    }, 150);
    setTimeout(function() {
      playAnimation(9);
      animationPlayed = true
    }, 300);
  }
})

keyboard.on([ Key.Numpad0 ], () => {
  if ( !cameraTransitionInProgress) {
    cameraTransitionInProgress = true;
    gsap.to(camera.position, {
        duration: 3,
        x: 0,
        y: 20,
        z: 5,
        onComplete: function() {
          cameraTransitionInProgress = false;
        }
    });
    quelcamera = 0;
  }
})

keyboard.on([ Key.Numpad1 ], () => {
  if ( !cameraTransitionInProgress) {
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

})

keyboard.on([ Key.Numpad2 ], () => {
  if (!cameraTransitionInProgress) {
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
})

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
})

keyboard.on([ Key.I ], () => {
  if (started == true && !paused && tab[0].length > 0) { // Invincible
    invincible = !invincible;
    console.log(invincible);
    if (invincible) {
      projectilespeed = projectilespeed * 2;
      projectilesmaxPlayer = 10;
    }
    else {
      projectilespeed = projectilespeed / 2;
      projectilesmaxPlayer = 1;
    }
  }
})

keyboard.on([ Key.K ], () => {
  if (started == true && !paused && tab[0].length > 0) { // Kill all aliens
    for (var k = 0; k < tab.length; k++){
      for (var j = 0; j < tab[k].length; j++) {
        scene.remove(tab[k][j]); // Retirer la sphère de la scène
      }
      tab[k].splice(0, tab[k].length); // Retirer les sphère du tableau
      levelactuelle[k].splice(0, levelactuelle[k].length);
    }
    spawnEnnemy();
  }
})





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

  // add a plate
  var geometryplate = new THREE.PlaneGeometry( 20, 20, 32 );
  var materialplate = new THREE.MeshBasicMaterial( {color: 0xeeeeee, side: THREE.DoubleSide} );
  var plane = new THREE.Mesh( geometryplate, materialplate );
  plane.position.set(0, -1, 0);
  plane.rotation.x = Math.PI / 2;
  scene.add( plane );
  

  
  render();
  createMenu();
  //scene.add(new THREE.AxesHelper(10))
  //scene.add(new THREE.GridHelper(20, 20))
}

function addScore(scoreennemi, i, j) {
  // ce baser sur https://codepen.io/sureshwisdom/pen/gObavym
  score += scoreennemi;
  var message = "+" + scoreennemi;
  var parameters = { fontsize: 20, textColor: {r:255, g:0, b:0, a:1.0}}
  if ( parameters === undefined ) parameters = {};
  var fontface = parameters.hasOwnProperty("fontface") ? parameters["fontface"] : "Courier New";
  var fontsize = parameters.hasOwnProperty("fontsize") ? parameters["fontsize"] : 18;
  var borderThickness = parameters.hasOwnProperty("borderThickness") ? parameters["borderThickness"] : 4;
  var borderColor = parameters.hasOwnProperty("borderColor") ?parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };
  var textColor = parameters.hasOwnProperty("textColor") ?parameters["textColor"] : { r:255, g:0, b:0, a:1.0 };

  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');
  context.font = "Bold " + fontsize + "px " + fontface;
  context.fillStyle = "rgba("+textColor.r+", "+textColor.g+", "+textColor.b+", 1.0)";
  context.fillText( message, borderThickness, fontsize + borderThickness);

  var texture = new THREE.Texture(canvas) 
  texture.needsUpdate = true;
  var spriteMaterial = new THREE.SpriteMaterial( { map: texture } );
  var sprite = new THREE.Sprite( spriteMaterial );
  sprite.scale.set(0.5 * fontsize, 0.25 * fontsize, 0.75 * fontsize);
  if (quelcamera == 2) {
    sprite.position.set(tab[i][j].position.x + 3, tab[i][j].position.y, tab[i][j].position.z - 3.5);
  }
  else {
    sprite.position.set(tab[i][j].position.x + 4.5, tab[i][j].position.y, tab[i][j].position.z);
  }
  scene.add(sprite);
  gsap.to(sprite.position, {
    duration: 1,
    x: sprite.position.x,
    y: sprite.position.y + 1,
    z: sprite.position.z,
    ease: "linear",
    onComplete: function() {
      scene.remove(sprite);
    }
  });
  //return sprite;
}

function animate() {
  requestAnimationFrame( animate );
  if (quelcamera == 1) {
    camera.lookAt(playerModel.position.x, 0, 0);
  }
  else {
    camera.lookAt(center);
  }
  if (playerModel.position.x < -limgauche) {
    playerModel.position.x = -limgauche;
  }
  if (playerModel.position.x > limdroite) {
    playerModel.position.x = limdroite;
  }
  if(started && !paused && tab[0].length > 0) {
    if (!invincible) {
      for (let j = 0; j < tab.length; j++) {
        for (let i = 0; i < tab[j].length; i++) {
          if (tab[j][i] != undefined) {
            tab[j][i].position.x += xSpeed;
            if(tab[j][i].position.x > limdroite - radius  || tab[j][i].position.x < - limgauche + radius ) { 
              xSpeed = -xSpeed;
              for (let m = 0; m < tab.length; m++) {
                for (let n = 0; n < tab[m].length; n++) {
                  if (tab[m][n] != undefined) {
                    tab[m][n].position.z += 0.5;
                  }
                }
              }
            }
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
            if (projectiles[i] != undefined) {
              if (projectiles[i].position.distanceTo(tab[k][j].position) <= radius * 1.5) {
                  if (levelactuelle[k][j] == 1) addScore(smallennemyscore, k, j);
                  else if (levelactuelle[k][j] == 2) addScore(mediumennemyscore, k, j);
                  else if (levelactuelle[k][j] == 3) addScore(bigennemyscore, k, j);
                  console.log(score);
                  scene.remove(tab[k][j]); // Retirer la sphère de la scène
                  
                  if (tab[k].length == 1) {
                    if (tab.length == 1) {
                      tab[k].splice(j, 1);
                      spawnEnnemy();
                    }
                    else {
                      tab[k].splice(j, 1); // retire la sphère du tableau
                      tab.splice(k, 1); // retire la ligne du tableau
                      levelactuelle[k].splice(j, 1);
                      levelactuelle.splice(k, 1);
                      k--;
                      j--;
                      //console.log(tab);
                    }
                  }
                  else {
                    tab[k].splice(j, 1); // Retirer la sphère du tableau
                    levelactuelle[k].splice(j, 1);
                  }
                  scene.remove(projectiles[i]); // Retirer le projectile de la scène
                  projectiles.splice(i, 1); // Retirer le projectile du tableau
                  i--;
                  //break;
                  //console.log(levelactuelle);
                  //console.log(tab);
              }
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
            if(vie >= 3) soundeffectArray["douleur_1"].play();
            else if(vie == 2) soundeffectArray["douleur_2"].play();
            else if(vie == 1) soundeffectArray["douleur_3"].play();
            vie -= 1;
            scene.remove(projectilesEnnemy[i]);
            projectilesEnnemy.splice(i, 1);
            i--;
            started = false;
          }
      }
      if (tab[0].length > 0) {
          if (projectilesEnnemy.length <= projectilesmaxEnnemy) {
          createProjectileEnnemie();
          console.log("ça tire !");
        }
      }
    }
    if (tab[0][0].position.z > 10 || vie == 0) {
      //alert("Perdu !");
      playAnimation(7);
      started = false;
      setTimeout(function() {
        action.paused = true;
      }, 1250);
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
    boxHelper.update();
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
  spawnEnnemy();
  console.log(tab);
  console.log(tab[0].length);
  
  camera.position.z = 5;
  //  const box = new THREE.Box3().setFromObject(playerModel);
  boxHelper = new THREE.BoxHelper(playerModel, 0xff0000);
  scene.add(boxHelper);

  render();
}

function playAnimation(numAnim, speed = 1) {
  //anim 9 tout le temps, 3 quand on tire, 7 pour esquiver, 24 tir du cheater qui OS tout le monde, 8 quand on meurt
    clip = bodyData.animations[numAnim];
    mixer = new THREE.AnimationMixer(playerModel);
    mixer.timeScale = speed;
    action = mixer.clipAction(clip);
    action.play();
    action.paused = !loopOn;
}

function createMenu() {
    var creditBtn = document.createElement("BUTTON");
    creditBtn.innerHTML = "Stop Sound Effect";
    creditBtn.style.position = "absolute";
    creditBtn.style.top = "20px";
    creditBtn.style.left = "10px";
    creditBtn.onclick = function() {
      for(var sound in soundeffectArray){
        soundeffectArray[sound].toggleMute();
        console.log(soundeffectArray[sound].isMuted);
      }
    };
    document.body.appendChild(creditBtn);

    var startBtn = document.createElement("BUTTON");
    startBtn.innerHTML = "Débuter";
    startBtn.style.position = "absolute";
    startBtn.style.top = "20px";
    startBtn.style.left = "4%";
    startBtn.onclick = function() {
      started = true;
      musicArray["music_intro"].play();
      setTimeout(function() {
        soundeffectArray["C_EST_PARTI"].play();
      }, 5000);
      setTimeout(function() {
        musicArray["music_ambiance"].play();
      }, 16000);
    };
    document.body.appendChild(startBtn);

    var optionBtn = document.createElement("BUTTON");
    optionBtn.innerHTML = "Stop Music";
    optionBtn.style.position = "absolute";
    optionBtn.style.top = "20px";
    optionBtn.style.left = "8%";
    optionBtn.onclick = function() {
      for(var sound in musicArray){
        musicArray[sound].toggleMute();
      }
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
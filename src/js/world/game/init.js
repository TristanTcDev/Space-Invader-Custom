import * as THREE from "three";

import { spawnEnnemy } from "./ennemy";
import { musicANDsound, Level } from "./config";
import { generateAbris } from "./abris";


function initGame(scene, camera) {
    // add a plate
    var geometryplate = new THREE.PlaneGeometry( 20, 20, 32 );
    var materialplate = new THREE.MeshPhongMaterial( {color: 0xeeeeee, side: THREE.DoubleSide } );
    var plane = new THREE.Mesh( geometryplate, materialplate );
    plane.receiveShadow = true;

    plane.position.set(0, -1, 0);
    plane.rotation.x = Math.PI / 2;
    scene.add( plane );

    createStar(scene);
    createMenu();
    scene.add(new THREE.AxesHelper(10));
    scene.add(new THREE.GridHelper(20, 20));
    const areturn = spawnEnnemy(scene, camera);
    generateAbris(scene);
    return areturn;
  }

function createStar( scene) {
  let starBox = new THREE.BufferGeometry();
  let vertices = {
      positions: [],
  };
  for(let i = 0; i < 18000; i++) {
      vertices.positions.push(Math.random() * 600 - 300);
  }
  starBox.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices.positions), 3));

  //let spritestar = new THREE.TextureLoader().load( './src/medias/images/star.png' );
  let starMaterial = new THREE.PointsMaterial({
    color: 0xaaaaaa,
    size: 0.7
    //map: spritestar
  });

  let stars = new THREE.Points(starBox,starMaterial);
  scene.add(stars);
}

  function createMenu() {
    var creditBtn = document.createElement("BUTTON");
    creditBtn.innerHTML = "Stop Sound Effect";
    creditBtn.style.position = "absolute";
    creditBtn.style.top = "20px";
    creditBtn.style.left = "10px";
    creditBtn.onclick = function() {
      for(var sound in musicANDsound.soundeffectArray){
        musicANDsound.soundeffectArray[sound].toggleMute();
        console.log(musicANDsound.soundeffectArray[sound].isMuted);
      }
    };
    document.body.appendChild(creditBtn);

    var startBtn = document.createElement("BUTTON");
    startBtn.innerHTML = "Débuter";
    startBtn.style.position = "absolute";
    startBtn.style.top = "20px";
    startBtn.style.left = "4%";
    startBtn.onclick = function() {
      console.log("Vous avez commencé le jeu");
    };
    document.body.appendChild(startBtn);

    var optionBtn = document.createElement("BUTTON");
    optionBtn.innerHTML = "Stop Music";
    optionBtn.style.position = "absolute";
    optionBtn.style.top = "20px";
    optionBtn.style.left = "8%";
    optionBtn.onclick = function() {
      for(var sound in musicANDsound.musicArray){
        musicANDsound.musicArray[sound].toggleMute();
      }
    };
    document.body.appendChild(optionBtn);

    var quitBtn = document.createElement("BUTTON");
    quitBtn.innerHTML = "Quitter";
    quitBtn.style.position = "absolute";
    quitBtn.style.top = "20px";
    quitBtn.style.left = "16%";
    quitBtn.onclick = function() {
      alert("Vous avez quitté le jeu");
    };
    document.body.appendChild(quitBtn);

    var pauseBtn = document.createElement("BUTTON");
    pauseBtn.innerHTML = "Pause";
    pauseBtn.style.position = "absolute";
    pauseBtn.style.top = "20px";
    pauseBtn.style.left = "12%";
    pauseBtn.onclick = function() {
      Level.paused = !Level.paused;
    };
    document.body.appendChild(pauseBtn);
}

export { initGame };
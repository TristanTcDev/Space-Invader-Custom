import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

import vex from 'vex-js/dist/js/vex.combined.min.js';
import 'vex-js/dist/css/vex.css';
import 'vex-js/dist/css/vex-theme-default.css';
import 'vex-js/dist/css/vex-theme-flat-attack.css';

import { createRenderer }  from './systems/renderer.js';
import { createCamera }  from './components/camera.js';
import { createScene }  from './components/scene.js';
import { createLights } from './components/lights.js';
import { createKeyboard }  from './systems/keyboard.js';

import { Loop }            from './systems/loop.js';
import { gsap } from "gsap";
import { initGame } from './game/init.js';
import { Player, Level, Ennemy, musicANDsound } from './game/config.js';
import { SoundGestion } from './systems/sound.js';
import { loadPM } from './components/Model.js';
import { playAnimation } from './game/animation.js';
import { createProjectile } from './game/projectile.js';
import { spawnEnnemy } from './game/game.js';
import { generateAbris } from './game/abris.js';





const contentClassName = 'vex-custom-content';
const css = `
.${contentClassName} {
  white-space: pre-line;
}`;
const style = document.createElement('style');
style.type = 'text/css';
style.appendChild(document.createTextNode(css));
document.head.appendChild(style);

// configurer vex avec la classe CSS personnalisée
vex.defaultOptions.className = 'vex-theme-os'
vex.defaultOptions.contentClassName = contentClassName;

class World {

  #camera
  #renderer
  #scene
  #loop
  #resizer
  #helpersLayer
  #cameraTransitionInProgress
  #light


  constructor(container) {
    this.#camera = createCamera();
    this.#renderer = createRenderer();
    this.#scene = createScene();
    this.#light = createLights(this.#scene);
    this.#loop = new Loop(this.#camera, this.#scene, this.#renderer);
    createKeyboard(container, this);
    this.#cameraTransitionInProgress = false;
    this.#camera.layers.enableAll();



    container.append(this.#renderer.domElement);
  }

  async init() {
    // Add asynchronous tasks (loading models for example)
    const PM = await loadPM(this.#scene, this.#camera);
    this.#camera.lookAt(new THREE.Vector3(0, 18, -20));
    this.#camera.position.y = this.#camera.position.y -2;
    this.#scene.add(PM[0][0]);
    this.#scene.add(PM[1][0]);
    PM[1][0].position.set(-4, 18.5, -5);
    this.#scene.add(PM[1][1]);
    PM[1][1].position.set(-4, 17, -5);
    this.#scene.add(PM[1][2]);
    PM[1][2].position.set(-4, 15.5, -5);
    this.#scene.add(PM[1][3]);
    PM[1][3].position.set(-4, 14, -5);
    //node_modules/three/examples/fonts/helvetiker_regular.typeface.json
    const loader = new FontLoader();
    const font = await loader.loadAsync( 'src/font/PressStart2P_Regular.json');

    const titlegeometry = new TextGeometry( 'Yuumi Invaders', {
      font: font,
      size: 1,
      height: 0.1,
    } );

    const tableaudescoresgeometry = new TextGeometry( 'Table des scores', {
      font: font,
      size: 0.5,
      height: 0.1,
    } );

    const smallEnnemygeometry = new TextGeometry( '= ' + Ennemy.smallennemyscore + ' points', {
      font: font,
      size: 0.5,
      height: 0.1,
    } );

    const mediumEnnemygeometry = new TextGeometry( '= ' + Ennemy.mediumennemyscore + ' points', {
      font: font,
      size: 0.5,
      height: 0.1,
    } );

    const bigEnnemygeometry = new TextGeometry( '= ' + Ennemy.bigennemyscore + ' points', {
      font: font,
      size: 0.5,
      height: 0.1,
    } );

    const bossEnnemygeometry = new TextGeometry( '= ' + Ennemy.bossennemyscore + ' points', {
      font: font,
      size: 0.5,
      height: 0.1,
    } );

    const authorgeometry = new TextGeometry( 'Par : Tristan Taupiac', {
      font: font,
      size: 0.3,
      height: 0,
    } );

    const entergeometry = new TextGeometry( 'Appuyez sur Entrée pour commencer', {
      font: font,
      size: 0.3,
      height: 0,
    } );
    
    const smallEnnemyText = new THREE.Mesh( smallEnnemygeometry, [
      new THREE.MeshPhongMaterial( { color: 0xFFFFFF } ),
      new THREE.MeshPhongMaterial( { color: 0xFFFFFF } )
    ] );

    const mediumEnnemyText = new THREE.Mesh( mediumEnnemygeometry, [
      new THREE.MeshPhongMaterial( { color: 0xFFFFFF } ),
      new THREE.MeshPhongMaterial( { color: 0xFFFFFF } )
    ] );

    const bigEnnemyText = new THREE.Mesh( bigEnnemygeometry, [
      new THREE.MeshPhongMaterial( { color: 0xFFFFFF } ),
      new THREE.MeshPhongMaterial( { color: 0xFFFFFF } )
    ] );

    const bossEnnemyText = new THREE.Mesh( bossEnnemygeometry, [
      new THREE.MeshPhongMaterial( { color: 0xFFFFFF } ),
      new THREE.MeshPhongMaterial( { color: 0xFFFFFF } )
    ] );

    const titleText = new THREE.Mesh( titlegeometry, [
      new THREE.MeshPhongMaterial( { color: 0x04BFFF } ),
      new THREE.MeshPhongMaterial( { color: 0x04BFFF } )
    ] );

    const tableaudescorestext = new THREE.Mesh( tableaudescoresgeometry, [
      new THREE.MeshPhongMaterial( { color: 0xFFFFFF } ),
      new THREE.MeshPhongMaterial( { color: 0xFFFFFF } )
    ] );

    const authortext = new THREE.Mesh( authorgeometry, [
      new THREE.MeshPhongMaterial( { color: 0xFFFFFF } ),
      new THREE.MeshPhongMaterial( { color: 0xFFFFFF } )
    ] );

    const enterText = new THREE.Mesh( entergeometry, [
      new THREE.MeshPhongMaterial( { color: 0xFFFFFF } ),
      new THREE.MeshPhongMaterial( { color: 0xFFFFFF } )
    ] );


    smallEnnemyText.position.set(PM[1][0].position.x + 1, PM[1][0].position.y, PM[1][0].position.z + 0.2);
    mediumEnnemyText.position.set(PM[1][1].position.x + 1, PM[1][1].position.y, PM[1][1].position.z + 0.2);
    bigEnnemyText.position.set(PM[1][2].position.x + 1, PM[1][2].position.y, PM[1][2].position.z + 0.2);
    bossEnnemyText.position.set(PM[1][3].position.x + 1, PM[1][3].position.y, PM[1][3].position.z + 0.2);
    titleText.position.set(-9, 22, -5);
    tableaudescorestext.position.set(-5.5, 20, -5);
    authortext.position.set(-5, 21.5, -5);
    enterText.position.set(-7, 12, -5);

    this.#scene.add( smallEnnemyText );
    this.#scene.add( mediumEnnemyText );
    this.#scene.add( bigEnnemyText );
    this.#scene.add( bossEnnemyText );
    this.#scene.add( titleText );
    this.#scene.add( tableaudescorestext );
    this.#scene.add( authortext );
    this.#scene.add( enterText );
    

    //var plane = new THREE.Mesh( new THREE.PlaneGeometry( 30, 19 ) , new THREE.MeshBasicMaterial({color: 0x000000, side: THREE.DoubleSide }) );
    //plane.position.set(0, 8, 5);

    Level.loadingOjbects.push(PM[1][0]);
    Level.loadingOjbects.push(PM[1][1]);
    Level.loadingOjbects.push(PM[1][2]);
    Level.loadingOjbects.push(PM[1][3]);
    Level.loadingOjbects.push(smallEnnemyText);
    Level.loadingOjbects.push(mediumEnnemyText);
    Level.loadingOjbects.push(bigEnnemyText);
    Level.loadingOjbects.push(bossEnnemyText);
    Level.loadingOjbects.push(titleText);
    Level.loadingOjbects.push(tableaudescorestext);
    Level.loadingOjbects.push(authortext);
    Level.loadingOjbects.push(enterText);
    //Level.loadingOjbects.push(plane);

    //this.#scene.add( plane );
    //this.#scene.add(PM[1]);
    this.#loop.addUpdatable(PM[0]);
    this.#loop.addUpdatable(PM[1]);
    SoundGestion();
    this.render();

    /*
    function scaleModel(model, scale) {
      model.scale.set(scale, scale, scale);
    }
    */
  }

  removeObjects() {
    Level.loadingOjbects.forEach(obj => this.#scene.remove(obj));
  }

  render() {
    this.#renderer.render(this.#scene, this.#camera);
  }

  start() {
    
    this.#loop.addUpdatable(initGame(this.#scene, this.#camera));
    this.#loop.start();
  }

  stop() {
    this.#loop.stop();
  }

  pause() {
    this.#loop.pause();
  }

  resume() {
    this.#loop.resume();
  }

  pauseResume() {
    this.#loop.pauseResume();
  }

  getScene() {
    return this.#scene;
  }

  resize() {
    this.#resizer.resize();
  }
  
  toggleHelpers() {
    this.#camera.layers.toggle(this.#helpersLayer);
  }

  changeCamera0() {
    if ( !this.#cameraTransitionInProgress) {
      this.#cameraTransitionInProgress = true;
      const self = this;
      gsap.to(this.#camera.position, {
          duration: 3,
          x: 0,
          y: 20,
          z: 5,
          onComplete: function() {
            self.#cameraTransitionInProgress = false;
          }
      });
      Player.quelCamera = 0;
    }
  }
  changeCamera1() {
    if ( !this.#cameraTransitionInProgress) {
      this.#cameraTransitionInProgress = true;
      const self = this;
      gsap.to(this.#camera.position, {
          duration: 0.5,
          x: Player.playerModel[0].position.x,
          y: Player.playerModel[0].position.y + 3,
          z: Player.playerModel[0].position.z + 3,
          onComplete: function() {
            self.#cameraTransitionInProgress = false;
          }
      });
      Player.quelCamera = 1;
    }
  }

  changeCamera2() {
    if ( !this.#cameraTransitionInProgress) {
      this.#cameraTransitionInProgress = true;
      const self = this;
      gsap.to(this.#camera.position, {
          duration: 4,
          x: 20,
          y: 20,
          z: 0,
          onComplete: function() {
            self.#cameraTransitionInProgress = false;
          }
      });
      Player.quelCamera = 2;
    }
  }

  mooveLeft() {
    /* fonction supprimer voir le Player.playerModel.tick dans playAnimation dans animation.js*/
  }

  mooveRight() {
    /* fonction supprimer voir le Player.playerModel.tick dans playAnimation dans animation.js*/
  }
  shoot() {
    const self = this;
    if (Level.tab[0].length > 0 && Player.projectiles.length < Player.projectilesmaxPlayer && Level.started && !Level.paused && Player.animationPlayed) {
      Player.animationPlayed = false;    
      playAnimation(2, 2, Player.bodyData, Player.playerModel[0]);
      setTimeout(function() {
        createProjectile( self.#scene);
        
      }, 150);
      setTimeout(function() {
        if (Player.vie > 0) {
          playAnimation(9, 1, Player.bodyData, Player.playerModel[0]);
          Player.animationPlayed = true
        }
      }, 300);
    }
  }

  invincible() {
    if (Level.started == true && !Level.paused && Level.tab[0].length > 0) { // Invincible
      Player.invincible = !Player.invincible;
      if (Player.invincible) {
        Player.projectilespeed = Player.projectilespeed * 2;
        Player.projectilesmaxPlayer = 10;
      }
      else {
        Player.projectilespeed = Player.projectilespeed / 2;
        Player.projectilesmaxPlayer = 1;
      }
    }
  }

  killall() {
    if (Level.started == true && !Level.paused && Level.tab[0].length > 0) { // Kill all aliens
      for (var k = 0; k < Level.tab.length; k++){
        for (var j = 0; j < Level.tab[k].length; j++) {
          this.#scene.remove(Level.tab[k][j]); // Retirer la sphère de la scène
        }
        Level.tab[k].splice(0, Level.tab[k].length); // Retirer les sphère du tableau
        Level.levelactuelle[k].splice(0, Level.levelactuelle[k].length);
      }
      spawnEnnemy(this.#scene, this.#camera);
      if (Level.wave <= 5) {
        document.getElementById("level-text").textContent = "LEVEL : " + (Level.wave);
        document.getElementById("level-container").style.display = "block";
        Level.paused = true;
        setTimeout(function() {
          document.getElementById("level-container").style.display = "none";
          Level.paused = false;
        }, 2000);
      }
    }
  }
  restart() {
    if (Level.loose) {
      Ennemy.projectilespeedEnnemy = 8;
      Ennemy.projectilesmaxEnnemy = 1;
      Ennemy.ennemySpeed = 2;
      const heartsContainer = document.getElementById('hearts-container');
      heartsContainer.innerHTML = ''; // Supprimer toutes les images de coeur existantes
      Level.started = true;
      Level.loose = false;
      Level.paused = false;
      Level.wave = 0;
      Player.vie = 3;
      Player.score = 0;
      document.getElementById("score-text").textContent = "Score : " + (Player.score);
      Player.animationPlayed = true;
      Level.tab.splice(0, Level.tab.length);
      playAnimation(9, 1, Player.bodyData, Player.playerModel[0]);
      spawnEnnemy(this.#scene, this.#camera);
      for (let i = 0; i < Level.abris.length; i++) {
        this.#scene.remove(Level.abris[i]);
        // splice every abris from Level.abris
        Level.abris.splice(i, 1);
        i--;
      }
      for (let i = 0; i < Player.vie; i++) {
        const heartImage = document.createElement('img');
        heartImage.style.width = '75px';
        heartImage.src = './src/medias/images/heart.png';
        heartsContainer.appendChild(heartImage);
      }

      document.getElementById("level-container").style.display = "none";
      document.getElementById("level-container").style.height = "8%";
      document.getElementById("level-container").style.width = "25%";
      generateAbris(this.#scene);
    }
  }

  showHelp() {
    if (Level.started == true && !Level.paused && Level.tab[0].length > 0) {
      Level.paused = true;
      vex.dialog.alert({
        message: "H: Affiche le menu d'aide et met pause \n I: Vous rend invincible \n K: Tue tous les aliens \n A: Recrée les abris \n S: Coupe les sons \n M: Coupe la musique \n Espace: Tire \n Flèche directionnelle : Se déplacer \n G: Désactive le postProcessing",
        className: 'vex-theme-flat-attack', // Overwrites defaultOptions
        // add a oncallback function
        callback: function(value) {
          Level.paused = false;
        }
    })
    }
  }

  regenerateAbris() {
    if (Level.started == true && !Level.paused && Level.tab[0].length > 0) {
      for (let i = 0; i < Level.abris.length; i++) {
        this.#scene.remove(Level.abris[i]);
        // splice every abris from Level.abris
        Level.abris.splice(i, 1);
        i--;
      }
      generateAbris(this.#scene);
    }
  }

  stopsound() {
    for(let sound in musicANDsound.soundeffectArray){
      musicANDsound.soundeffectArray[sound].toggleMute();
    }
  }
  stopmusic() {
    for(let sound in musicANDsound.musicArray){
      musicANDsound.musicArray[sound].toggleMute();
    }
  }
}

export { World };

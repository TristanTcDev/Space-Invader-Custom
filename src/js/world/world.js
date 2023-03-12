import * as THREE from 'three';
import { createRenderer }  from './systems/renderer.js';
import { createControls }  from './systems/controls.js';
import { createCamera }  from './components/camera.js';
import { createScene }  from './components/scene.js';
import { createLights } from './components/lights.js';
import { createKeyboard }  from './systems/keyboard.js';

import { Loop }            from './systems/loop.js';
import { gsap } from "gsap";
import { initGame } from './game/init.js';
import { Player, Level, Ennemy } from './game/config.js';
import { SoundGestion } from './game/sound.js';
import { loadPM } from './components/playerModel.js';
import { playAnimation } from './game/animation.js';
import { createProjectile } from './game/projectile.js';
import { spawnEnnemy } from './game/ennemy.js';
import { generateAbris } from './game/abris.js';



class World {

  #camera
  #controls
  #renderer
  #scene
  #loop
  #resizer
  #keyboard
  #helpersLayer
  #counter
  #cameraTransitionInProgress
  #light


  constructor(container) {
    this.#camera = createCamera();
    this.#renderer = createRenderer();
    this.#scene = createScene();
    this.#light = createLights(this.#scene);
    this.#controls = createControls(this.#camera, this.#renderer.domElement);
    //this.#resizer = new Resizer(container, this.#scene, this.#camera, this.#renderer);
    this.#loop = new Loop(this.#camera, this.#scene, this.#renderer);
    this.#loop.addUpdatable(this.#controls);
    this.#keyboard = createKeyboard(container, this);
    this.#cameraTransitionInProgress = false;
    
    // Create the lights and hide the helpers layer
    //this.#helpersLayer = 1;
    //createLights(this.#scene, this.#helpersLayer);
    this.#camera.layers.enableAll();
    //this.#camera.layers.toggle(this.#helpersLayer);
  
    // create entities in the scene
    //createEntities(this.#scene, this.#renderer.domElement);



    container.append(this.#renderer.domElement);
  }

  async init() {
    // Add asynchronous tasks (loading models for example)
    const PM = await loadPM(this.#scene, this.#camera);
    this.#scene.add(PM[0]);
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
    console.log(this.#camera.layers);
  }

  changeCamera0() {
    console.log("changeCamera0");
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
    console.log("changeCamera1");
    if ( !this.#cameraTransitionInProgress) {
      this.#cameraTransitionInProgress = true;
      const self = this;
      gsap.to(this.#camera.position, {
          duration: 0.5,
          x: Player.playerModel.position.x,
          y: Player.playerModel.position.y + 3,
          z: Player.playerModel.position.z + 3,
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
      console.log(Player.quelCamera);
    }
  }

  mooveLeft() {
    if (Level.started === true && Level.paused === false && Level.tab[0].length > 0) { // flèche gauche
      gsap.to(Player.playerModel.position, {
        duration: 0.1,
        x: Player.playerModel.position.x - Player.playerSpeed,
        ease: "linear",
      });
      if (Player.quelCamera == 1) {
          gsap.to(this.#camera.position, {
              duration: 0.1,
              x: this.#camera.position.x - Player.playerSpeed,
              ease: "linear",
          });
      }
    }
  }

  mooveRight() {
    if (Level.started === true && Level.paused === false && Level.tab[0].length > 0) { // flèche droite
      gsap.to(Player.playerModel.position, {
        duration: 0.1,
        x: Player.playerModel.position.x + Player.playerSpeed,
        ease: "linear",
      });
      if (Player.quelCamera == 1) {
          gsap.to(this.#camera.position, {
              duration: 0.1,
              x: this.#camera.position.x + Player.playerSpeed,
              ease: "linear",
          });
      }
    }
  }
  shoot() {
    const self = this;
    if (Level.tab[0].length > 0 && Player.projectiles.length < Player.projectilesmaxPlayer && Level.started && !Level.paused && Player.animationPlayed) {
      Player.animationPlayed = false;    
      playAnimation(2, 2, Player.bodyData, Player.playerModel);
      setTimeout(function() {
        createProjectile( self.#scene);
        
      }, 150);
      setTimeout(function() {
        if (Player.vie > 0) {
          playAnimation(9, 1, Player.bodyData, Player.playerModel);
          Player.animationPlayed = true
        }
      }, 300);
    }
  }

  invincible() {
    if (Level.started == true && !Level.paused && Level.tab[0].length > 0) { // Invincible
      Player.invincible = !Player.invincible;
      console.log(Player.invincible);
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
    }
  }
  restart() {
    if (Level.loose) {
      Level.started = true;
      Level.loose = false;
      Level.paused = false;
      Level.wave = 0;
      Player.vie = 3;
      Player.score = 0;
      Player.animationPlayed = true;
      Level.tab.splice(0, Level.tab.length);
      playAnimation(9, 1, Player.bodyData, Player.playerModel);
      spawnEnnemy(this.#scene, this.#camera);
      for (let i = 0; i < Level.abris.length; i++) {
        this.#scene.remove(Level.abris[i]);
        // splice every abris from Level.abris
        Level.abris.splice(i, 1);
        i--;
      }
      generateAbris(this.#scene);
    }
  }

  showHelp() {
    console.log("Affiche de l'aide");
  }
}

export { World };

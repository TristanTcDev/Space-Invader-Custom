import { Clock } from 'three';
import * as THREE from 'three';

//import { GlitchEffect, EffectPass } from 'postprocessing';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
//import { EffectPass } from 'three/examples/jsm/postprocessing/EffectPass.js';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass';
//import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
//import { RenderPixelatedPass, EffectComposer, RenderPass, UnrealBloomPass } from 'three-stdlib';

import { Level, Player } from '../game/config';


// Doc : https://discoverthreejs.com/book/first-steps/animation-loop/
var timeElapse = 0;
class Loop {

  #camera
  #scene
  #renderer
  #paused
  #updatables
  #clock

  #composer

  constructor(camera, scene, renderer) {
    this.#camera = camera;
    this.#scene = scene;
    this.#renderer = renderer;
    this.#updatables = [];
    this.#paused = false;
    this.#clock = new Clock();

    this.#composer = new EffectComposer(this.#renderer);
    this.#composer.addPass( new RenderPass(this.#scene, this.#camera) );
    /*
    const bloomEffect = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.85
    );
    const pixelrend = new RenderPixelatedPass({width: window.innerWidth, height: window.innerHeight}, 1, this.#scene, this.#camera)
    this.#composer.addPass(pixelrend);
    
    this.#composer.addPass(bloomEffect);
      */


    const glitcheffect = new GlitchPass();
    this.#composer.addPass(glitcheffect);
    this.#composer.passes[1].enabled = false;
    //this.#composer.removePass(glitcheffect);
    //console.log(this.#composer.passes);
    //this.#composer.removePass(pixelrend);
    //console.log(this.#composer.passes);
  }

  start() {
    this.#renderer.setAnimationLoop(() => {
      // tell every animated object to tick forward one frame
      if (Level.started) {
        this.#composer.render();
      this.tick();
      }
      // render a frame
      //this.#renderer.render(this.#scene, this.#camera);
    });
  }

  stop() {
    this.#renderer.setAnimationLoop(null);
  }

  pause() {
    this.#paused = true;
  }
  
  resume() {
    this.#paused = false;
    this.#clock.getDelta();
  }
  
  pauseResume() {
    this.#paused ? this.resume() : this.pause();
  }
  
  addUpdatable(...objects3d) {
    this.#updatables.push(...objects3d);
    this.#updatables = [...new Set(this.#updatables)]; // remove duplicate objects
    console.log(this.#updatables);
  }
  
  tick() {
    if (this.#paused) return;

    for(let i = 0; i < Level.verticestar.velocities.length; i++) {
      Level.verticestar.velocities[i / 3 + i % 3] += Level.verticestar.accelerations[i];
      Level.verticestar.positions[i * 3 + 1] -= Level.verticestar.velocities[i];
      if(Level.verticestar.positions[i*3 +1] < -200) {
        Level.verticestar.positions[i * 3 + 1] = 400;
          Level.verticestar.velocities[i / 3 + i % 3] = 0;
      }
    }
    Level.stars.rotation.y += 0.002;
    Level.starbox.setAttribute('position', new THREE.BufferAttribute(new Float32Array(Level.verticestar.positions), 3));
    
    // only call the getDelta function once per frame!
    const delta = this.#clock.getDelta(); 
    //console.log(delta);

    timeElapse += delta;
    if (Player.tookdamage === true) {
       this.#composer.passes[1].enabled = true;
       this.#composer.passes[1].goWild = true;
       console.log(this.#composer.passes[1]);
       setTimeout(() => {
        console.log("eh oh faut marcher")
        this.#composer.passes[1].enabled = false;
        this.#composer.passes[1].goWild = false;
       }, 500);      
       Player.tookdamage = false;
    }
    

    for (const object of this.#updatables) {
      object.tick(delta);
    }
  }
}

export { Loop };

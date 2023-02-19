import { Clock } from 'three';
import * as THREE from 'three';

//import { GlitchEffect, EffectPass } from 'postprocessing';
//import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
//import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
//import { EffectPass } from 'three/examples/jsm/postprocessing/EffectPass.js';
//import { GlitchEffect } from 'three/examples/jsm/postprocessing/GlitchEffect.js';
//import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { RenderPixelatedPass, EffectComposer, RenderPass, UnrealBloomPass } from 'three-stdlib';

import { Level } from '../game/config';


// Doc : https://discoverthreejs.com/book/first-steps/animation-loop/

class Loop {

  #camera
  #scene
  #renderer
  #paused
  #updatables
  #clock

  #renderPass
  #composer
  #effectPass

  constructor(camera, scene, renderer) {
    this.#camera = camera;
    this.#scene = scene;
    this.#renderer = renderer;
    this.#updatables = [];
    this.#paused = false;
    this.#clock = new Clock();

    this.#renderPass = new RenderPass(this.#scene, this.#camera);
    this.#composer = new EffectComposer(this.#renderer);
    this.#composer.addPass(this.#renderPass);

    const bloomEffect = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.85
    );
    const pixelrend = new RenderPixelatedPass({width: window.innerWidth, height: window.innerHeight}, 5, this.#scene, this.#camera, {normalEdgeStrength: 0, depthEdgeStrength: 1})
    this.#composer.addPass(pixelrend);
    
    //this.#composer.addPass(bloomEffect);
    
    //this.#renderer.toneMapping = THREE.CineonToneMapping;
    //this.#renderer.toneMappingExposure = 1;


    //const glitcheffect = new GlitchEffect();
    //this.#effectPass = new EffectPass(this.#camera, new GlitchEffect());
    //this.#effectPass.renderToScreen = true;
    //this.#composer.addPass(this.#effectPass);
    console.log(this.#composer.passes);
    this.#composer.removePass(pixelrend);
    console.log(this.#composer.passes);
  }

  start() {
    this.#renderer.setAnimationLoop(() => {
      // tell every animated object to tick forward one frame
      if (Level.started) {
        this.#composer.render();
      }
      this.tick();
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


    
    // only call the getDelta function once per frame!
    const delta = this.#clock.getDelta(); 
    //console.log(delta);

    for (const object of this.#updatables) {
      object.tick(delta);
    }
  }
}

export { Loop };

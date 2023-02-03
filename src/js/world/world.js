import { createKeyboard  } from './systems/keyboard.js';


class World {

  #camera
  #controls
  #renderer
  #scene
  #loop
  #keyboard
  #helpersLayer

  constructor(container) {
    this.#camera = createCamera();
    this.#renderer = createRenderer();
    this.#scene = createScene();
    this.#controls = createControls(this.#camera, this.#renderer.domElement);
    this.#loop = new Loop(this.#camera, this.#scene, this.#renderer);
    this.#loop.addUpdatable(this.#controls);
    this.#keyboard = createKeyboard(container, this);
    
    // Create the lights and hide the helpers layer
    this.#helpersLayer = 1;
    createLights(this.#scene, this.#helpersLayer);
    this.#camera.layers.enableAll();
    this.#camera.layers.toggle(this.#helpersLayer);
  
    // create entities in the scene
    createHouses(this.#scene);

    container.append(this.#renderer.domElement);
  }

  async init() {
    // Add asynchronous tasks (loading models for example)

  }

  render() {
    this.#renderer.render(this.#scene, this.#camera);
  }

  start() {
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
  
  toggleHelpers() {
    this.#camera.layers.toggle(this.#helpersLayer);
    console.log(this.#camera.layers);
  }
}

export { World };
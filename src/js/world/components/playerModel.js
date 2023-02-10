import * as THREE from 'three';
import { Player } from '../game/config.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { playAnimation } from '../game/animation.js';

async function loadPM(scene, camera) {
    const loader = new GLTFLoader();
    Player.bodyData = await loader.loadAsync('./src/medias/models/scene.gltf');
    Player.playerModel = Player.bodyData.scene;
    playAnimation(8);
    //scaleModel(playerModel, 0.01);
    Player.playerModel.scale.set(0.01, 0.01, 0.01);
    
    Player.playerModel.position.set(0, -1, 10);
    Player.playerModel.rotation.y = Math.PI;
    //playAnimation(9);
    camera.position.z = 5;
    const box = new THREE.Box3().setFromObject(Player.playerModel);
    const boxHelper = new THREE.BoxHelper(Player.playerModel, 0xff0000);
    scene.add(boxHelper);
    return Player.playerModel;
}

export { loadPM };
import * as THREE from 'three';
import { Player, Ennemy } from '../game/config.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { playAnimation, playAnimationEnnemy } from '../game/animation.js';

async function loadPM(scene, camera) {

    const loadingManager = new THREE.LoadingManager();
    const progressBar = document.getElementById('progress-bar');

    const progressBarManager = document.querySelector('.progress-bar-container');

    loadingManager.onProgress = function(url, loaded, total) {
        progressBarManager.style.display = 'block';
        progressBar.value = (loaded / total) * 100;
        console.log(`Started loading: ${url}`);
    }

    loadingManager.onLoad = function() {
        progressBarManager.style.display = 'none';
        console.log('Loading complete!');
    }

    const loader = new GLTFLoader(loadingManager);
    Ennemy.ennemybodyData = await loader.loadAsync('./src/medias/models/yuumi/yuumi_animer.gltf');
    Ennemy.ennemyModel = Ennemy.ennemybodyData.scene;
    Player.bodyData = await loader.loadAsync('./src/medias/models/scene.gltf');
    Player.playerModel = Player.bodyData.scene;



    let localPlane = new THREE.Plane( new THREE.Vector3( 0, 0.5, 0 ), 0.2 );
    //console.log(localPlane);
    let localPlaneHelper = new THREE.PlaneHelper( localPlane, 5, 0xffff00 );
    scene.add( localPlaneHelper );



    playAnimation(8, 1, Player.bodyData, Player.playerModel);
    //scaleModel(playerModel, 0.01);
    Player.playerModel.scale.set(0.01, 0.01, 0.01);
    Player.playerModel.position.set(0, -1, 10);
    Player.playerModel.rotation.y = Math.PI;

    Ennemy.ennemyModel.scale.set(0.01, 0.01, 0.01);
    //playAnimation(9);


    camera.position.z = 5;
    /*for (let i = 0; i < 50; i++) {
        const model = clone(Player.playerModel);
        model.position.x = Player.playerModel.position.x + i + 2;
        scene.add(model);
    }*/

    Ennemy.ennemyModel.traverse( function ( child ) {

        if ( child.isMesh ) {
      
            child.castShadow = true;
            child.receiveShadow = true;
             
            child.material.clippingPlanes = [ localPlane ],
            child.material.clipShadows = true,
            child.material.side = THREE.DoubleSide
      
        }
      
    });
    //playAnimationEnnemy(13, 1, Ennemy.ennemybodyData, Ennemy.ennemyModel);

    const box = new THREE.Box3().setFromObject(Player.playerModel);
    const boxHelper = new THREE.BoxHelper(Player.playerModel, 0xff0000);
    scene.add(boxHelper);
    //scene.add(Ennemy.ennemyModel);
    return [Player.playerModel, Ennemy.ennemyModel];
}

export { loadPM };
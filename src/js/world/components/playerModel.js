import * as THREE from 'three';
import { Player, Ennemy } from '../game/config.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { playAnimation, playAnimationEnnemy } from '../game/animation.js';

async function loadPM(scene, camera) {

    const loadingManager = new THREE.LoadingManager();
    const progressBar = document.getElementById('progress-bar');

    const progressBarManager = document.querySelector('.progress-bar-container');
    console.log(progressBarManager);

    loadingManager.onProgress = function(url, loadedBytes, totalBytes) {
        const progress = Math.round((loadedBytes / 28) * 100);
        progressBarManager.style.display = 'block';
        progressBar.value = progress;
        console.log(`Started loading: ${url}`);
    }

    loadingManager.onLoad = function() {
        progressBarManager.style.display = 'none';
        console.log('Loading complete!');
    }

    const loader = new GLTFLoader(loadingManager);
    //editer les meshes": quand on veut enlever des trucs sur les skins
    const promises = [  loader.loadAsync('./src/medias/models/pumpkin/yuumi_pumpkin.gltf'),  
                        loader.loadAsync('./src/medias/models/pumpkin_ruby/yuumi_pumpkin_ruby.gltf'),  
                        loader.loadAsync('./src/medias/models/pumpkin_pearl/yuumi_pumpkin_pearl.gltf'), 
                        loader.loadAsync('./src/medias/models/pumpkin_obsidian/yuumi_pumpkin_obsidian.gltf'),
                        loader.loadAsync('./src/medias/models/scene.gltf')
                    ];

    const [bodyData0, bodyData1, bodyData2, bodyData3, bodyData] = await Promise.all(promises);
    
    Ennemy.ennemybodyData[0] = bodyData0;
    Ennemy.ennemyModel[0] = bodyData0.scene;
    
    Ennemy.ennemybodyData[1] = bodyData1;
    Ennemy.ennemyModel[1] = bodyData1.scene;
    
    Ennemy.ennemybodyData[2] = bodyData2;
    Ennemy.ennemyModel[2] = bodyData2.scene;

    Ennemy.ennemybodyData[3] = bodyData3 ;
    Ennemy.ennemyModel[3] = bodyData3.scene;
    Player.bodyData = bodyData;
    Player.playerModel = bodyData.scene;



    let localPlane = new THREE.Plane( new THREE.Vector3( 0, 0.5, 0 ), 0.2 );
    //console.log(localPlane);
    let localPlaneHelper = new THREE.PlaneHelper( localPlane, 5, 0xffff00 );
    scene.add( localPlaneHelper );



    playAnimation(8, 1, Player.bodyData, Player.playerModel);
    //scaleModel(playerModel, 0.01);
    Player.playerModel.scale.set(0.01, 0.01, 0.01);
    Player.playerModel.position.set(0, -1, 10);
    Player.playerModel.rotation.y = Math.PI;

    for (let i = 0; i < Ennemy.ennemyModel.length; i++) {
        Ennemy.ennemyModel[i].scale.set(0.01, 0.01, 0.01);
    }

    //Ennemy.ennemyModel[0].scale.set(0.01, 0.01, 0.01);
    //playAnimation(9);


    camera.position.z = 5;
    /*for (let i = 0; i < 50; i++) {
        const model = clone(Player.playerModel);
        model.position.x = Player.playerModel.position.x + i + 2;
        scene.add(model);
    }*/
    //playAnimationEnnemy(13, 1, Ennemy.ennemybodyData, Ennemy.ennemyModel);

    const box = new THREE.Box3().setFromObject(Player.playerModel);
    const boxHelper = new THREE.BoxHelper(Player.playerModel, 0xff0000);
    scene.add(boxHelper);
    //scene.add(Ennemy.ennemyModel);
    return [Player.playerModel, Ennemy.ennemyModel];
}

export { loadPM };
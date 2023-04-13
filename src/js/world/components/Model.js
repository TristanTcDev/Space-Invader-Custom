import * as THREE from 'three';
import { Player, Ennemy } from '../game/config.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { playAnimation } from '../game/animation.js';

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
                        loader.loadAsync('./src/medias/models/projectile/ennemieProjectile/scene.gltf'),
                        loader.loadAsync('./src/medias/models/projectile/playerProjectile/scene.gltf'),
                        loader.loadAsync('./src/medias/models/playerModel/corkioldalien.gltf')
                    ];

    const [bodyData0, bodyData1, bodyData2, bodyData3, projectileData, playerprojectileData, bodyData] = await Promise.all(promises);
    
    Ennemy.ennemybodyData[0] = bodyData0;
    Ennemy.ennemyModel[0] = bodyData0.scene;
    
    Ennemy.ennemybodyData[1] = bodyData1;
    Ennemy.ennemyModel[1] = bodyData1.scene;
    
    Ennemy.ennemybodyData[2] = bodyData2;
    Ennemy.ennemyModel[2] = bodyData2.scene;

    Ennemy.ennemybodyData[3] = bodyData3 ;
    Ennemy.ennemyModel[3] = bodyData3.scene;

    Ennemy.ennemybodyData[4] = projectileData;
    Ennemy.ennemyModel[4] = projectileData.scene;


    Player.bodyData = bodyData;
    Player.playerModel[0] = bodyData.scene;

    Player.playerModel[1] = playerprojectileData.scene;



    playAnimation(8, 1, Player.bodyData, Player.playerModel[0]);
    Player.playerModel[0].scale.set(0.01, 0.01, 0.01);
    Player.playerModel[0].position.set(0, -1, 10);
    Player.playerModel[0].rotation.y = Math.PI;

    for (let i = 0; i < Ennemy.ennemyModel.length; i++) {
        Ennemy.ennemyModel[i].scale.set(0.01, 0.01, 0.01);
    }

    Ennemy.ennemyModel[4].scale.set(10, 20, 10);
    Ennemy.ennemyModel[4].rotation.x = Math.PI / 2;

    Player.playerModel[1].scale.set(0.4, 0.4, 0.4);
    Player.playerModel[1].rotation.y = Math.PI / 2;


    camera.position.z = 5;
    return [Player.playerModel, Ennemy.ennemyModel];
}

export { loadPM };
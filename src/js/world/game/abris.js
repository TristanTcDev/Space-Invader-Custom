import * as THREE from 'three';
import { Level } from './config';

function generateAbris(scene) {
    for (let i = 0; i <= 3; i++) {
        let cube = new THREE.Mesh(
            new THREE.BoxGeometry(2.3, 1, 1),
            new THREE.MeshBasicMaterial({ color: 0x00ff00 })
        );
        cube.position.set(-8 + 5*i, 0, 6.5); 
        scene.add(cube);
        Level.abris.push(cube);
    }
}

export { generateAbris };
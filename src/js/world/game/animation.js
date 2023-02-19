import * as THREE from 'three';
import { Player } from './config';
var mixer;
var action;

function playAnimation(numAnim, speed = 1) {
    //anim 9 tout le temps, 3 quand on tire, 7 pour esquiver, 24 tir du cheater qui OS tout le monde, 8 quand on meurt
      let clip = Player.bodyData.animations[numAnim];
      mixer = new THREE.AnimationMixer(Player.playerModel);
      mixer.timeScale = speed;
      action = mixer.clipAction(clip);
      action.play();

      Player.playerModel.tick = (delta) =>  {
        mixer.update(delta);
        if ( Player.mooveatright) {
          Player.playerModel.position.x += Player.playerSpeed * delta;
          Player.mooveatright = false;
        }
        //console.log(Player.playerModel.position.x);
        //Player.playerModel.position.x += Player.playerSpeed * delta;

      }
      action.paused = false;
  }

export { playAnimation, mixer, action }
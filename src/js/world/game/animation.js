import * as THREE from 'three';
import { Player, Ennemy } from './config';
//var mixer;
var action;
var actionennemy;

function playAnimation(numAnim, speed = 1, data, model) {
    //anim 9 tout le temps, 3 quand on tire, 7 pour esquiver, 24 tir du cheater qui OS tout le monde, 8 quand on meurt
      let clip = data.animations[numAnim];
      let mixer = new THREE.AnimationMixer(model);
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
function playAnimationEnnemy(numAnim, speed = 1, data, model, j, i) {
  let clip = data.animations[numAnim];
  let mixer = new THREE.AnimationMixer(model);
  mixer.timeScale = speed;
  actionennemy = mixer.clipAction(clip);
  Ennemy.ennemyanim[j][i] = actionennemy;
  Ennemy.ennemyanim[j][i].play();

  Ennemy.ennemyModel.tick = (delta) =>  {
    mixer.update(delta);
  }
  actionennemy.paused = false;
}

export { playAnimation, playAnimationEnnemy, action }
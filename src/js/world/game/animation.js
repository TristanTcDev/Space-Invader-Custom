import * as THREE from 'three';
import { Player, Ennemy } from './config';
//var mixer;
var action;
//var actionennemy;

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
function playAnimationEnnemy(numAnim, speed = 1, data, model, j, i, mixer) {
  let clip = data.animations[numAnim];
  // let mixer = new THREE.AnimationMixer(model);
  //console.log(mixer[j][i]);
  if (Ennemy.ennemymixer[j][i] != undefined) {
    Ennemy.ennemymixer[j][i].stopAllAction();
    Ennemy.ennemymixer[j][i].timeScale = speed;
    let actionennemy = Ennemy.ennemymixer[j][i].clipAction(clip);
    //Ennemy.ennemyanim[j][i] = actionennemy;
    //Ennemy.ennemyanim[j][i].play();
    actionennemy.play();
    //console.log(Ennemy.ennemymixer[j][i]);

  Ennemy.ennemyModel.tick = (delta) =>  {
    for (let j = 0; j < Ennemy.ennemymixer.length; j++) {
      for (let i = 0; i < Ennemy.ennemymixer[j].length; i++) {
        Ennemy.ennemymixer[j][i].update(delta);
      }
    }
    //Ennemy.ennemymixer[j][i].update(delta);
  }
  actionennemy.paused = false;
  return actionennemy;
  }
}

export { playAnimation, playAnimationEnnemy, action }
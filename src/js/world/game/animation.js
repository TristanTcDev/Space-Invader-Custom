import * as THREE from 'three';
import { Player, Ennemy, Level } from './config';
//var mixer;
var action;
//var actionennemy;

function playAnimation(numAnim, speed = 1, data, model) {
    //anim 9 tout le temps, 3 quand on tire, 8 quand on meurt
      let clip = data.animations[numAnim];
      let mixer = new THREE.AnimationMixer(model);
      mixer.timeScale = speed;
      action = mixer.clipAction(clip);
      action.play();

      // update les mouvement du joueur
      Player.playerModel.tick = (delta) =>  {
        mixer.update(delta);
        if (Level.started === true && Level.paused === false && Level.tab[0].length > 0) { // flèche droite
          if (Player.mooveRight) {
            Player.playerModel[0].position.x += Player.playerSpeed * delta;
          }
          if (Player.mooveLeft) {
            Player.playerModel[0].position.x -= Player.playerSpeed * delta;
          }
        }
        
      }
      action.paused = false;
  }
function playAnimationEnnemy(numAnim, speed = 1, data, model, j, i, mixer) {
  let clip = data.animations[numAnim];
  if (Ennemy.ennemymixer[j][i] != undefined) {
    Ennemy.ennemymixer[j][i].stopAllAction();
    Ennemy.ennemymixer[j][i].timeScale = speed;
    let actionennemy = Ennemy.ennemymixer[j][i].clipAction(clip);
    actionennemy.play();

  // update les animations ennmies
  Ennemy.ennemyModel.tick = (delta) =>  {
    for (let j = 0; j < Ennemy.ennemymixer.length; j++) {
      for (let i = 0; i < Ennemy.ennemymixer[j].length; i++) {
        Ennemy.ennemymixer[j][i].update(delta);
      }
    }
  }
  actionennemy.paused = false;
  return actionennemy;
  }
}

export { playAnimation, playAnimationEnnemy, action }
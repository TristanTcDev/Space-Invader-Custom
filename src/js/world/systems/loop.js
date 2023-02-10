import { Clock } from 'three';
import * as THREE from 'three';
import { Player, Level, Ennemy, musicANDsound } from '../game/config.js';
import { spawnEnnemy } from '../game/ennemy.js';
import { createProjectileEnnemie } from '../game/projectile.js';
import { playAnimation, action } from '../game/animation.js';
import { addScore } from '../game/score.js';

// Doc : https://discoverthreejs.com/book/first-steps/animation-loop/
var center = new THREE.Vector3(0, 0, 0);
class Loop {

  #camera
  #scene
  #renderer
  #paused
  #updatables
  #clock

  constructor(camera, scene, renderer) {
    this.#camera = camera;
    this.#scene = scene;
    this.#renderer = renderer;
    this.#updatables = [];
    this.#paused = false;
    this.#clock = new Clock();
  }

  start() {
    this.#renderer.setAnimationLoop(() => {
      // tell every animated object to tick forward one frame
      this.tick();
      // render a frame
      this.#renderer.render(this.#scene, this.#camera);
    });
  }

  stop() {
    this.#renderer.setAnimationLoop(null);
  }

  pause() {
    this.#paused = true;
  }
  
  resume() {
    this.#paused = false;
    this.#clock.getDelta();
  }
  
  pauseResume() {
    this.#paused ? this.resume() : this.pause();
  }
  
  addUpdatable(...objects3d) {
    this.#updatables.push(...objects3d);
    this.#updatables = [...new Set(this.#updatables)]; // remove duplicate objects
    console.log(this.#updatables);
  }
  
  tick() {
    if (this.#paused) return;
    if (Player.quelCamera == 1) {
      this.#camera.lookAt(Player.playerModel.position.x, 0, 0);
    }
    else {
      this.#camera.lookAt(center);
    }
    if (Player.playerModel.position.x < -Level.limgauche) {
      Player.playerModel.position.x = -Level.limgauche;
    }
    if (Player.playerModel.position.x > Level.limdroite) {
      Player.playerModel.position.x = Level.limdroite;
    }
    if(Level.started && !Player.paused && Level.tab[0].length > 0) {

      if (!Player.invincible) {
        for (let j = 0; j < Level.tab.length; j++) {
          for (let i = 0; i < Level.tab[j].length; i++) {
            if (Level.tab[j][i] != undefined) {
              Level.tab[j][i].position.x += Ennemy.ennemySpeed;
              if(Level.tab[j][i].position.x > Level.limdroite - Ennemy.radius  || Level.tab[j][i].position.x < - Level.limgauche + Ennemy.radius ) { 
                Ennemy.ennemySpeed = -Ennemy.ennemySpeed;
                for (let m = 0; m < Level.tab.length; m++) {
                  for (let n = 0; n < Level.tab[m].length; n++) {
                    if (Level.tab[m][n] != undefined) {
                      Level.tab[m][n].position.z += 0.5;
                    }
                  }
                }
              }
            }
          }
        }
      }
      for (let i = 0; i < Player.projectiles.length; i++) {
        Player.projectiles[i].position.add(Player.projectiles[i].velocity);
        // Vérifier si le projectile est sorti de la zone de jeu
        if (Player.projectiles[i].position.z < -10) {
          
          this.#scene.remove(Player.projectiles[i]);
          Player.projectiles.splice(i, 1);
          i--;
        }
        for (let k = 0; k < Level.tab.length; k++) {
          for (let j = 0; j < Level.tab[k].length; j++) {
            if (Level.tab[k][j] != undefined) {
              if (Player.projectiles[i] != undefined) {
                if (Player.projectiles[i].position.distanceTo(Level.tab[k][j].position) <= Ennemy.radius * 1.5) {
                    if (Level.levelactuelle[k][j] == 1) addScore(Ennemy.smallennemyscore, k, j, this.#scene);
                    else if (Level.levelactuelle[k][j] == 2) addScore(Ennemy.mediumennemyscore, k, j, this.#scene);
                    else if (Level.levelactuelle[k][j] == 3) addScore(Ennemy.bigennemyscore, k, j, this.#scene);
                    console.log(Player.score);
                    this.#scene.remove(Level.tab[k][j]); // Retirer la sphère de la scène
                    
                    if (Level.tab[k].length == 1) {
                      if (Level.tab.length == 1) {
                        Level.tab[k].splice(j, 1);
                        spawnEnnemy(this.#scene);
                      }
                      else {
                        Level.tab[k].splice(j, 1); // retire la sphère du tableau
                        Level.tab.splice(k, 1); // retire la ligne du tableau
                        Level.levelactuelle[k].splice(j, 1);
                        Level.levelactuelle.splice(k, 1);
                        k--;
                        j--;
                        this.#scene.remove(Player.projectiles[i]); // Retirer le projectile de la scène
                        Player.projectiles.splice(i, 1); // Retirer le projectile du tableau
                        i--;
                        break;
                        //console.log(tab);
                      }
                    }
                    else {
                      Level.tab[k].splice(j, 1); // Retirer la sphère du tableau
                      Level.levelactuelle[k].splice(j, 1);
                    }
                    this.#scene.remove(Player.projectiles[i]); // Retirer le projectile de la scène
                    Player.projectiles.splice(i, 1); // Retirer le projectile du tableau
                    i--;
                    //break;
                    //console.log(levelactuelle);
                    //console.log(tab);
                }
              }
            }
          }
        }
      }
      if (!Player.invincible) {
        for (let i = 0; i < Ennemy.projectilesEnnemy.length; i++) {
          Ennemy.projectilesEnnemy[i].position.add(Ennemy.projectilesEnnemy[i].velocity);
          // Vérifier si le projectile est sorti de la zone de jeu
          if (Ennemy.projectilesEnnemy[i].position.z > 10) {  
              this.#scene.remove(Ennemy.projectilesEnnemy[i]);
              Ennemy.projectilesEnnemy.splice(i, 1);
              i--;
            }
          else if (Ennemy.projectilesEnnemy[i].position.distanceTo(Player.playerModel.position) <= 1.5) {
              console.log("playerModel toucher");
              if(Player.vie >= 3) musicANDsound.soundeffectArray["douleur_1"].play();
              else if(Player.vie == 2) musicANDsound.soundeffectArray["douleur_2"].play();
              else if(Player.vie == 1) musicANDsound.soundeffectArray["douleur_3"].play();
              Player.vie -= 1;
              this.#scene.remove(Ennemy.projectilesEnnemy[i]);
              Ennemy.projectilesEnnemy.splice(i, 1);
              i--;
            }
        }
        if (Level.tab[0].length > 0) {
            if (Ennemy.projectilesEnnemy.length <= Ennemy.projectilesmaxEnnemy) {
            createProjectileEnnemie(this.#scene);
            console.log("ça tire ! ???");
          }
        }
      }
      if (Level.tab[0][0].position.z > 10 || Player.vie == 0) {
        //alert("Perdu !");
        playAnimation(7);
        Level.started = false;
        setTimeout(function() {
          action.paused = true;
        }, 1250);
        for (let i = 0; i < Player.projectiles.length; i++) {
          this.#scene.remove(Player.projectiles[i]);
          Player.projectiles.splice(i, 1);
          i--;
        }
        for (let i = 0; i < Ennemy.projectilesEnnemy.length; i++) {
          this.#scene.remove(Ennemy.projectilesEnnemy[i]);
          Ennemy.projectilesEnnemy.splice(i, 1);
          i--;
        }
        for (let i = 0; i < Level.tab.length; i++) {
          for (let j = 0; j < Level.tab[i].length; j++) {
            this.#scene.remove(Level.tab[i][j]);
            Level.tab[i].splice(j, 1);
            j--;
          }
        }
      }
      //boxHelper.update();
    }

    
    // only call the getDelta function once per frame!
    const delta = this.#clock.getDelta(); 

    for (const object of this.#updatables) {
      object.tick(delta);
    }
  }
}

export { Loop };

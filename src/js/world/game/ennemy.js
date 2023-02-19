import * as THREE from 'three';
import { Player, Level, Ennemy, musicANDsound } from './config.js';
import { createProjectileEnnemie } from './projectile.js';
import { playAnimation, action } from './animation.js';
import { addScore } from './score.js';


var center = new THREE.Vector3(0, 0, 0);

function spawnEnnemy(scene, camera) {
    var geometry = new THREE.SphereGeometry( Ennemy.radius, Ennemy.segments, Ennemy.segments );
    var normalMesh = new THREE.MeshPhongMaterial();
    Level.wave++;
    if (Level.wave == 1) {
      Level.levelactuelle = Level.lvl1;
      console.log(Level.levelactuelle);
    }
    else if (Level.wave == 2) {
      Level.levelactuelle = Level.lvl2;
      console.log(Level.levelactuelle);
    }
    else if (Level.wave == 3) {
      alert("Gagné");
      return;
    }
    for (let i = 0; i < Level.nbligne; i++) {
      Level.tab[i] = [];
    }
    for (let j = 0; j < Level.nbligne; j++) {
      let ecart = 0;
      for (let i = 0; i < Level.nbcolonne; i++) {
        if (Level.levelactuelle[j][i] != 0) {
          let sphere = new THREE.Mesh( geometry, normalMesh );
          sphere.castShadow = true;
          sphere.receiveShadow = true;
          if (i == 0) { 
            sphere.position.set(-7.8 + ecart, 0, -j);
          }
          else { 
            sphere.position.set(-7.8 + ecart, 0, -j);
          }
          scene.add(sphere);
          Level.tab[j][i] = sphere;
  
          ecart += 3.5 * Ennemy.radius;
       }
       else {
          Level.tab[j][i] = 0;
          ecart += 3.5 * Ennemy.radius;
       }
      }
    }
    for (let j = 0; j <= Level.nbligne-1; j++) {
      for (let i = 0; i <= 9; i++) {
        if (Level.tab[j][i] == 0) {
          Level.tab[j].splice(i, 1);
          Level.levelactuelle[j].splice(i, 1);
        }
      }
    }
    Level.tab.tick = (delta) => {
      if (Player.quelCamera == 1) {
        camera.lookAt(Player.playerModel.position.x, 0, 0);
      }
      else {
        camera.lookAt(center);
      }
      if (Player.playerModel.position.x < -Level.limgauche) {
        Player.playerModel.position.x = -Level.limgauche;
      }
      if (Player.playerModel.position.x > Level.limdroite) {
        Player.playerModel.position.x = Level.limdroite;
      }
      if(Level.started && !Level.paused && Level.tab[0].length > 0) {
        if (!Player.invincible) {
          // ce uqi est en dessous est à enlever plsu tard pour update via le tick rate
          for (let j = 0; j < Level.tab.length; j++) {
            for (let i = 0; i < Level.tab[j].length; i++) {
              if (Level.tab[j][i] != undefined) {
                Level.tab[j][i].position.x += Ennemy.ennemySpeed * delta;
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
            
            scene.remove(Player.projectiles[i]);
            Player.projectiles.splice(i, 1);
            i--;
          }
          for (let k = 0; k < Level.tab.length; k++) {
            for (let j = 0; j < Level.tab[k].length; j++) {
              if (Level.tab[k][j] != undefined) {
                if (Player.projectiles[i] != undefined) {
                  if (Player.projectiles[i].position.distanceTo(Level.tab[k][j].position) <= Ennemy.radius * 1.5) {
                      if (Level.levelactuelle[k][j] == 1) addScore(Ennemy.smallennemyscore, k, j, scene);
                      else if (Level.levelactuelle[k][j] == 2) addScore(Ennemy.mediumennemyscore, k, j, scene);
                      else if (Level.levelactuelle[k][j] == 3) addScore(Ennemy.bigennemyscore, k, j, scene);
                      console.log(Player.score);
                      scene.remove(Level.tab[k][j]); // Retirer la sphère de la scène
                      
                      if (Level.tab[k].length == 1) {
                        if (Level.tab.length == 1) {
                          Level.tab[k].splice(j, 1);
                          spawnEnnemy(scene, camera);
                        }
                        else {
                          Level.tab[k].splice(j, 1); // retire la sphère du tableau
                          Level.tab.splice(k, 1); // retire la ligne du tableau
                          Level.levelactuelle[k].splice(j, 1);
                          Level.levelactuelle.splice(k, 1);
                          k--;
                          j--;
                          scene.remove(Player.projectiles[i]); // Retirer le projectile de la scène
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
                      scene.remove(Player.projectiles[i]); // Retirer le projectile de la scène
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
                scene.remove(Ennemy.projectilesEnnemy[i]);
                Ennemy.projectilesEnnemy.splice(i, 1);
                i--;
              }
            else if (Ennemy.projectilesEnnemy[i].position.distanceTo(Player.playerModel.position) <= 1.5) {
                console.log("playerModel toucher");
                if(Player.vie >= 3) musicANDsound.soundeffectArray["douleur_1"].play();
                else if(Player.vie == 2) musicANDsound.soundeffectArray["douleur_2"].play();
                else if(Player.vie == 1) musicANDsound.soundeffectArray["douleur_3"].play();
                Player.vie -= 1;
                scene.remove(Ennemy.projectilesEnnemy[i]);
                Ennemy.projectilesEnnemy.splice(i, 1);
                i--;
              }
          }
          if (Level.tab[0].length > 0) {
              if (Ennemy.projectilesEnnemy.length <= Ennemy.projectilesmaxEnnemy) {
              createProjectileEnnemie(scene);
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
            scene.remove(Player.projectiles[i]);
            Player.projectiles.splice(i, 1);
            i--;
          }
          for (let i = 0; i < Ennemy.projectilesEnnemy.length; i++) {
            scene.remove(Ennemy.projectilesEnnemy[i]);
            Ennemy.projectilesEnnemy.splice(i, 1);
            i--;
          }
          for (let i = 0; i < Level.tab.length; i++) {
            for (let j = 0; j < Level.tab[i].length; j++) {
              scene.remove(Level.tab[i][j]);
              Level.tab[i].splice(j, 1);
              j--;
            }
          }
        }
        //boxHelper.update();
      }
    }
    return Level.tab;
}


export { spawnEnnemy };
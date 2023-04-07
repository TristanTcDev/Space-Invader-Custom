import * as THREE from 'three';
import { Player, Level, Ennemy, musicANDsound } from './config.js';
import { createProjectileEnnemie } from './projectile.js';
import { playAnimation, action, playAnimationEnnemy } from './animation.js';
import { addScore } from './score.js';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';

var center = new THREE.Vector3(0, 0, 0);

function spawnEnnemy(scene, camera) {
    Level.wave++;
    if (Level.wave == 1) {
      Level.levelactuelle = JSON.parse(JSON.stringify(Level.lvl1));
    }
    else if (Level.wave == 2) {
      Level.levelactuelle = JSON.parse(JSON.stringify(Level.lvl2));
      Ennemy.projectilespeedEnnemy += 0.5;
      Ennemy.ennemySpeed += 0.5;
    }
    else if (Level.wave == 3) {
      Level.levelactuelle = JSON.parse(JSON.stringify(Level.lvl3));
      Ennemy.projectilespeedEnnemy += 1;
      Ennemy.ennemySpeed += 0.5;
    }
    else if (Level.wave == 4) {
      Level.levelactuelle = JSON.parse(JSON.stringify(Level.lvl4));
      Ennemy.projectilespeedEnnemy += 1;
      Ennemy.ennemySpeed += 2;
      Ennemy.projectilesmaxEnnemy += 2;
    }
    else if (Level.wave == 5) {
      Level.loose = true;
      return;
    }
    for (let i = 0; i < Level.nbligne; i++) {
      Level.tab[i] = [];
    }
    for (let j = 0; j < Level.nbligne; j++) {
      let ecart = 0;
      for (let i = 0; i < Level.nbcolonne; i++) {
        if (Level.levelactuelle[j][i] != 0) {
          console.log(Level.levelactuelle[j][i]);
          let ennemie;
          //let sphere = new THREE.Mesh( geometry, normalMesh );
          switch (Level.levelactuelle[j][i]) {
            case 1:
              ennemie = clone(Ennemy.ennemyModel[0]);
              break;
            case 2:
              ennemie = clone(Ennemy.ennemyModel[1]);
              break;
            case 3:
              ennemie = clone(Ennemy.ennemyModel[2]);
              break;
            case 4:
              ennemie = clone(Ennemy.ennemyModel[3]);
              break;
          }


          //ennemie = clone(Ennemy.ennemyModel[0]);
          //sphere.castShadow = true;
          //sphere.receiveShadow = true;
          ennemie.position.set(-7.8 + ecart, 0, -j * 1.5);
          scene.add(ennemie);
          Level.tab[j][i] = ennemie;
  
          ecart += 3.5 * Ennemy.radius;
       }
       else {
          Level.tab[j][i] = 0;
          ecart += 3.5 * Ennemy.radius;
       }
      }
    }
    for (let j = Level.nbligne-1; j >= 0; j--) {
      for (let i = 9; i >= 0; i--) {
        if (Level.tab[j][i] == 0) {
          Level.tab[j].splice(i, 1);
          Level.levelactuelle[j].splice(i, 1);
        }
      }
    }
    // Initialiser chaque élément de Ennemy.ennmyanim à un tableau vide
    for (let j = 0; j < Level.tab.length; j++) {
      Ennemy.ennemyanim[j] = [];
      Ennemy.ennemymixer[j] = [];
      Ennemy.ennemyaction[j] = [];
      for (let i = 0; i < Level.tab[j].length; i++) {
        Ennemy.ennemymixer[j][i] = new THREE.AnimationMixer(Level.tab[j][i]);
        Ennemy.ennemyanim[j][i] = playAnimationEnnemy(13,1, Ennemy.ennemybodyData[0], Level.tab[j][i], j, i, Ennemy.ennemymixer[j][i]);
        //playAnimationEnnemy(13,1, Ennemy.ennemybodyData, Level.tab[2][2], j, i);
      }
    }
    

    Level.tab.tick = (delta) => {
      if (Player.quelCamera == 1) {
        camera.lookAt(Player.playerModel[0].position.x, 0, 0);
        if (Player.mooveRight || Player.mooveLeft) {
          camera.position.set(
            Player.playerModel[0].position.x,
            Player.playerModel[0].position.y + 3,
            Player.playerModel[0].position.z + 3
          );
        }
      }
      else {
        camera.lookAt(center);
      }
      if (Player.playerModel[0].position.x < -Level.limgauche) {
        Player.playerModel[0].position.x = -Level.limgauche;
      }
      if (Player.playerModel[0].position.x > Level.limdroite) {
        Player.playerModel[0].position.x = Level.limdroite;
      }
      if(Level.started && !Level.paused && Level.tab[0].length > 0) {
        if (!Player.invincible) {
          for (let j = 0; j < Level.tab.length; j++) {
            for (let i = 0; i < Level.tab[j].length; i++) {
              if (Level.tab[j][i] != undefined) {
                Level.tab[j][i].position.x += Ennemy.ennemySpeed * delta;
                if(Level.tab[j][i].position.x >= Level.limdroite - Ennemy.radius  || Level.tab[j][i].position.x <= - Level.limgauche + Ennemy.radius) {
                  Ennemy.ennemySpeed = -Ennemy.ennemySpeed;
                  if (Ennemy.estDescendu == false) {
                    Ennemy.estDescendu = true;
                    for (let m = 0; m < Level.tab.length; m++) {
                      for (let n = 0; n < Level.tab[m].length; n++) {
                        if (Level.tab[m][n] != undefined) {
                          Level.tab[m][n].position.z += 0.5;
                        }
                      }
                    }
                    setTimeout(function() {
                      Ennemy.estDescendu = false;
                    }, 2000);
                  }
                  
                }
              }
            }
          }
        }
        for (let i = 0; i < Player.projectiles.length; i++) {
          Player.projectiles[i].position.z -= Player.projectilespeed * delta;
          // Vérifier si le projectile est sorti de la zone de jeu
          if (Player.projectiles[i].position.z < -10) {
            scene.remove(Player.projectiles[i]);
            Player.projectiles.splice(i, 1);
            i--;
          }
          // Permet de vérifier si le projectile touche un ennemi et d'attribuer les points
          for (let k = 0; k < Level.tab.length; k++) {
            for (let j = 0; j < Level.tab[k].length; j++) {
              if (Level.tab[k][j] != undefined) {
                if (Player.projectiles[i] != undefined) {
                  if (Player.projectiles[i].position.distanceTo(Level.tab[k][j].position) <= Ennemy.radius * 1.5) {
                      if (Level.levelactuelle[k][j] == 1) addScore(Ennemy.smallennemyscore, k, j, scene);
                      else if (Level.levelactuelle[k][j] == 2) addScore(Ennemy.mediumennemyscore, k, j, scene);
                      else if (Level.levelactuelle[k][j] == 3) addScore(Ennemy.bigennemyscore, k, j, scene);
                      else if (Level.levelactuelle[k][j] == 4) addScore(Ennemy.bossennemyscore, k, j, scene);
                      document.getElementById("score-text").textContent = "Score : " + (Player.score);
                      console.log(Player.score);
                      scene.remove(Level.tab[k][j]);
                      
                      if (Level.tab[k].length == 1) {

                        // Permet de charger le niveau suivant
                        if (Level.tab.length == 1) {
                          Level.tab[k].splice(j, 1);
                          Ennemy.ennemyanim[k].splice(j, 1);
                          Ennemy.ennemymixer[k].splice(j, 1);
                          Ennemy.ennemyaction[k].splice(j, 1);
                          spawnEnnemy(scene, camera);
                          document.getElementById("level-text").textContent = "LEVEL : " + (Level.wave);
                          document.getElementById("level-container").style.display = "block";
                          Level.paused = true;
                          setTimeout(function() {
                            document.getElementById("level-container").style.display = "none";
                            Level.paused = false;
                          }, 2000);
                        }
                        
                        // Supprime l'ennemie toucher 
                        else {
                          Level.tab[k].splice(j, 1);
                          Level.tab.splice(k, 1);
                          Level.levelactuelle[k].splice(j, 1);
                          Level.levelactuelle.splice(k, 1);
                          Ennemy.ennemyanim[k].splice(j, 1);
                          Ennemy.ennemymixer[k].splice(j, 1);
                          Ennemy.ennemyaction[k].splice(j, 1);
                          Ennemy.ennemyanim.splice(k, 1);
                          Ennemy.ennemymixer.splice(k, 1);
                          Ennemy.ennemyaction.splice(k, 1);
                          k--;
                          j--;
                          scene.remove(Player.projectiles[i]); 
                          Player.projectiles.splice(i, 1);
                          i--;
                          break;
                          //console.log(tab);
                        }
                      }

                      // Supprime l'ennemie toucher
                      else {
                        Level.tab[k].splice(j, 1);
                        Level.levelactuelle[k].splice(j, 1);
                        Ennemy.ennemyanim[k].splice(j, 1);
                        Ennemy.ennemymixer[k].splice(j, 1);
                        Ennemy.ennemyaction[k].splice(j, 1);
                      }
                      scene.remove(Player.projectiles[i]);
                      Player.projectiles.splice(i, 1);
                      i--;
                  }
                  // Permet de vérifier si le projectile touche un abris
                  else {
                    for (let l = 0; l < Level.abris.length; l++) {
                      if (Player.projectiles[i] != undefined) {
                        if ((Player.projectiles[i].position.distanceTo(Level.abris[l].position) <= 1.5) && (Player.invincible == false)) {
                          scene.remove(Player.projectiles[i]);
                          Player.projectiles.splice(i, 1);
                          Level.abris[l].scale.z -= 0.1;
                          Level.abris[l].position.z -= 0.05;
                          if (Level.abris[l].scale.z <= 0.1) {
                            scene.remove(Level.abris[l]);
                            Level.abris.splice(l, 1);
                            l--;
                          }
                          i--;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }

        // Permet de faure bouger les projectile ennemies
        if (!Player.invincible) {
          for (let i = 0; i < Ennemy.projectilesEnnemy.length; i++) {
            Ennemy.projectilesEnnemy[i].position.z += Ennemy.projectilespeedEnnemy * delta;
            // Vérifier si le projectile est sorti de la zone de jeu
            if (Ennemy.projectilesEnnemy[i].position.z > 10) {  
                scene.remove(Ennemy.projectilesEnnemy[i]);
                Ennemy.projectilesEnnemy.splice(i, 1);
                i--;
              }
            // Vérifier si le projectile touche le joueur
            else if (Ennemy.projectilesEnnemy[i].position.distanceTo(Player.playerModel[0].position) <= 1.5) {
                console.log("playerModel toucher");
                if(Player.vie >= 3) musicANDsound.soundeffectArray["douleur_1"].play();
                else if(Player.vie == 2) musicANDsound.soundeffectArray["douleur_2"].play();
                else if(Player.vie == 1) musicANDsound.soundeffectArray["douleur_3"].play();
                Player.vie -= 1;
                Player.tookdamage = true;
                const heartsContainer = document.getElementById('hearts-container');
                heartsContainer.removeChild(heartsContainer.lastChild);
                scene.remove(Ennemy.projectilesEnnemy[i]);
                Ennemy.projectilesEnnemy.splice(i, 1);
                i--;
              }
              // Vérifier si le projectile touche un abris
              else {
                for (let j = 0; j < Level.abris.length; j++) {
                  if (Ennemy.projectilesEnnemy[i] != undefined) {
                    if (Ennemy.projectilesEnnemy[i].position.distanceTo(Level.abris[j].position) <= 1.5) {
                      scene.remove(Ennemy.projectilesEnnemy[i]);
                      Ennemy.projectilesEnnemy.splice(i, 1);
                      Level.abris[j].scale.z -= 0.1;
                      Level.abris[j].position.z += 0.05;
                      if (Level.abris[j].scale.z <= 0.1) {
                        scene.remove(Level.abris[j]);
                        Level.abris.splice(j, 1);
                        j--;
                      }
                      i--;
                    }
                  }
                }
              }

          }
          // Permet de crée les projectile ennmie
          if (Level.tab[0].length > 0) {
              if (Ennemy.projectilesEnnemy.length < Ennemy.projectilesmaxEnnemy) {
              let aliennum = createProjectileEnnemie(scene);
            }
          }
        }
        // Verifie si le joueur est mort ou si les aliens sont trop proche
        if ((Level.tab[0].length != 0 && Level.tab[0][0].position.z > 8) || Player.vie == 0) {
          
          playAnimation(7,1, Player.bodyData, Player.playerModel[0]);
          
          setTimeout(function() {
            action.paused = true;
            Level.started = false;
            Level.loose = true;
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
          console.log(Level.lvl1);
          for (let i = 0; i < Level.tab.length; i++) {
            for (let j = 0; j < Level.tab[i].length; j++) {
              scene.remove(Level.tab[i][j]);
              Level.tab[i].splice(j, 1);
              j--;
            }
          }
          
          console.log(Level.levelactuelle);
          console.log(Level.tab);
        }
        //boxHelper.update();
      }
    }
    return Level.tab;
}


export { spawnEnnemy };
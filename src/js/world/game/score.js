import * as THREE from 'three';
import { Player, Level } from './config';
import { gsap } from "gsap";


function addScore(scoreennemi, i, j, scene) {
    // ce baser sur https://codepen.io/sureshwisdom/pen/gObavym
    Player.score += scoreennemi;
    var message = "+" + scoreennemi;
    var parameters = { fontsize: 20, textColor: {r:255, g:0, b:0, a:1.0}}
    if ( parameters === undefined ) parameters = {};
    var fontface = parameters.hasOwnProperty("fontface") ? parameters["fontface"] : "Courier New";
    var fontsize = parameters.hasOwnProperty("fontsize") ? parameters["fontsize"] : 18;
    var borderThickness = parameters.hasOwnProperty("borderThickness") ? parameters["borderThickness"] : 4;
    var borderColor = parameters.hasOwnProperty("borderColor") ?parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };
    var textColor = parameters.hasOwnProperty("textColor") ?parameters["textColor"] : { r:255, g:0, b:0, a:1.0 };
  
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    context.font = "Bold " + fontsize + "px " + fontface;
    context.fillStyle = "rgba("+textColor.r+", "+textColor.g+", "+textColor.b+", 1.0)";
    context.fillText( message, borderThickness, fontsize + borderThickness);
  
    var texture = new THREE.Texture(canvas) 
    texture.needsUpdate = true;
    var spriteMaterial = new THREE.SpriteMaterial( { map: texture } );
    var sprite = new THREE.Sprite( spriteMaterial );
    sprite.scale.set(0.5 * fontsize, 0.25 * fontsize, 0.75 * fontsize);
    if (Player.quelCamera == 2) {
      sprite.position.set(Level.tab[i][j].position.x + 3, Level.tab[i][j].position.y, Level.tab[i][j].position.z - 3.5);
    }
    else {
      sprite.position.set(Level.tab[i][j].position.x + 4.5, Level.tab[i][j].position.y, Level.tab[i][j].position.z);
    }
    scene.add(sprite);
    gsap.to(sprite.position, {
      duration: 1,
      x: sprite.position.x,
      y: sprite.position.y + 1,
      z: sprite.position.z,
      ease: "linear",
      onComplete: function() {
        scene.remove(sprite);
      }
    });
    //return sprite;
  }

  export { addScore };
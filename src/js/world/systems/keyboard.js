// import form the module keyboardjs
import keyboardJS from 'keyboardjs';
import { Level, musicANDsound } from '../game/config';


// Doc : https://www.npmjs.com/package/keyboard-ts

var gamestarted = false
function createKeyboard(container, world) {

  // make the container able to receive key events

  keyboardJS.bind('num0', function (e) {
    world.changeCamera0();
  });
  keyboardJS.bind('num1', function (e) {
    world.changeCamera1();
  });
  keyboardJS.bind('num2', function (e) {
    world.changeCamera2();
  });
  // left arrow
  keyboardJS.bind('left', function (e) {
    world.mooveLeft();
  });
  // right arrow
  keyboardJS.bind('right', function (e) {
    world.mooveRight();
  });
  keyboardJS.bind('enter', function (e) {
    if (gamestarted == false) {
      console.log("start");
      gamestarted = true;
      Level.started = true;
      world.removeObjects();
      musicANDsound.musicArray["music_intro"].play();
      setTimeout(function() {
        musicANDsound.soundeffectArray["C_EST_PARTI"].play();
      }, 5000);
      setTimeout(function() {
        musicANDsound.musicArray["music_ambiance"].play();
      }, 16000);
    }
    else {
      console.log("restart");
      world.restart();
    }
  });
/*
document.addEventListener("keydown", onDocumentKeyDown, false);

function onDocumentKeyDown(event) {
  switch (event.keyCode) {
    case 37:
      if (event.type == "keydown") {

      }
      break;
    case 38:
      console.log("Up arrow key was pressed");
      break;
    case 39:
      console.log("Right arrow key was pressed");
      break;
    case 40:
      console.log("Down arrow key was pressed");
      break;
    default:
      console.log("Other key was pressed");
      break;
  }
}*/

  keyboardJS.bind('space', function (e) {
    world.shoot();
  });
  keyboardJS.bind('i', function (e) {
    world.invincible();
  });
  keyboardJS.bind('k', function (e) {
    world.killall();
  });
  keyboardJS.bind('h', function (e) {
    world.showHelp();
  });
}

export { createKeyboard };

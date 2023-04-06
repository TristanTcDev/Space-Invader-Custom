// import form the module keyboardjs
import keyboardJS from 'keyboardjs';
import { Level, Player, musicANDsound } from '../game/config';
import buzz from 'buzz';


// Doc : https://www.npmjs.com/package/keyboard-ts

var gamestarted = false;
var originalsound = true;
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
    Player.mooveLeft = true;
    world.mooveLeft();
  }, (e) => {
    Player.mooveLeft = false;
  });
  // right arrow
  keyboardJS.bind('right', function (e) {
    Player.mooveRight = true;
    world.mooveRight();
  }, (e) => {
    Player.mooveRight = false;
  });
  keyboardJS.bind('enter', function (e) {
    if (gamestarted == false) {
      const heartsContainer = document.getElementById('hearts-container');
      for (let i = 0; i < Player.vie; i++) {
        const heartImage = document.createElement('img');
        heartImage.style.width = '75px';
        heartImage.src = './src/medias/images/heart.png';
        heartsContainer.appendChild(heartImage);
      }
      document.getElementById('score-text').style.display = 'block';
      gamestarted = true;
      Level.started = true;
      world.removeObjects();
      musicANDsound.musicArray["music_intro"].play();
      musicANDsound.soundeffectArray["C_EST_PARTI"].play()
      setTimeout(function() {
        musicANDsound.musicArray["music_ambiance"].play();
      }, 16000);
    }
    else {
      console.log("restart");
      world.restart();
    }
  });

  keyboardJS.bind('space', function (e) {
    world.shoot();
  });
  keyboardJS.bind('i', function (e) {
    e.preventRepeat();
    world.invincible();
  });
  keyboardJS.bind('k', function (e) {
    e.preventRepeat();
    world.killall();
  });
  keyboardJS.bind('h', function (e) {
    e.preventRepeat();
    world.showHelp();
  });
  keyboardJS.bind('a', function (e) {
    e.preventRepeat();
    console.log("a");
    world.regenerateAbris();
  });
  keyboardJS.bind('s', function (e) {
    e.preventRepeat();
    console.log("s");
    world.stopsound();
  });
  keyboardJS.bind('m', function (e) {
    e.preventRepeat();
    console.log("m");
    world.stopmusic();
  });
  keyboardJS.bind('p + e + w', function (e) {
    e.preventRepeat();
    if (originalsound) {
      musicANDsound.soundeffectArray["corkishoot"] = new buzz.sound("src/medias/sounds/pew.mp3");
      originalsound = false;
    }
    else {
      musicANDsound.soundeffectArray["corkishoot"] = new buzz.sound("src/medias/sounds/corkishoot.mp3");
      originalsound = true;
    }
  });
}

export { createKeyboard };

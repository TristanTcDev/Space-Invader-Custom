// import form the module keyboardjs
import keyboardJS from 'keyboardjs';
import { Level, Player, musicANDsound } from '../game/config';
import buzz from 'buzz';


// Doc : https://www.npmjs.com/package/keyboard-ts
var musicState = 1;
var soundState = 1;
const divimagemusic = document.getElementById('image-button-1');
const divimagesound = document.getElementById('image-button-2');
var imagemusic = document.getElementById('image-music');
var imagesound = document.getElementById('image-sound');
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
      const soundContainer = document.getElementById('image-button-container');
      soundContainer.style.display = 'block';
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
      world.restart();
    }
  });
  keyboardJS.bind('space', function (e) {
    world.shoot();
  });
  keyboardJS.bind('a', function (e) {
    e.preventRepeat();
    world.regenerateAbris();
  });
  keyboardJS.bind('g', function (e) {
    e.preventRepeat();
    Level.postProcess = !Level.postProcess;
  });
  keyboardJS.bind('h', function (e) {
    e.preventRepeat();
    world.showHelp();
  });
  keyboardJS.bind('i', function (e) {
    e.preventRepeat();
    world.invincible();
  });
  keyboardJS.bind('k', function (e) {
    e.preventRepeat();
    world.killall();
  });
  keyboardJS.bind('m', function (e) {
    e.preventRepeat();
    world.stopmusic();
    var image = document.getElementById("image-music");
    if (musicState === 0) {
        image.src = "src/medias/images/music-icon.png";
        musicState = 1; 
    } else {
        image.src = "src/medias/images/music-off-icon.png";
        musicState = 0; 
    }
  });
  keyboardJS.bind('s', function (e) {
    e.preventRepeat();
    world.stopsound();
    var image = document.getElementById("image-sound");
    if (soundState === 0) {
        image.src = "src/medias/images/sound-full-icon.png";
        soundState = 1; 
    } else {
        image.src = "src/medias/images/volume-mute-icon.png";
        soundState = 0;
    }
  });
  // code de triche secret permettant de modifier le son de tir, félicitation de l'avoir trouvé.
  keyboardJS.bind('p + e + w', function (e) {
    e.preventRepeat();
    if (originalsound) {
      musicANDsound.soundeffectArray["corkishoot"] = new buzz.sound("src/medias/sounds/UltraSuperGigaSecretSoundEasterEgg.mp3");
      originalsound = false;
    }
    else {
      musicANDsound.soundeffectArray["corkishoot"] = new buzz.sound("src/medias/sounds/corkishoot.mp3");
      originalsound = true;
    }
  });
  divimagemusic.addEventListener('click', function (e) {
    world.stopmusic();
    if (soundState === 0) {
        imagemusic.src = "src/medias/images/music-icon.png";
        soundState = 1; 
    } else {
        imagemusic.src = "src/medias/images/music-off-icon.png";
        soundState = 0;
    }
  });
  divimagesound.addEventListener('click', function (e) {
    world.stopsound();
    if (soundState === 0) {
        imagesound.src = "src/medias/images/sound-full-icon.png";
        soundState = 1; 
    } else {
        imagesound.src = "src/medias/images/volume-mute-icon.png";
        soundState = 0;
    }
  });
}

export { createKeyboard };

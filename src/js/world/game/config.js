

const Ennemy = {
  ennemySpeed: 3.5,
  radius: 0.5,

  smallennemyscore: 10,
  mediumennemyscore: 20,
  bigennemyscore: 30,
  bossennemyscore: 50,

  projectilesEnnemy: [],
  projectilespeedEnnemy: 8,
  projectilesmaxEnnemy: 1,

  ennemyModel: [],
  ennemybodyData: [],
  ennemyanim: [],
  ennemyaction: [],
  ennemymixer: [],

  estDescendu: false,
};


const Player = {
  playerSpeed: 12,
  mooveRight: false,
  mooveLeft: false,
  projectiles: [],
  projectilespeed: 24,
  projectilesmaxPlayer: 1,
  invincible: false,
  playerModel: [],
  bodyData: null,
  playerprojectileModel: null,
  animationPlayed: true,
  score: 0,
  bestScore: 0,
  quelCamera: 0,
  vie : 3,
  tookdamage: false,

};

const musicANDsound = {
  soundeffectArray: [],
  musicArray: [],
};

const Level = {
  postProcess: true,
  loadingOjbects: [],
  started: false,
  finished: false,
  paused: false,
  loose: false,

  nbligne: 5,
  nbcolonne: 10,
  limgauche: 15,
  limdroite: 15,
  tab : [],
  levelactuelle: [],
  /*lvl1: [ [0, 1, 0, 1, 0, 1, 0, 1, 0, 0],
          [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
          [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
          [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
          [3, 3, 3, 3, 3, 3, 3, 3, 3, 3]],*/

  /* 0 = pas d'ennemies 
  * 1 = ennemie à 10 points
  * 2 = ennemie à 20 points
  * 3 = ennemie à 30 points
  * 4 = ennemie à 50 points
  */

  lvl1: [ [0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
          [0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
          [0, 0, 2, 0, 2, 0, 2, 0, 0, 0],
          [0, 0, 0, 2, 0, 2, 0, 0, 0, 0],
          [0, 0, 0, 0, 3, 0, 0, 0, 0, 0]],

  lvl2: [ [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
          [0, 1, 0, 1, 0, 1, 0, 1, 0, 0],
          [0, 0, 2, 0, 2, 0, 2, 0, 0, 0],
          [0, 0, 0, 2, 2, 2, 0, 0, 0, 0],
          [0, 0, 2, 3, 3, 3, 2, 0, 0, 0]],

  lvl3: [ [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
          [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
          [0, 0, 0, 2, 2, 2, 2, 0, 0, 0],
          [0, 0, 2, 2, 2, 2, 2, 2, 0, 0],
          [0, 0, 3, 3, 3, 3, 3, 3, 0, 0]],

  lvl4: [ [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
          [0, 1, 1, 0, 0, 0, 0, 1, 1, 0],
          [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
          [3, 0, 3, 3, 3, 3, 3, 3, 3, 0],
          [0, 3, 4, 4, 4, 4, 4, 3, 0, 3]],

  lvl5: [ [0, 2, 2, 0, 4, 4, 0, 2, 2, 0],
          [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
          [0, 4, 0, 3, 4, 4, 3, 0, 4, 0],
          [0, 3, 3, 3, 2, 2, 3, 3, 3, 0],
          [4, 2, 4, 3, 3, 3, 3, 4, 2, 4]],
  wave: 0,
  abris: [],

  verticestar: null,
  stars: null,
  starbox: null,
};

export { Ennemy, Player, Level, musicANDsound };

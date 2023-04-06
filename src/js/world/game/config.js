

const Ennemy = {
  ennemySpeed: 2,
  radius: 0.5,
  segments: 32,

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
  quelCamera: 0,
  vie : 3,

};

const musicANDsound = {
  soundeffectArray: [],
  musicArray: [],
};

const Level = {
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

  lvl1: [[0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
          [0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
          [0, 0, 2, 0, 2, 0, 2, 0, 0, 0],
          [0, 0, 0, 2, 0, 2, 0, 0, 0, 0],
          [0, 0, 0, 0, 3, 0, 0, 0, 0, 0]],

  lvl2: [[1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
          [0, 1, 0, 1, 0, 1, 0, 1, 0, 0],
          [0, 0, 2, 0, 2, 0, 2, 0, 0, 0],
          [0, 0, 0, 2, 2, 2, 0, 0, 0, 0],
          [0, 0, 2, 3, 3, 3, 2, 0, 0, 0]],

  lvl3: [[1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
          [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
          [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
          [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
          [3, 3, 3, 3, 3, 3, 3, 3, 3, 3]],

  lvl4: [[],],
  wave: 0,
  abris: [],

  verticestar: null,
  stars: null,
  starbox: null,
};

export { Ennemy, Player, Level, musicANDsound };

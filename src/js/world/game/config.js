

const Ennemy = {
  ennemySpeed: 2,
  radius: 0.5,
  segments: 32,

  smallennemyscore: 10,
  mediumennemyscore: 20,
  bigennemyscore: 30,
  bossennemyscore: 50,

  projectilesEnnemy: [],
  projectilespeedEnnemy: 0.1,
  projectilesmaxEnnemy: 1,

  ennemyModel: [],
  ennemybodyData: [],
  ennemyanim: [],
  ennemyaction: [],
  ennemymixer: [],

  estDescendu: false,
};


const Player = {
  playerSpeed: 8,
  mooveRight: false,
  mooveLeft: false,
  projectiles: [],
  projectilespeed: 0.4,
  projectilesmaxPlayer: 1,
  invincible: false,
  playerModel: null,
  bodyData: null,
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

  lvl1: [[0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
          [0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
          [0, 0, 2, 0, 2, 0, 2, 0, 0, 0],
          [0, 0, 2, 0, 0, 0, 2, 0, 0, 0],
          [3, 0, 0, 0, 3, 0, 0, 0, 3, 0]],

  lvl2: [[1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
          [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
          [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
          [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
          [3, 3, 3, 3, 3, 3, 3, 3, 3, 3]],

  lvl3: [[],],
  wave: 0,
  abris: [],
}

//------------------------------- Maison ---
const houseConfig = {
    shutters: { //--- volets
      openProbability: 0.75,  // probabilité d'avoir des volets ouverts
      open: true,             // les volets sont ouverts ou fermés ?
    },
};

function randHouseConfig(n) {
  rowOfHousesConfig.housesWidth = 0;
}

export { Ennemy, Player, Level, musicANDsound };

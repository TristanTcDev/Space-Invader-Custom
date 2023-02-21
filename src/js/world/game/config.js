
// Conventions : 
//  - les valeurs à 0 sont à initialiser ou calculer
//  - les valeurs différentes de 0 sont fixées
//  - Min et Max pour des entiers, min et max pour des flottants

//----------------------------- Quartier ---
const Ennemy = {
    ennemySpeed: 2,
    radius: 0.5,
    segments: 32,

    smallennemyscore: 10,
    mediumennemyscore: 20,
    bigennemyscore: 30,

    projectilesEnnemy: [],
    projectilespeedEnnemy: 0.1,
    projectilesmaxEnnemy: 1,

    ennemyModel: null,
    ennemybodyData: null,
    ennemyanim: [],
  };
  
  //-------------------- Rangée de maisons ---
  const Player = {
    playerSpeed: 1,       // tableau de configurations de maisons
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
    started: false,
    finished: false,
    paused: false,

    nbligne: 5,
    nbcolonne: 10,
    limgauche: 15,
    limdroite: 15,
    tab : [],
    levelactuelle: [],
    lvl1: [[0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3]],

    lvl2: [[1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
            [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3]],
    wave: 0,
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
  
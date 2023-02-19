import * as THREE from 'three';
import { Player } from '../game/config.js';

function Playermoove() {
    Player.playerModel.tick = (delta) =>  {
        Player.playerModel.position.x += Player.speed * delta;
        console.log(Player.playerModel.position.x);
    }
}

export { Playermoove };
import buzz from 'buzz';
import { musicANDsound } from './config';

function SoundGestion() {
    musicANDsound.soundeffectArray["C_EST_PARTI"] = new buzz.sound("src/medias/sounds/C_EST_PARTI.mp3");
    musicANDsound.soundeffectArray["C_EST_PARTI"].setVolume(60);
    musicANDsound.soundeffectArray["douleur_1"] = new buzz.sound("src/medias/sounds/douleur_1.mp3");
    musicANDsound.soundeffectArray["douleur_2"] = new buzz.sound("src/medias/sounds/douleur_2.mp3");
    musicANDsound.soundeffectArray["douleur_3"] = new buzz.sound("src/medias/sounds/douleur_3.mp3");


    musicANDsound.musicArray["music_intro"] = new buzz.sound("src/medias/sounds/music_intro.mp3");
    musicANDsound.musicArray["music_intro"].setVolume(15);
    musicANDsound.musicArray["music_ambiance"] = new buzz.sound("src/medias/sounds/music_ambiance.mp3");
    musicANDsound.musicArray["music_ambiance"].setVolume(15);
    musicANDsound.musicArray["music_ambiance"].loop();
}

export { SoundGestion}
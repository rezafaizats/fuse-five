import * as Phaser from "phaser";
import { AbstractAssetLoader } from "phaser3-class-preloader";
import { _ } from "Assets/_";

export class AssetLoader extends AbstractAssetLoader {

    preload() {
        this.load
            .multiatlas(_.Atlas.DEFAULT, require("Assets/images/default/atlas.json").json)
            .json(_.CustomPhysics.ARENA_BOUNDARY, require('Assets/physics/arena-physics.json').default)
            .audio(_.SFX.BUTTON_DOWN, require("Assets/sfxs/tryagain.mp3"))
            .audio(_.SFX.PAUSE, require('Assets/sfxs/pause.mp3'))
            .audio(_.SFX.EXPLODE, require('Assets/sfxs/explode.mp3'))
            .audio(_.SFX.SCORECOUNT, require('Assets/sfxs/score-count.mp3'))
            .audio(_.SFX.TIMES_UP, require('Assets/sfxs/timesup.mp3'))
            ;
    }

    create() {

    }

}
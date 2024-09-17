import * as Phaser from "phaser"
import { _ } from "Assets/_"

export class TestingScene extends Phaser.Scene{

    tween!: Phaser.Tweens.Tween

    constructor(){
        super(_.Scene.TESTING_SCENE);
    }

    create(){

        let ball = this.add.sprite(
            this.viewport.center.x,
            this.viewport.center.y,
            _.Atlas.DEFAULT,
            _.Atlas.Frame.DEFAULT.BALL)
        .setInteractive();

        this.tween = this.add.tween({
            targets: ball,
            scaleX: 3,
            scaleY: 3,
            duration: 7000,
            ease: 'Linear',
            loop: 0,
            yoyo: false
        });

        this.input.keyboard.on("keydown-S", () => {
            this.tween.pause();
        });

        this.input.keyboard.on("keydown-D", () => {
            this.tween.resume();
        });
    }

}
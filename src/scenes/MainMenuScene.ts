import * as Phaser from "phaser"
import { _ } from "Assets/_"

export class MainMenuScene extends Phaser.Scene{

    StartBtn!: Phaser.GameObjects.Sprite

    constructor(){
        super(_.Scene.TITLE);
    }

    create(){
        //Background
        this.add.image(
            this.viewport.center.x,
            this.viewport.center.y,
            _.Atlas.DEFAULT,
            _.Atlas.Frame.DEFAULT.BG_MENU
        ).setDepth(0);

        //TITLE
        this.add.image(
            this.viewport.center.x,
            this.viewport.top + 300,
            _.Atlas.DEFAULT,
            _.Atlas.Frame.DEFAULT.BG_TITLE
        ).setDepth(1)
        .setScale(0.9);

        //Start Button
        this.StartBtn = this.add.sprite(
            this.viewport.center.x,
            this.viewport.center.y + 175,
            _.Atlas.DEFAULT,
            _.Atlas.Frame.DEFAULT.START_BTN
        ).setDepth(2)
        .setScale(0.85);

        let sfxBtnDown = this.sound.add(_.SFX.BUTTON_DOWN, {volume: 0.5});
        this.StartBtn.setInteractive();

        this.StartBtn.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
            // this.scene.start(_.Scene.GAME_SCENE);
            this.tweens.add({
                targets: this.StartBtn,
                scaleX: 0.75,
                scaleY: 0.75,
                ease: 'Power1',
                duration: 200,
                repeat: 0,
                yoyo: false,
                onComplete: () => {
                    sfxBtnDown.play();
                    this.tweens.add({                        
                        targets: this.StartBtn,
                        scaleX: 0.85,
                        scaleY: 0.85,
                        ease: 'Back.easeOut',
                        duration: 200,
                        onComplete: () => {
                            this.scene.launch(_.Scene.SELECTION_POPUP);
                            this.scene.pause();
                        }
                    });
                },
            });
        });

        //Opening Tween        
        let screen_transition = this.add.graphics();
            screen_transition.fillStyle(0x000000);
            screen_transition.setScale(5);
            screen_transition.fillRect(0, 0, 1024, 1024);
            screen_transition.setDepth(10);

        this.tweens.add({
            targets: screen_transition,
            alpha: {
                from: 1,
                to: 0
            },
            duration: 315,
            ease: "Power2"
        });


    }

}
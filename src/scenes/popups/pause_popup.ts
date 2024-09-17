import * as Phaser from "phaser"
import { _ } from "Assets/_"
import { GameScene } from "../GameScene";

export class pause_popup extends Phaser.Scene{
    
    BackToMenuButton!: Phaser.GameObjects.Sprite;
    ResumeButton!: Phaser.GameObjects.Sprite;

    constructor(){
        super(_.Scene.PAUSE_POPUP);
    }

    create(){
        
        let bg_popup = this.add.graphics();
        bg_popup.fillStyle(0x000000);
        bg_popup.alpha = 0.5;
        bg_popup.fillRect(
            0,
            0,
            this.viewport.width,
            this.viewport.height
        );
        bg_popup.setDepth(1);

        this.add.sprite(
            this.viewport.center.x,
            this.viewport.center.y,
            _.Atlas.DEFAULT,
            _.Atlas.Frame.DEFAULT.POPUP_BG
        ).setDepth(2)
        .setOrigin(0.5);

        this.BackToMenuButton = this.add.sprite(
            this.viewport.center.x,
            this.viewport.center.y + 75,
            _.Atlas.DEFAULT,
            _.Atlas.Frame.DEFAULT.BACKTOMENU_BTN,)
            .setDepth(3)
            .setOrigin(0.5)
            .setInteractive();

        this.ResumeButton = this.add.sprite(
            this.viewport.center.x,
            this.viewport.center.y - 75,
            _.Atlas.DEFAULT,
            _.Atlas.Frame.DEFAULT.RESUME_BTN)
            .setDepth(3)
            .setOrigin(0.5)
            .setInteractive();

        let btnsound = this.sound.add(_.SFX.BUTTON_DOWN);

        this.BackToMenuButton.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
            btnsound.play();
            this.scene.stop(_.Scene.GAME_SCENE);
            this.scene.start(_.Scene.TITLE);
        });

        this.ResumeButton.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
            btnsound.play();
            this.scene.resume(_.Scene.GAME_SCENE);
            this.scene.stop(_.Scene.PAUSE_POPUP);
        });

    }

}
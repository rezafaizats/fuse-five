import * as Phaser from "phaser"
import { _ } from "Assets/_"

export class retry_popup extends Phaser.Scene{

    Score = 0;
    RibbonImage!: Phaser.GameObjects.Image
    BannerImage!: Phaser.GameObjects.Image
    RibbonTextImage!: Phaser.GameObjects.Image
    RetryButton!: Phaser.GameObjects.Image
    HomeButton!: Phaser.GameObjects.Image

    init(score: {score: number}){
        this.Score = score.score;
    }

    constructor(){
        super(_.Scene.RETRY_POPUP);
    }

    create(){

        // let bg_popup = this.add.graphics();
        // bg_popup.fillStyle(0x000000);
        // bg_popup.alpha = 0.5;
        // bg_popup.fillRect(
        //     0,
        //     0,
        //     this.viewport.width,
        //     this.viewport.height
        // );
        // bg_popup.setDepth(1);

        let bg_popup = this.add.image(
            this.viewport.center.x,
            this.viewport.center.y,
            _.Atlas.DEFAULT,
            _.Atlas.Frame.DEFAULT.OVERLAY_BG
        ).setOrigin(0.5)
        .setDepth(0)
        .setAlpha(0)
        .setInteractive();

        this.RibbonImage = this.add.image(
            this.viewport.center.x,
            this.viewport.top + 100,
            _.Atlas.DEFAULT,
            _.Atlas.Frame.DEFAULT.RIBBON_GO)
        .setDepth(1)
        .setAlpha(0)
        .setOrigin(0.5);

        this.RibbonTextImage = this.add.image(
            this.RibbonImage.x,
            this.RibbonImage.y - 7,
            _.Atlas.DEFAULT,
            _.Atlas.Frame.DEFAULT.GO_TEXT)
        .setDepth(2)
        .setAlpha(0)
        .setOrigin(0.5);

        this.BannerImage = this.add.image(
            this.viewport.center.x,
            this.viewport.center.y + 50,
            _.Atlas.DEFAULT,
            _.Atlas.Frame.DEFAULT.BANNER_GO)
        .setDepth(1)
        .setAlpha(0);

        this.RetryButton = this.add.image(
            this.viewport.center.x - 100,
            this.viewport.center.y + 175,
            _.Atlas.DEFAULT,
            _.Atlas.Frame.DEFAULT.RETRY_BTN)
        .setDepth(2)
        .setAlpha(0)
        .setOrigin(0.5)
        .setInteractive();

        this.HomeButton = this.add.image(
            this.viewport.center.x + 100,
            this.viewport.center.y + 175,
            _.Atlas.DEFAULT,
            _.Atlas.Frame.DEFAULT.BACKHOME_BTN)
        .setDepth(2)
        .setAlpha(0)
        .setOrigin(0.5)
        .setInteractive();

        let btn_down = this.sound.add(_.SFX.BUTTON_DOWN);

        let textStyle = {
            fontFamily: _.Font.GAME,
            fontSize: "65px",
        }
        
        let timesUpText = this.add.text(
            this.viewport.center.x,
            this.viewport.center.y,
            "TIMES UP!",
            textStyle)
            .setOrigin(0.5)
            .setAlpha(0)
            .setAlign('center')
            .setDepth(2);

        //Opening Tween
        this.tweens.add({
            targets: bg_popup,
            delay: 250,
            alpha: {
                from: 0,
                to: 0.6
            },
            ease: "Power1",
            duration: 1000,
        });

        this.tweens.add({
            targets: timesUpText,
            duration: 1000,
            ease: "Bounce.easeOut",
            alpha: {
                from: 0,
                to: 1
            },
            scaleX: {
                from: 1,
                to: 1.1
            },
            scaleY: {
                from: 1,
                to: 1.1
            },
            onComplete: () => {
                this.tweens.add({
                    targets: timesUpText,
                    duration: 500,
                    ease: "Power1",
                    alpha: {
                        from: 1,
                        to: 0
                    },
                    onComplete: () => {
                        this.CreateRibbonPopup();
                        this.CreateBannerPopup();
                    }
                });
            },
        });

        //Button Tween
        let screen_transition = this.add.graphics();
            screen_transition.fillStyle(0x000000);
            screen_transition.setScale(0);
            screen_transition.fillCircle(0, 0, 102.4);
            screen_transition.setDepth(10);

        this.RetryButton.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
            this.tweens.add({
                targets: this.RetryButton,
                scaleX: {
                    from: 1,
                    to: 0.9
                },
                scaleY: {
                    from: 1,
                    to: 0.9
                },
                ease: "Power1",
                duration: 350,
                onComplete: () => {
                    btn_down.play();
                    this.tweens.add({
                        targets: this.RetryButton,
                        scaleX: {
                            from: 0.9,
                            to: 1
                        },
                        scaleY: {
                            from: 0.9,
                            to: 1
                        },
                        ease: "Power1",
                        duration: 350,
                        onComplete: () => {
                            this.tweens.add({
                                targets: screen_transition,
                                scaleX: {
                                    from: 0,
                                    to: 20
                                },
                                scaleY: {
                                    from: 0,
                                    to: 20
                                },
                                duration: 750,
                                ease: 'Power2',
                                onComplete: () => {
                                    this.scene.stop(_.Scene.GAME_SCENE);
                                    this.scene.start(_.Scene.GAME_SCENE);
                                }
                            })
                        }
                    });
                }
            });
        });

        this.HomeButton.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
            this.tweens.add({
                targets: this.HomeButton,
                scaleX: {
                    from: 1,
                    to: 0.9
                },
                scaleY: {
                    from: 1,
                    to: 0.9
                },
                ease: "Power1",
                duration: 350,
                onComplete: () => {
                    btn_down.play();
                    this.tweens.add({
                        targets: this.HomeButton,
                        scaleX: {
                            from: 0.9,
                            to: 1
                        },
                        scaleY: {
                            from: 0.9,
                            to: 1
                        },
                        ease: "Power1",
                        duration: 350,
                        onComplete: () => {
                            
                            this.tweens.add({
                                targets: screen_transition,
                                scaleX: {
                                    from: 0,
                                    to: 20
                                },
                                scaleY: {
                                    from: 0,
                                    to: 20
                                },
                                duration: 750,
                                ease: 'Power2',
                                onComplete: () => {
                                    this.scene.stop(_.Scene.GAME_SCENE);
                                    this.scene.start(_.Scene.TITLE);
                                }
                            })
                        }
                    });
                }
            });
        });

    }

    CreateBannerPopup(){

        this.tweens.add({
            targets: this.BannerImage,
            scaleY: {
                from: 0.3,
                to: 1
            },
            duration: 500,
            ease: "Power1"
        });

        this.tweens.add({
            targets: [this.BannerImage, this.HomeButton, this.RetryButton],
            alpha: {
                from: 0,
                to: 1
            },
            duration: 750,
            ease: "Power1",
            onComplete: () => {
                let scoreStyle = {
                    fontFamily: _.Font.GAME,
                    fontSize: "36px",
                }

                this.add.text(
                    this.viewport.center.x + 10,
                    this.viewport.center.y - 25,
                    "Score\n" + this.Score.toString(),
                    scoreStyle)
                .setAlign("center")
                .setDepth(3)
                .setOrigin(0.5);
            }
        });

    }

    CreateRibbonPopup(){

        this.tweens.add({
            targets: [this.RibbonImage, this.RibbonTextImage],
            alpha: {
                from: 0,
                to: 1
            },
            scaleX: {
                from: 0.2,
                to: 1,
            },
            duration: 750,
            ease: "Power1"
        });
    }

}
import * as Phaser from "phaser"
import { _ } from "Assets/_"

export class selection_char extends Phaser.Scene{

    constructor(){
        super(_.Scene.SELECTION_POPUP);
    }

    create(){
        let selection_now = 1;
        let close_sound = this.sound.add(_.SFX.PAUSE);
        let btn_down = this.sound.add(_.SFX.BUTTON_DOWN);
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
        .setDepth(0);

        let close_popup = this.add.image(
            this.viewport.center.x + 225,
            this.viewport.center.y / 3 + 150,
            _.Atlas.DEFAULT,
            _.Atlas.Frame.DEFAULT.CLOSE_BTN
        );
        close_popup.setDepth(3);
        close_popup.setOrigin(0.5);
        close_popup.setInteractive();

        let selection_bg = this.add.image(
            this.viewport.center.x,
            this.viewport.center.y,
            _.Atlas.DEFAULT,
            _.Atlas.Frame.DEFAULT.SELECTION_BG)
            .setScale(1);
        selection_bg.setOrigin(0.5);
        selection_bg.setDepth(2);

        let next_btn = this.add.image(
            this.viewport.center.x + 200,
            this.viewport.center.y,
            _.Atlas.DEFAULT,
            _.Atlas.Frame.DEFAULT.NEXT_BTN)
            .setDepth(3)
            .setOrigin(0.5)
            .setScale(0.75)
            .setInteractive();
        
        let prev_btn = this.add.image(
            this.viewport.center.x - 200,
            this.viewport.center.y,
            _.Atlas.DEFAULT,
            _.Atlas.Frame.DEFAULT.NEXT_BTN)
            .setDepth(3)
            .setOrigin(0.5)
            .setScale(0.75)
            .setInteractive();
        prev_btn.flipX = true;

        let play_btn = this.add.image(
            this.viewport.center.x,
            this.viewport.center.y + 250,
            _.Atlas.DEFAULT,
            _.Atlas.Frame.DEFAULT.PLAY_SELECTION_BTN)
            .setDepth(3)
            .setOrigin(0.5)
            .setInteractive();

        let farmer_char = this.add.image(
            this.viewport.center.x,
            this.viewport.center.y - 100,
            _.Atlas.DEFAULT,
            _.Atlas.Frame.DEFAULT.YELLOW_SLCT
        );
        farmer_char.setDepth(3);

        let text_style = {
            fontFamily: _.Font.GAME,
            fontSize: "32px",
        };

        let farmer_skill_text = this.add.text(
            this.viewport.center.x,
            this.viewport.center.y,
            "+1 to all 1 balls",
            text_style)
            .setDepth(3)
            .setColor('0x996633')
            .setAlign("center")
            .setOrigin(0.5);

        let leaf_char = this.add.sprite(
            this.viewport.center.x / 3 + 400,
            this.viewport.center.y - 100,
            _.Atlas.DEFAULT,
            _.Atlas.Frame.DEFAULT.GREEN_SLCT
        );
        leaf_char.setDepth(3);
        leaf_char.setAlpha(0);

        let leaf_skill_text = this.add.text(
            leaf_char.x,
            leaf_char.y + 100,
            "Pop all green balls",
            text_style)
            .setDepth(3)
            .setAlpha(0)
            .setColor('0x996633')
            .setAlign("center")
            .setOrigin(0.5);

        let gardener_char = this.add.sprite(
            this.viewport.center.x / 3 + 150,
            this.viewport.center.y - 100,
            _.Atlas.DEFAULT,
            _.Atlas.Frame.DEFAULT.RED_SLCT
        );
        gardener_char.setDepth(3);
        gardener_char.setAlpha(0);

        let gardener_skill_text = this.add.text(
            gardener_char.x,
            gardener_char.y + 100,
            "+2 to all red balls",
            text_style)
            .setDepth(3)
            .setAlpha(0)
            .setColor('0x996633')
            .setAlign("center")
            .setOrigin(0.5);

        let woodworker_char = this.add.sprite(
            this.viewport.center.x / 3 + 400,
            this.viewport.center.y - 100,
            _.Atlas.DEFAULT,
            _.Atlas.Frame.DEFAULT.BROWN_SLCT
        );
        woodworker_char.setDepth(3);
        woodworker_char.setAlpha(0);

        let woodworker_skill_text = this.add.text(
            farmer_char.x,
            farmer_char.y + 100,
            "Pop all balls with\nvalue more than 2",
            text_style)
            .setDepth(3)
            .setAlpha(0)
            .setColor('0x996633')
            .setAlign("center")
            .setOrigin(0.5);
        
        //Opening tween
        this.tweens.add({
            targets: bg_popup,
            duration: 500,
            alpha: {
                from: 0,
                to: 0.75,
            },
            ease: 'Power3'
        });
        this.tweens.add({
            targets: close_popup,
            x: {
                from: this.viewport.center.x + 225,
                to: this.viewport.center.x + 225,
            },
            y: {
                from: this.viewport.bottom,
                to: this.viewport.center.y / 3 + 150,
            },
            duration: 750,
            ease: 'Power3'
        });
        this.tweens.add({
            targets: play_btn,
            y: {
                from: this.viewport.bottom,
                to: this.viewport.center.y + 325
            },
            duration: 750,
            ease: 'Power3'
        });
        this.tweens.add({
            targets: farmer_char,
            y: {
                from: this.viewport.bottom,
                to: this.viewport.center.y - 100
            },
            duration: 750,
            ease: 'Power3'
        });
        this.tweens.add({
            targets: [selection_bg, next_btn, prev_btn, farmer_skill_text],
            y: {
                from: this.viewport.bottom,
                to: this.viewport.center.y,
            },
            duration: 750,
            ease: 'Power3'
        });

        //Button tween
        close_popup.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
            this.tweens.add({
                targets: [selection_bg, close_popup, play_btn],
                scaleX: {
                    from: 1,
                    to: 0,
                },
                scaleY: {
                    from: 1,
                    to: 0,
                },
                duration: 500,
                alpha: {
                    from: 1,
                    to: 0,
                },
                ease: 'Power2',
                onStart: () => {
                    close_sound.play();
                },
                onComplete: () => {
                    this.scene.resume(_.Scene.TITLE);
                    this.scene.stop();
                }
            });
            this.tweens.add({
                targets: bg_popup,
                duration: 500,
                alpha: {
                    from: 0.75,
                    to: 0,
                },
                ease: 'Power2'
            });
            this.tweens.add({
                targets: [farmer_char, gardener_char, leaf_char, woodworker_char, prev_btn, next_btn, farmer_skill_text, gardener_skill_text, leaf_skill_text, woodworker_skill_text],
                duration: 500,
                alpha: '-= 1',
                ease: 'Power2'
            });
        });

        play_btn.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
            let screen_transition = this.add.graphics();
            screen_transition.fillStyle(0x000000);
            screen_transition.setScale(0);
            screen_transition.fillCircle(0, 0, 102.4);
            screen_transition.setDepth(10);

            this.tweens.add({
                targets: play_btn,
                duration: 175,
                ease: 'Power1',
                scaleX: 0.65,
                scaleY: 0.65,
                onComplete: () => {
                    btn_down.play();
                    this.tweens.add({
                        targets: play_btn,
                        duration: 175,
                        ease: 'Power1',
                        scaleX: 0.65,
                        scaleY: 0.65,
                    })
                }
            });
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
                    switch(selection_now){
                        case 1:
                            this.scene.start(_.Scene.GAME_SCENE, {
                            yellowskill: true,
                            greenskill: false,
                            redskill: false,
                            brownskill: false
                        });
                            break;
                        case 2:
                            this.scene.start(_.Scene.GAME_SCENE, {
                            yellowskill: false,
                            greenskill: true,
                            redskill: false,
                            brownskill: false
                        });
                            break;
                        case 3:
                            this.scene.start(_.Scene.GAME_SCENE, {
                            yellowskill: false,
                            greenskill: false,
                            redskill: true,
                            brownskill: false
                        });
                            break;
                        case 4:
                            this.scene.start(_.Scene.GAME_SCENE, {
                            yellowskill: false,
                            greenskill: false,
                            redskill: false,
                            brownskill: true
                        });
                            break;
                    }
                    this.scene.stop(_.Scene.TITLE);
                }
            });            
        });

        next_btn.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
            this.tweens.add({
                targets: next_btn,
                duration: 175,
                ease: 'Power1',
                scaleX: 0.65,
                scaleY: 0.65,
                onComplete: () => {
                    btn_down.play();
                    this.tweens.add({
                        targets: next_btn,
                        ease: 'Back.easeOut',
                        duration: 175,
                        scaleX: 0.75,
                        scaleY: 0.75,
                        onStart: () => {
                            switch(selection_now){
                                case 1:
                                    selection_now = 2;
                                    this.tweens.add({
                                        targets: [farmer_char, farmer_skill_text],
                                        x: {
                                            from: farmer_char.x,
                                            to: prev_btn.x
                                        },
                                        alpha: {
                                            from: 1,
                                            to: 0
                                        },
                                        duration: 175,
                                        ease: 'Power2'
                                    });
                                    this.tweens.add({
                                        targets: [leaf_char, leaf_skill_text],
                                        x: {
                                            from: next_btn.x,
                                            to: this.viewport.center.x
                                        },
                                        alpha: {
                                            from: 0,
                                            to: 1
                                        },
                                        duration: 175,
                                        ease: 'Power2'
                                    });
                                    break;
                                case 2:
                                    selection_now = 3;
                                    this.tweens.add({
                                        targets: [leaf_char, leaf_skill_text],
                                        x: {
                                            from: leaf_char.x,
                                            to: prev_btn.x
                                        },
                                        alpha: {
                                            from: 1,
                                            to: 0
                                        },
                                        duration: 175,
                                        ease: 'Power2'
                                    });
                                    this.tweens.add({
                                        targets: [gardener_char, gardener_skill_text],
                                        x: {
                                            from: next_btn.x,
                                            to: this.viewport.center.x
                                        },
                                        alpha: {
                                            from: 0,
                                            to: 1
                                        },
                                        duration: 175,
                                        ease: 'Power2'
                                    });
                                    break;
                                case 3:
                                    selection_now = 4;
                                    this.tweens.add({
                                        targets: [gardener_char, gardener_skill_text],
                                        x: {
                                            from: gardener_char.x,
                                            to: prev_btn.x
                                        },
                                        alpha: {
                                            from: 1,
                                            to: 0
                                        },
                                        duration: 175,
                                        ease: 'Power2'
                                    });
                                    this.tweens.add({
                                        targets: [woodworker_char, woodworker_skill_text],
                                        x: {
                                            from: next_btn.x,
                                            to: this.viewport.center.x
                                        },
                                        alpha: {
                                            from: 0,
                                            to: 1
                                        },
                                        duration: 175,
                                        ease: 'Power2'
                                    });
                                    break;
                                case 4:
                                    selection_now = 1;
                                    this.tweens.add({
                                        targets: [woodworker_char, woodworker_skill_text],
                                        x: {
                                            from: woodworker_char.x,
                                            to: prev_btn.x
                                        },
                                        alpha: {
                                            from: 1,
                                            to: 0
                                        },
                                        duration: 175,
                                        ease: 'Power2'
                                    });
                                    this.tweens.add({
                                        targets: [farmer_char, farmer_skill_text],
                                        x: {
                                            from: next_btn.x,
                                            to: this.viewport.center.x
                                        },
                                        alpha: {
                                            from: 0,
                                            to: 1
                                        },
                                        duration: 175,
                                        ease: 'Power2'
                                    });
                                    break;
                            }
                        }
                    })
                }
                });
            } 
        );

        prev_btn.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
            this.tweens.add({
                targets: prev_btn,
                duration: 175,
                ease: 'Power1',
                scaleX: 0.65,
                scaleY: 0.65,
                onComplete: () => {
                    btn_down.play();
                    this.tweens.add({
                        targets: prev_btn,
                        ease: 'Back.easeOut',
                        duration: 175,
                        scaleX: 0.75,
                        scaleY: 0.75,
                        onStart: () => {
                            switch(selection_now){
                                case 1:
                                    selection_now = 4;
                                    this.tweens.add({
                                        targets: [farmer_char, farmer_skill_text],
                                        x: {
                                            from: farmer_char.x,
                                            to: next_btn.x
                                        },
                                        alpha: {
                                            from: 1,
                                            to: 0
                                        },
                                        duration: 175,
                                        ease: 'Power2'
                                    });
                                    this.tweens.add({
                                        targets: [woodworker_char, woodworker_skill_text],
                                        x: {
                                            from: prev_btn.x,
                                            to: this.viewport.center.x
                                        },
                                        alpha: {
                                            from: 0,
                                            to: 1
                                        },
                                        duration: 175,
                                        ease: 'Power2'
                                    });
                                    break;
                                case 2:
                                    selection_now = 1;
                                    this.tweens.add({
                                        targets: [leaf_char, leaf_skill_text],
                                        x: {
                                            from: leaf_char.x,
                                            to: next_btn.x
                                        },
                                        alpha: {
                                            from: 1,
                                            to: 0
                                        },
                                        duration: 175,
                                        ease: 'Power2'
                                    });
                                    this.tweens.add({
                                        targets: [farmer_char, farmer_skill_text],
                                        x: {
                                            from: prev_btn.x,
                                            to: this.viewport.center.x
                                        },
                                        alpha: {
                                            from: 0,
                                            to: 1
                                        },
                                        duration: 175,
                                        ease: 'Power2'
                                    });
                                    break;
                                case 3:
                                    selection_now = 2;
                                    this.tweens.add({
                                        targets: [gardener_char, gardener_skill_text],
                                        x: {
                                            from: gardener_char.x,
                                            to: next_btn.x
                                        },
                                        alpha: {
                                            from: 1,
                                            to: 0
                                        },
                                        duration: 175,
                                        ease: 'Power2'
                                    });
                                    this.tweens.add({
                                        targets: [leaf_char, leaf_skill_text],
                                        x: {
                                            from: prev_btn.x,
                                            to: this.viewport.center.x
                                        },
                                        alpha: {
                                            from: 0,
                                            to: 1
                                        },
                                        duration: 175,
                                        ease: 'Power2'
                                    });
                                    break;
                                case 4:
                                    selection_now = 3;
                                    this.tweens.add({
                                        targets: [woodworker_char, woodworker_skill_text],
                                        x: {
                                            from: woodworker_char.x,
                                            to: next_btn.x
                                        },
                                        alpha: {
                                            from: 1,
                                            to: 0
                                        },
                                        duration: 175,
                                        ease: 'Power2'
                                    });
                                    this.tweens.add({
                                        targets: [gardener_char, gardener_skill_text],
                                        x: {
                                            from: prev_btn.x,
                                            to: this.viewport.center.x
                                        },
                                        alpha: {
                                            from: 0,
                                            to: 1
                                        },
                                        duration: 175,
                                        ease: 'Power2'
                                    });
                                    break;
                            }
                        }
                    })
                }
            });
        });
    }

}
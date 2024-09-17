import * as Phaser from "phaser"
import { _ } from "Assets/_"
import { Balls, BallColors, BALLKEY } from "../gameobjects/Balls"
import { ProgressBar } from "phaser3-plugin-ui-progressbar"
import { SkillComboFeverHandler } from "../classes/SkillComboFeverHandler"
import { GameVFX } from "../classes/GameVFX"

export class GameScene extends Phaser.Scene {

    FeverBallArray!: Array<Balls>
    BallArray!: Array<Balls>
    BallGroup!: Phaser.GameObjects.Group
    BonusBall!: Array<Balls>
    BallSize = 36
    BallRadius = 33   
    BallFindingThreshold = 30
    BackgroundGameplay!: Phaser.GameObjects.Image
    PauseButton!: Phaser.GameObjects.Image
    ExplodeSound!: Phaser.Sound.BaseSound
    tapSeed = 0
    Score = 0
    ScoreText!: Phaser.GameObjects.Text
    ScoreNumberText!: Phaser.GameObjects.Text
    ComboText!: Phaser.GameObjects.Text
    ComboCount = 0
    isComboing = false
    canCombo = false
    ComboEffect!: GameVFX
    ScoreEvent!: Phaser.Time.TimerEvent
    PlayTime = 60000
    GameTimer!: Phaser.Time.TimerEvent
    TimerText!: Phaser.GameObjects.Text
    FeverText!: Phaser.GameObjects.Text
    MaxFeverBar = 100
    FeverBarValue = 0
    FeverDuration = 5000
    FeverScoreMultplier = 3
    FeverBar!: Phaser.GameObjects.Graphics
    FeverBarOutline!: Phaser.GameObjects.Image
    isFever = false
    FeverEffect = false
    FeverAnim!: Phaser.Tweens.Tween
    quarterRight = 0
    SkillComboFeverHandler!: SkillComboFeverHandler
    SkillMaxValue = 50
    PlayerSkillButton!: Phaser.GameObjects.Image
    PlayerSkillProgressBar!: ProgressBar
    PLayerSkillValue = 0
    IsPlayerSkillActive = false
    IsPlayerBrown = false
    IsPlayerRed = false
    IsPlayerGreen = false
    IsPlayerYellow = false
    TimerBG!: Phaser.GameObjects.Image
    ComboBG!: Phaser.GameObjects.Image

    constructor(){
        super(_.Scene.GAME_SCENE);
    }

    init(skillactive: {
        yellowskill: boolean,
        greenskill: boolean,
        redskill: boolean,
        brownskill: boolean
    }){
        this.IsPlayerBrown = false;
        this.IsPlayerRed = false;
        this.IsPlayerYellow = false;
        this.IsPlayerGreen = false;
        this.IsPlayerBrown = false;
        this.isFever = false;
        this.PLayerSkillValue = 0;
        this.FeverBarValue = 0,
        this.Score = 0;

        this.IsPlayerBrown = skillactive.brownskill;
        this.IsPlayerRed = skillactive.redskill;
        this.IsPlayerYellow = skillactive.yellowskill;
        this.IsPlayerGreen = skillactive.greenskill;

        this.PlayTime = 60000;
    }

    create(){

        this.BackgroundGameplay = this.add.image(0, 0, _.Atlas.DEFAULT, _.Atlas.Frame.DEFAULT.BG_BARN_GAMEPLAY)
                                .setDepth(10)
                                .setOrigin(0);
        
        //Arena
        let arena_bound = this.cache.json.get(_.CustomPhysics.ARENA_BOUNDARY);
        this.add.image(
            this.viewport.center.x,
            this.viewport.center.y + 100,
            _.Atlas.DEFAULT,
            _.Atlas.Frame.DEFAULT.ARENA)
        .setDepth(1);
        let arenaPhysics = this.matter.add.fromPhysicsEditor(
            this.viewport.center.x,
            this.viewport.center.y + (this.viewport.center.y / 2.25),
            arena_bound.mainarena
        );
        arenaPhysics.isStatic = true;

        //Pause Button
        this.PauseButton = this.add.image(
            this.viewport.left + 15,
            this.viewport.top + 15,
            _.Atlas.DEFAULT,
            _.Atlas.Frame.DEFAULT.PAUSE_BTN)
            .setDepth(12)
            .setOrigin(0)
            .setScale(0.65)
            .setInteractive();

        //UI
        let scoreBG = this.add.image(
            this.viewport.right - 125,
            this.viewport.top + 75,
            _.Atlas.DEFAULT,
            _.Atlas.Frame.DEFAULT.SCORE_BG)
            .setOrigin(0.5)
            .setDepth(12);

        this.TimerBG = this.add.image(
            this.viewport.right - 75,
            275,
            _.Atlas.DEFAULT,
            _.Atlas.Frame.DEFAULT.SIDE_BG)
            .setDepth(12)
            .setOrigin(0.5)
            .setScale(0.85)
            .setFlipY(true);

        this.ComboBG = this.add.image(
            this.viewport.left + 75,
            275,
            _.Atlas.DEFAULT,
            _.Atlas.Frame.DEFAULT.SIDE_BG)
            .setDepth(12)
            .setOrigin(0.5)
            .setFlipX(true)
            .setFlipY(true)
            .setScale(0.85);

        //Skill Power-up
        let powerup_bg =  this.add.image(
            this.viewport.center.x,
            this.viewport.center.y + (this.viewport.center.y / 1.205),
            _.Atlas.DEFAULT,
            _.Atlas.Frame.DEFAULT.POWER_UP)
            .setDepth(11)
        ;

        this.ExplodeSound = this.sound.add(_.SFX.EXPLODE);
        let pause_sound = this.sound.add(_.SFX.PAUSE);

        this.matter.world.setBounds(this.viewport.left, this.viewport.top, this.viewport.right, this.viewport.bottom, 32);
        this.BallArray = [];
        this.BallGroup = this.add.group({
            defaultKey: BALLKEY.Key,
            maxSize: this.BallSize,
            createCallback: function(ball){
                ///@ts-ignore
                ball.setName("Ball " + this.getLength());
                console.log("Created : " + ball.name);
            },
            removeCallback: (ball) => {
                console.log("Removed : " + ball.name);
            }
        });

        let scoreStyle = {
            fontFamily: _.Font.GAME,
            fontSize: "36px",
        }

        this.quarterRight = this.viewport.right / 3;

        //Text UI
        this.ScoreText = this.add.text(
            scoreBG.x - 4,
            scoreBG.y - 10,
            "SCORE",
            scoreStyle)
            .setAlign("center")
            .setDepth(12)
            .setOrigin(0.5);
        this.ScoreNumberText = this.add.text(
            scoreBG.x - 4,
            scoreBG.y + 45,
            this.Score.toString(),
            scoreStyle)
            .setAlign("center")
            .setOrigin(0.5)
            .setDepth(12);
        this.FeverText = this.add.text(
            this.viewport.width / 2.35 + 7,
            this.viewport.top + 15,
            "FEVER",
            scoreStyle
            ).setAlign("center")
            .setDepth(12);
        this.FeverBarOutline = this.add.image(
            this.viewport.center.x - 3,
            this.viewport.top + 80,
            _.Atlas.DEFAULT,
            _.Atlas.Frame.DEFAULT.FEVER_OUTLINE)
            .setDepth(12);
        this.ComboText = this.add.text(
            this.ComboBG.x,
            this.ComboBG.y + 10,
            "COMBO!\n" + this.ComboCount,
            scoreStyle)
            .setAlign("center")
            .setOrigin(0.5)
            .setDepth(12);
        this.CreateTimer();
        this.ComboEffect = new GameVFX();
        this.ComboEffect.ComboEffectCreation(this);

        this.FeverBar = this.add.graphics();
        this.FeverBar.fillStyle(0xD69829);
        this.FeverBar.fillRect(0, 0, 0, 35);
        this.FeverBar.setPosition(
            this.FeverBarOutline.x - ((this.FeverBarOutline.width / 2) - 2),
            this.FeverBarOutline.y - (this.FeverBarOutline.height / 2) + 4);
        this.FeverBar.setDepth(11);

        this.SkillComboFeverHandler = new SkillComboFeverHandler();

        if(this.IsPlayerRed){
            this.PlayerSkillProgressBar = this.add.progressBar(
                powerup_bg.x,
                powerup_bg.y,
                144,
                144,
                _.Atlas.DEFAULT,
                _.Atlas.Frame.DEFAULT.RED_SKILL,{
                    orientation: ProgressBar.Orientation.VERTICAL,
                    top: 0,
                    bottom: 144,
                    left: 0,
                    right: 0
                }
            ).setDepth(14);

            this.add.image(
                powerup_bg.x,
                powerup_bg.y,
                _.Atlas.DEFAULT,
                _.Atlas.Frame.DEFAULT.RED_SKILL)
                .setDepth(13)
                .setScale(1.1)
                .setAlpha(0.3);
    
            this.PlayerSkillButton = this.add.image(
                powerup_bg.x,
                powerup_bg.y,
                _.Atlas.DEFAULT,
                _.Atlas.Frame.DEFAULT.RED_SKILL);
            this.PlayerSkillButton.setDepth(15);
            this.PlayerSkillButton.setInteractive();
            this.PlayerSkillButton.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
                this.SkillComboFeverHandler.RedSkillActivate(this);
            });
            this.PlayerSkillButton.alpha = 0;
        }

        else if(this.IsPlayerGreen){
            this.PlayerSkillProgressBar = this.add.progressBar(
                powerup_bg.x,
                powerup_bg.y,
                144,
                144,
                _.Atlas.DEFAULT,
                _.Atlas.Frame.DEFAULT.GREEN_SKILL,{
                    orientation: ProgressBar.Orientation.VERTICAL,
                    top: 0,
                    bottom: 144,
                    left: 0,
                    right: 0
                }
            ).setDepth(14);

            this.add.image(
                powerup_bg.x,
                powerup_bg.y,
                _.Atlas.DEFAULT,
                _.Atlas.Frame.DEFAULT.GREEN_SKILL)
                .setDepth(13)
                .setScale(1.1)
                .setAlpha(0.3);

            this.PlayerSkillButton = this.add.image(
                powerup_bg.x,
                powerup_bg.y,
                _.Atlas.DEFAULT,
                _.Atlas.Frame.DEFAULT.GREEN_SKILL);
            this.PlayerSkillButton.setDepth(15);
            this.PlayerSkillButton.setInteractive();
            this.PlayerSkillButton.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
                this.SkillComboFeverHandler.GreenSkillActivate(this);
            });
            this.PlayerSkillButton.alpha = 0;
        }

        else if(this.IsPlayerBrown){
            this.PlayerSkillProgressBar = this.add.progressBar(
                powerup_bg.x,
                powerup_bg.y,
                144,
                144,
                _.Atlas.DEFAULT,
                _.Atlas.Frame.DEFAULT.BROWN_SKILL,{
                    orientation: ProgressBar.Orientation.VERTICAL,
                    top: 0,
                    bottom: 144,
                    left: 0,
                    right: 0
                }
            ).setDepth(14);

            this.add.image(
                powerup_bg.x,
                powerup_bg.y,
                _.Atlas.DEFAULT,
                _.Atlas.Frame.DEFAULT.BROWN_SKILL)
                .setDepth(13)
                .setScale(1.1)
                .setAlpha(0.3);

            this.PlayerSkillButton = this.add.image(
                powerup_bg.x,
                powerup_bg.y,
                _.Atlas.DEFAULT,
                _.Atlas.Frame.DEFAULT.BROWN_SKILL);
            this.PlayerSkillButton.setDepth(15);
            this.PlayerSkillButton.setInteractive();
            this.PlayerSkillButton.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
                this.SkillComboFeverHandler.BrownSkillActivate(this);
            });
            this.PlayerSkillButton.alpha = 0;
        }

        else if(this.IsPlayerYellow){
            this.PlayerSkillProgressBar = this.add.progressBar(
                powerup_bg.x,
                powerup_bg.y,
                144,
                144,
                _.Atlas.DEFAULT,
                _.Atlas.Frame.DEFAULT.YELLOW_SKILL,{
                    orientation: ProgressBar.Orientation.VERTICAL,
                    top: 0,
                    bottom: 144,
                    left: 0,
                    right: 0
                }
            ).setDepth(14);

            this.add.image(
                powerup_bg.x,
                powerup_bg.y,
                _.Atlas.DEFAULT,
                _.Atlas.Frame.DEFAULT.YELLOW_SKILL)
                .setDepth(13)
                .setScale(1.1)
                .setAlpha(0.3);

            this.PlayerSkillButton = this.add.image(
                powerup_bg.x,
                powerup_bg.y,
                _.Atlas.DEFAULT,
                _.Atlas.Frame.DEFAULT.YELLOW_SKILL);
            this.PlayerSkillButton.setDepth(15);
            this.PlayerSkillButton.setInteractive();
            this.PlayerSkillButton.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
                this.SkillComboFeverHandler.YellowSkillActivate(this);
            });
            this.PlayerSkillButton.alpha = 0;
        }

        this.FeverBallArray = [];

        this.PauseButton.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {            
            this.scene.launch(_.Scene.PAUSE_POPUP);
            pause_sound.play();
            this.scene.pause();
        });

        this.input.keyboard.on("keydown-J", () => {
            this.scene.launch(_.Scene.RETRY_POPUP, {score: this.Score as number});
            this.scene.pause();
        });

        this.ScoreEvent = this.time.addEvent({
            delay: 1000,
            callbackScope: this,
            callback: () => this.SkillComboFeverHandler.ResetComboBack(this),
            loop: true
        });

        let screen_transition = this.add.graphics();
        screen_transition.fillStyle(0x000000);
        screen_transition.fillCircle(0, 0, 102);
        screen_transition.setScale(20);
        screen_transition.setDepth(21);

        this.tweens.add({
            targets: screen_transition,
            scaleX: {
                from: 20,
                to: 0
            },
            scaleY: {
                from: 20,
                to: 0
            },
            duration: 750,
            ease: 'Power2',
            onComplete: () => {
                screen_transition.clear();
            }
        });
        
        let overlay = this.add.graphics();
        overlay.fillStyle(0x000000);
        overlay.fillCircle(0, 0, 102);
        overlay.setScale(20);
        overlay.setDepth(19);
        overlay.setAlpha(0.4);

        let timerStart = 3;
        let timerStyle = {
            fontFamily: _.Font.GAME,
            fontSize: "50px",
        }

        let textStartTimer = this.add.text(
            this.viewport.center.x,
            this.viewport.center.y,
            timerStart.toString(),
            timerStyle)
        .setAlpha(0)
        .setOrigin(0.5)
        .setAlign('center')
        .setDepth(20);

        this.tweens.add({
            targets: textStartTimer,
            duration: 800,
            loop: 3,
            yoyo: false,
            ease: 'Power1',
            scaleX: {
                from: 3,
                to: 1,
            },
            scaleY: {
                from: 3,
                to: 1
            },
            alpha: {
                from: 1,
                to: 0
            },
            onLoop: () => {
                timerStart--;
                if(timerStart <= 0){
                    textStartTimer.setText("GO!");
                }
                else{
                    textStartTimer.text = timerStart.toString();
                };                
            },
            onComplete: () => {
                this.tweens.add({
                    targets: overlay,
                    duration: 250,
                    ease: "Linear",
                    alpha: "-=1",
                    onStart: () => {
                        this.CreateBall();
                        this.CreateGameTimer();
                    }
                });
            }
        });

    }

    update(time: number, delta: number){

        if(!this.isFever){
            this.UpdateBar();
        }

        if(this.isComboing && this.ComboCount >= 2){
            this.ComboText.text = "COMBO!\n" + "x" + this.ComboCount;
        }else{
            this.ComboText.text = "";
        }

        this.UpdateSkillBar();

        this.BallGroup.preUpdate(time, delta);
        this.ScoreNumberText.setText(this.Score.toString());
    }

    CreateBall(){

        for(let i = 0; i < this.BallGroup.maxSize; i++){
            let balls = new Balls(this, Phaser.Math.Between(this.viewport.left, this.viewport.right),
            this.viewport.top);
        }

        this.time.addEvent({
            delay: 100,
            loop: true,
            callback: () => this.AddBall()
        });

    }

    CreateGameTimer(){
        this.GameTimer = this.time.addEvent({
            delay: 1000,
            callback: () => this.TimerCallback(),
            loop: true
        });
    }

    CreateTimer(){
        let scoreStyle = {
            fontFamily: _.Font.GAME,
            fontSize: "36px",
        }

        this.TimerText = this.add.text(
            this.TimerBG.x,
            this.TimerBG.y + 7,
            "00:00",
            scoreStyle
        );
        this.TimerText.setOrigin(0.5);
        this.TimerText.setAlign("center");
        this.TimerText.setDepth(12);
    }

    AddBall(){
        let ball = this.BallGroup.get(Phaser.Math.Between(this.viewport.left, this.viewport.right),
        this.viewport.top) as Balls;

        if(!ball) return; 
        ball.ActivateBall();
    }

    TimerCallback(){
        this.PlayTime -= 1000;

        if(this.PlayTime <= 0){
            this.GameTimer.remove();
            this.scene.launch(_.Scene.RETRY_POPUP, {score: this.Score as number});
        }

        if(this.PlayTime / 1000 >= 10){
            this.TimerText.text = "00" + ":" + (this.PlayTime / 1000);
        }else if(this.PlayTime / 1000 < 10){
            this.TimerText.text = "00" + ":0" + (this.PlayTime / 1000);
        }else{
            this.TimerText.text = "00" + ":" + (this.PlayTime / 1000);
        }
    }

    UpdateBar(){
        if(this.FeverBarValue >= this.MaxFeverBar){
            this.isFever = true;
            this.FeverBarValue = this.MaxFeverBar;
            this.SkillComboFeverHandler.ActivateFever(this);
        }
        this.FeverBar.fillRect(0, 0, (this.FeverBarValue / this.MaxFeverBar) * 200, 35);
    }

    UpdateSkillBar(){
        let valbar = (this.PLayerSkillValue / this.SkillMaxValue) * 144;
        this.PlayerSkillProgressBar.setValue((valbar / 144) * 100);
    }
}
import * as Phaser from "phaser"
import { GameScene } from "../scenes/GameScene"
import {Score} from "../classes/Score"
import { _ } from "Assets/_"
import { BallFinding } from "../classes/BallFinding"
import { BallVFX } from "../classes/BallVFX"
import { ResetBall } from "../classes/ResetBall"
import { SkillComboFeverHandler } from "../classes/SkillComboFeverHandler"
import { GameVFX } from "../classes/GameVFX"

export enum BallColors {
    RED = 0xf54242,
    BROWN = 0x654321,
    YELLOW = 0xf5ef42,
    GREEN = 0x60f542
}

export enum BALLKEY {
    Key = "ball",
}

export class Balls extends Phaser.Physics.Matter.Sprite{
    
    BallColor!: BallColors
    Radius = 33
    FindingThreshold = (this.Radius / 2) + 10
    GrowthBonus = 1
    BallValue = 1
    BallTextValue!: Phaser.GameObjects.Text
    scene!: GameScene
    ChainBallArray!: Array<Balls>
    CollapseEffect!: Phaser.Tweens.Tween
    ScaleBallEffect!: Phaser.Tweens.Tween
    ScoreCal!: Score
    BallFinder!: BallFinding
    BallEffect!: BallVFX
    GameEffect!: GameVFX
    BallReset!: ResetBall
    SkillComboFeverHandler!: SkillComboFeverHandler
    EffectDuration = 500
    IsBeingClicked = false
    IsBeingPopped = false

    constructor(scene: GameScene, x: integer, y: integer){
        
        super(scene.matter.world, x, y, _.Atlas.DEFAULT, _.Atlas.Frame.DEFAULT.BROWN_BALL);
        scene.add.existing(this);
        this.scene = scene;
        this.scene.BallGroup.add(this);

        this.ScoreCal = new Score();
        this.BallFinder = new BallFinding();
        this.BallEffect = new BallVFX();
        this.GameEffect = new GameVFX();
        this.BallReset = new ResetBall();
        this.SkillComboFeverHandler = new SkillComboFeverHandler();

        this.setCircle(this.Radius);
        this.setFriction(0.9);
        this.setBounce(0.15);
        this.setInteractive();
        this.setDepth(2);
        this.IsBeingPopped = false;

        this.BallReset.RandomizeBallColor(this);
        this.BallEffect.ScaleBall(this, 200);

        this.ChainBallArray = [];

        let textStyle = {
            fontFamily: _.Font.BALL_FONT,
            fontSize: "30px",
        }

        this.BallTextValue = this.scene.add.text(this.x, this.y, this.BallValue.toString(), textStyle);
        this.BallTextValue.setOrigin(0.5);
        this.BallTextValue.setDepth(3);
        this.BallTextValue.setColor("0xffffff");

        this.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
            this.IsBeingClicked = true;
            this.IsBeingPopped = true;
            this.disableInteractive();
            this.setDepth(5);
            this.BallTextValue.setDepth(6);
            this.BallFinder.PushFirstBallToArray(this);
            this.BallFinder.FindNeighbourAndAddToArray(scene, this);
            this.ProperHideChain();
        });
    }

    preUpdate(){
        this.BallTextValue.setPosition(this.x, this.y);
    }

    FindScaleFactor(value: number){
        let finalVal = 0;
        for(let i = 1; i < value; i++){
            finalVal += 0.075;
        }

        if(finalVal >= 0.675){
            finalVal = 0.675;
        }
        return finalVal;
    }

    ActivateBall(){
        this.BallReset.ActivateBall(this);
    }

    HideChain(){

        this.scene.tapSeed = this.scene.BallArray.length;

        for(let i = 1; i < this.scene.BallArray.length; i++){
            this.BallValue += this.scene.BallArray[i].BallValue;
            this.BallTextValue.setText(this.BallValue.toString());
            this.BallEffect.GoToParentBallEffect(this, this.scene.BallArray[i]);
        }

        let bonus = this.ScoreCal.GetBonusGrowth(this.scene.tapSeed);

        this.BallValue += bonus;
        this.BallTextValue.text = this.BallValue.toString();
        this.BallEffect.ParentScale(this);
        // this.BallEffect.ScaleBall(this);

        if(this.BallValue >= 5){
            if(this.scene.isFever == false && this.scene.FeverBarValue <= this.scene.MaxFeverBar){
                this.scene.FeverBarValue += this.BallValue;
            }
            this.BallTextValue.text = this.BallValue.toString();
            this.BallTextValue.setDepth(6);
            this.SkillComboFeverHandler.AddSkillMatchingBallColor(this);
            // this.BallFinder.AddBonusToNeighbour(this);
            this.BallEffect.ExplodeClicked(this);
            this.ScoreCal.AddScoreToGame(this, true);
            this.SkillComboFeverHandler.ComboTimerReset(this);
        }
        else{
            this.setInteractive();
            this.IsBeingClicked = false;
        }

        this.scene.BallArray = [];
    }

    ProperHideChain(){

        this.scene.tapSeed = this.scene.BallArray.length;
        // this.ScaleBallEffect.pause();

        for(let i = 1; i < this.scene.BallArray.length; i++){
            this.BallEffect.GoDownFirstBeforeGoToParent(this, this.scene.BallArray[i], i, this.scene.BallArray.length);
            this.BallValue += this.scene.BallArray[i].BallValue;
            this.BallTextValue.text = this.BallValue.toString();
        }

        let bonus = this.ScoreCal.GetBonusGrowth(this.scene.tapSeed);
        this.BallValue += bonus;
        // this.BallEffect.ParentScale(this);
        this.BallTextValue.text = this.BallValue.toString();

        if(this.BallValue < 5){
            this.setInteractive();
            // this.BallEffect.ScaleBall(this, 200);
            this.IsBeingClicked = false;
            this.scene.BallArray = [];
        }else{
            this.BallExplodeFunction(this);
        }
    }

    BallExplodeFunction(ball: Balls){
        if(!ball.scene.isFever && ball.scene.FeverBarValue <= ball.scene.MaxFeverBar){
            // this.scene.FeverBarValue += this.BallValue;
            ball.GameEffect.ValueTweening(ball.scene, ball.scene.FeverBarValue, ball.BallValue, false);
        }
        ball.BallTextValue.text = ball.BallValue.toString();
        ball.setDepth(15);
        ball.BallTextValue.setDepth(16);

        ball.SkillComboFeverHandler.AddSkillMatchingBallColor(ball);
        ball.BallFinder.AddBonusToNeighbour(ball);
        // ball.BallEffect.ParentExplode(ball, ball.scene.BallArray.length);
        ball.ScoreCal.AddScoreToGame(ball, true);
        ball.SkillComboFeverHandler.ComboTimerReset(ball);
        
        ball.scene.BallArray = [];
    }

}
import { Balls, BallColors } from "../gameobjects/Balls"
import { GameScene } from "../scenes/GameScene"
import { GameVFX } from "./GameVFX";

export class SkillComboFeverHandler {

    ComboTimerReset(ball: Balls){        
        ball.scene.isComboing = true;
        ball.scene.ScoreEvent.reset({
                delay: 1000,
                callback: () => this.ResetComboBack(ball.scene),
                loop: true,
        });

        if(ball.scene.isComboing){
            ball.scene.ComboCount++;
        }
    }

    ResetComboBack(scene: GameScene){        
        scene.isComboing = false;
        scene.ComboCount = 0;
    }

    AddSkillMatchingBallColor(ball: Balls){

        let ValueTweening = new GameVFX();

        if(ball.BallColor == 0 && ball.scene.IsPlayerRed){
            // ball.scene.PLayerSkillValue += ball.BallValue;
            ValueTweening.ValueTweening(ball.scene, ball.scene.PLayerSkillValue, ball.BallValue, true);
            if(ball.scene.PLayerSkillValue >= ball.scene.SkillMaxValue){
                ball.scene.PLayerSkillValue = ball.scene.SkillMaxValue;
                ball.scene.IsPlayerSkillActive = true;
                ball.scene.PlayerSkillButton.alpha = 1;
            }
        }
        else if(ball.BallColor == 1 && ball.scene.IsPlayerBrown){
            // ball.scene.PLayerSkillValue += ball.BallValue;
            ValueTweening.ValueTweening(ball.scene, ball.scene.PLayerSkillValue, ball.BallValue, true);
            if(ball.scene.PLayerSkillValue >= ball.scene.SkillMaxValue){
                ball.scene.PLayerSkillValue = ball.scene.SkillMaxValue;
                ball.scene.PlayerSkillButton.alpha = 1;
                ball.scene.IsPlayerSkillActive = true;
            }
        }
        else if(ball.BallColor == 3 && ball.scene.IsPlayerGreen){
            // ball.scene.PLayerSkillValue += ball.BallValue;
            ValueTweening.ValueTweening(ball.scene, ball.scene.PLayerSkillValue, ball.BallValue, true);
            if(ball.scene.PLayerSkillValue >= ball.scene.SkillMaxValue){
                ball.scene.PLayerSkillValue = ball.scene.SkillMaxValue;
                ball.scene.PlayerSkillButton.alpha = 1;
                ball.scene.IsPlayerSkillActive = true;
            }
        }
        else if(ball.BallColor == 2 && ball.scene.IsPlayerYellow){
            // ball.scene.PLayerSkillValue += ball.BallValue;
            ValueTweening.ValueTweening(ball.scene, ball.scene.PLayerSkillValue, ball.BallValue, true);
            if(ball.scene.PLayerSkillValue >= ball.scene.SkillMaxValue){
                ball.scene.PLayerSkillValue = ball.scene.SkillMaxValue;
                ball.scene.PlayerSkillButton.alpha = 1;
                ball.scene.IsPlayerSkillActive = true;
            }
        }
    }

    ActivateFever(scene: GameScene){
        console.log("fever active");
        let AllBall = scene.BallGroup.getChildren();

        for(let i = 0; i < scene.BallGroup.countActive(true); i++){
            let ballnow = AllBall[i] as Balls;

            if(ballnow.IsBeingClicked == true){
                continue;
            }

            if(ballnow.IsBeingPopped){
                continue;
            }else {
                ballnow.BallTextValue.text = ballnow.BallValue.toString();
                ballnow.BallValue += 1;
                ballnow.BallEffect.ScaleBall(ballnow, 200);
                ballnow.scene.FeverBallArray.push(ballnow);
            }

            if(ballnow.BallValue >= 5 && !ballnow.IsBeingPopped){
                ballnow.IsBeingPopped = true;
                ballnow.ScoreCal.AddScoreToGame(ballnow, false);
                ballnow.BallEffect.ExplodeClicked(ballnow);
                ballnow.scene.FeverBallArray.splice(i, 1);
            }
        }
        scene.FeverAnim = scene.tweens.add({
            targets: scene.FeverBar,
            duration: scene.FeverDuration,
            ease: "Linear",
            callbackScope: this,
            yoyo: false,
            loop: 0,
            scaleX: 0,
            onComplete: () => {
                console.log("fever done");
                this.FeverFinish(scene);
            }
        });
    }

    FeverFinish(scene: GameScene){
        let AllBalls = scene.BallGroup.getChildren();
        for(let i = 0; i >= scene.FeverBallArray.length; i++){
            let ballFeverOver = AllBalls[i] as Balls;

            ballFeverOver.BallValue -= 1;
            ballFeverOver.BallTextValue.text = ballFeverOver.BallValue.toString();
            ballFeverOver.BallEffect.ScaleBall(ballFeverOver, 200);
            console.log(i);
        }
        scene.FeverBallArray = [];
        scene.isFever = false;
        scene.FeverBarValue = 0;
        scene.FeverBar.setScale(1, 1);
        scene.FeverBar.clear();
        scene.FeverBar.fillStyle(0xD69829);
    }

    RedSkillActivate(scene: GameScene){
        if(scene.IsPlayerSkillActive){
            scene.PlayerSkillButton.active = false;
            scene.PlayerSkillButton.alpha = 0;
            scene.PLayerSkillValue = 0;
            scene.IsPlayerSkillActive = false;
            let AllBalls = scene.BallGroup.getChildren();

            for(let i = 0; i < scene.BallGroup.countActive(true); i++){
                let BallNow = AllBalls[i] as Balls;

                if(BallNow.BallColor == 0){

                    BallNow.BallValue += 2;
                    BallNow.BallTextValue.text = BallNow.BallValue.toString();
                    BallNow.BallEffect.ScaleBall(BallNow, 200);

                    if(BallNow.BallValue >= 5){
                        BallNow.ScoreCal.AddScoreToGame(BallNow, false);
                        BallNow.SkillComboFeverHandler.ComboTimerReset(BallNow);
                        BallNow.BallEffect.ExplodeClicked(BallNow);                        
                    }
                }
            }
        }
    }

    BrownSkillActivate(scene: GameScene){

        if(scene.IsPlayerSkillActive){
            scene.PlayerSkillButton.active = false;
            scene.PlayerSkillButton.alpha = 0;
            scene.PLayerSkillValue = 0;
            scene.IsPlayerSkillActive = false;

            let AllBalls = scene.BallGroup.getChildren();

            for(let i = 0; i < scene.BallGroup.countActive(true); i++){
                let BallNow = AllBalls[i] as Balls;

                if(BallNow.BallValue > 2){
                    BallNow.ScoreCal.AddScoreToGame(BallNow, false);
                    BallNow.SkillComboFeverHandler.ComboTimerReset(BallNow);
                    BallNow.BallEffect.ExplodeClicked(BallNow);  
                }
            }
        }
    }

    YellowSkillActivate(scene: GameScene){
        if(scene.IsPlayerSkillActive){
            scene.PlayerSkillButton.active = false;
            scene.PlayerSkillButton.alpha = 0;
            scene.PLayerSkillValue = 0;
            scene.IsPlayerSkillActive = false;

            let AllBalls = scene.BallGroup.getChildren();

            for(let i = 0; i < scene.BallGroup.countActive(true); i++){
                let BallNow = AllBalls[i] as Balls;

                if(BallNow.BallValue == 1){
                    BallNow.BallValue += 3;
                    BallNow.BallTextValue.text = BallNow.BallValue.toString();
                    BallNow.BallEffect.ScaleBall(BallNow, 200);
                }
            }
        }

    }

    GreenSkillActivate(scene: GameScene){

        if(scene.IsPlayerSkillActive){
            scene.PlayerSkillButton.active = false;
            scene.PlayerSkillButton.alpha = 0;
            scene.PLayerSkillValue = 0;
            scene.IsPlayerSkillActive = false;

            let AllBalls = scene.BallGroup.getChildren();
            let finalScore = 0;

            for(let i = 0; i < scene.BallGroup.countActive(true); i++){
                let BallNow = AllBalls[i] as Balls;

                if(BallNow.BallColor == 3){
                    finalScore += BallNow.BallValue;

                    BallNow.setDepth(3);
                    BallNow.BallTextValue.setDepth(4); 
                    BallNow.SkillComboFeverHandler.ComboTimerReset(BallNow);
                    BallNow.BallEffect.ExplodeClicked(BallNow);
                }
            }
            finalScore *= 80;
            let ScoreEfffect = new GameVFX();
            ScoreEfffect.ScoreEffect(scene, finalScore);
        }

    }

}
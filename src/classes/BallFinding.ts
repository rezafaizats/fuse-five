import * as Phaser from "phaser"
import { Balls } from "../gameobjects/Balls"
import { GameScene } from "../scenes/GameScene"

export class BallFinding {

    PushFirstBallToArray(ball: Balls){
        ball.scene.BallArray.push(ball);
    }

    FindNeighbourAndAddToArray(scene: GameScene, ball: Balls){

        let AllBalls = scene.BallGroup.getChildren();
        let checkColor = false;

        for(let i = 0; i < scene.BallGroup.countActive(); i++){

            let BallNow = AllBalls[i] as Balls;

            let distance = Phaser.Math.Distance.Between(
                ball.x, ball.y,
                BallNow.x, BallNow.y
            );

            if(ball.x == BallNow.x){
                continue;
            }
            else if(distance < (scene.BallRadius * 2) + ball.FindingThreshold){
                checkColor = this.CheckBallColor(ball, BallNow);
                if(checkColor){
                    if(!scene.BallArray.includes(BallNow)){
                        scene.BallArray.push(BallNow);
                        BallNow.IsBeingPopped = true;
                        BallNow.BallFinder.FindNeighbourAndAddToArray(scene, BallNow);
                    }
                }
            }

        }
    }

    AddBonusToNeighbour(ClickedBall: Balls){

        let AllBalls = ClickedBall.scene.BallGroup.getChildren();
        let bonus = ClickedBall.ScoreCal.GetBonusForNeighbour(ClickedBall.BallValue);
        let counter = 1;

        for(let i = 0; i < ClickedBall.scene.BallGroup.countActive(true); i++){
            
            let BallNow = AllBalls[i] as Balls;

            let distance = Phaser.Math.Distance.Between(ClickedBall.x, ClickedBall.y,
                BallNow.x, BallNow.y);
            
            if(ClickedBall.x == BallNow.x || BallNow.BallColor == ClickedBall.BallColor){
                continue;
            }
            else if(distance < (ClickedBall.Radius * 2) + ClickedBall.FindingThreshold){

                BallNow.BallValue += bonus;
                BallNow.BallTextValue.text = BallNow.BallValue.toString();

                if(BallNow.BallValue >= 5){
                    // BallNow.scene.FeverBarValue += ClickedBall.BallValue;
                    BallNow.IsBeingPopped = true;
                    BallNow.GameEffect.ValueTweening(BallNow.scene, BallNow.scene.FeverBarValue, BallNow.BallValue, false);
                    BallNow.BallEffect.NeighbourHide(BallNow, counter);
                    BallNow.ScoreCal.AddScoreToGame(BallNow, false);
                    counter++;
                    // BallNow.BallValue = Phaser.Math.Between(1, 2);
                }else{
                    let scaleFactor = BallNow.FindScaleFactor(BallNow.BallValue);
                    scaleFactor += 1;
            
                    BallNow.scene.tweens.add({
                        targets: BallNow,
                        duration: 200,
                        ease: 'Linear',
                        yoyo: false,
                        loop: 0,
                        scaleX: scaleFactor,
                        scaleY: scaleFactor
                    });
                }
            }
        }
    }

    CheckBallColor(ball1: Balls, ball2: Balls){
        let isSame = false;
        if(ball1.BallColor == ball2.BallColor){
            isSame = true;
        }

        return isSame;
    }

}
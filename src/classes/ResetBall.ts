import * as Phaser from "phaser"
import { _ } from "Assets/_"
import { Balls } from "../gameobjects/Balls"
import { GameScene } from "../scenes/GameScene"
import { BallVFX } from "./BallVFX";

export class ResetBall{

    ActivateBall(ball: Balls){
        
        ball.BallValue = 1;
        ball.setScale(1);
        ball.setCircle(ball.Radius);

        ball.BallValue = Phaser.Math.Between(1, 2);
        ball.BallEffect.ScaleBall(ball, 200);

        ball.IsBeingClicked = false;
        ball.IsBeingPopped = false;
        ball.setActive(true);
        ball.setVisible(true);
        ball.setFriction(0.9);
        ball.setBounce(0.15);
        ball.setInteractive();
        ball.setDepth(2);
        
        this.RandomizeBallColor(ball);

        ball.BallTextValue.setActive(true);
        ball.BallTextValue.text = ball.BallValue.toString();
        ball.BallTextValue.setDepth(3);
        ball.BallTextValue.setPosition(ball.x, ball.y);

        ball.scene.matter.world.add(this);
    }

    RandomizeBallColor(ball: Balls){
        ball.BallColor = Phaser.Math.Between(0, 3);
        
        switch(ball.BallColor){
            case 0:
                ball.setTexture(_.Atlas.DEFAULT, _.Atlas.Frame.DEFAULT.RED_BALL);
                // this.tint = BallColors.RED; // Red
                break;
            case 1:
                ball.setTexture(_.Atlas.DEFAULT, _.Atlas.Frame.DEFAULT.BROWN_BALL);
                // this.tint = BallColors.BROWN; // Brown
                break;
            case 2:
                ball.setTexture(_.Atlas.DEFAULT, _.Atlas.Frame.DEFAULT.YELLOW_BALL);
                // this.tint = BallColors.YELLOW; // Yellow
                break;
            case 3:
                ball.setTexture(_.Atlas.DEFAULT, _.Atlas.Frame.DEFAULT.GREEN_BALL);
                // this.tint = BallColors.GREEN; // Green
                break;
            default:
                console.log("Balls not colored");
                break;
        }
    }

}
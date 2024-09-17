import * as Phaser from "phaser"
import { Balls } from "../gameobjects/Balls"
import { _ } from "Assets/_"

export class BallVFX{

    HideBall(ballToHide: Balls){
        if(ballToHide.scene.FeverBallArray.includes(ballToHide) && ballToHide.scene.isFever){
            let posInArray = ballToHide.scene.FeverBallArray.indexOf(ballToHide);
            ballToHide.scene.FeverBallArray.splice(posInArray, 1);
        }
        ballToHide.BallTextValue.text = "";
        ballToHide.scene.matter.world.remove(ballToHide);
        ballToHide.scene.BallGroup.killAndHide(ballToHide);
    }

    GoToParentBallEffect(parentBall: Balls, targetBall: Balls){
        let xPos = parentBall.x;
        let yPos = parentBall.y;

        targetBall.BallTextValue.text = "";
        targetBall.removeInteractive();
        targetBall.scene.matter.world.remove(targetBall);

        targetBall.CollapseEffect = targetBall.scene.tweens.add({
            targets: targetBall,
            delay: 500,
            duration: 500,
            ease: 'Linear',
            yoyo: false,
            loop: 0,
            x: xPos,
            y: yPos,
            callbackScope: targetBall,
            onStart: () => {
                parentBall.ScaleBallEffect.pause();
            },
            onComplete: function(){
                targetBall.BallEffect.HideBall(targetBall);
                parentBall.ScaleBallEffect.resume();
            }
        });
    }

    GoDownFirstBeforeGoToParent(parentBall: Balls, targetBall: Balls, iteration: number, length: number){
        targetBall.BallTextValue.text = "";
        targetBall.scene.matter.world.remove(targetBall);
        targetBall.setDepth(14);

        let XposToMid = "";
        if(targetBall.x >= parentBall.x){
            XposToMid = "-=35";
        }else{
            XposToMid = "+=35";
        }
        let YposToMid = targetBall.scene.PlayerSkillButton.y - 50;
        targetBall.scene.add.tween({
            targets: targetBall,
            props: {
                scaleX: {value: 0.6, duration: 500, ease: "Power1"},
                scaleY: {value: 0.6, duration: 500, ease: "Power1"},
                x: {value: XposToMid, duration: 500, ease: "Power1"},
                y: {value: YposToMid, duration: 450, ease: "Power3"}
            },
            yoyo: false,
            repeat: 0,
            onComplete: () => {
                this.GoToParentBallDelayed(parentBall, targetBall, iteration, length);
            }
        });
    }

    GoToParentBallDelayed(parentBall: Balls, targetBall: Balls, iteration: number, length: number){
        let xPos = parentBall.x;
        let yPos = parentBall.y;

        let final = false;
        if(iteration + 1 >= length){
            final = true;
        }else{
            final = false;
        }
        iteration--;

        targetBall.CollapseEffect = targetBall.scene.tweens.add({
            targets: targetBall,
            props: {
                x: {value: xPos, duration: 450, ease: 'Power1', delay: (iteration * 50) + 125},
                y: {value: yPos,
                    duration: 500,
                    ease: 'Power3',
                    repeat: 0,
                    yoyo: false,
                    delay: (iteration * 50) + 125
                },
            },
            callbackScope: targetBall,
            onStart: () => {
                parentBall.BallEffect.ScaleBall(parentBall, 250);
            },
            onComplete: () => {
                if(final && parentBall.BallValue >= 5){
                    parentBall.BallEffect.ParentExplode(parentBall, 0);
                }else if(parentBall.BallValue < 5){
                    parentBall.setDepth(2);
                }
                targetBall.BallEffect.HideBall(targetBall);
            }
        });
    }

    ParentScale(ball: Balls){
        ball.BallTextValue.text = ball.BallValue.toString();

        let scaleFactor = ball.FindScaleFactor(ball.BallValue);
        scaleFactor += 1;

        ball.ScaleBallEffect = ball.scene.tweens.add({
            targets: ball,
            duration: 1250,
            ease: 'Linear',
            yoyo: false,
            loop: 0,
            scaleX: scaleFactor,
            scaleY: scaleFactor
        });

    }

    ParentExplode(ball: Balls, length: number){
        ball.removeInteractive();

        let scaleFactor = ball.FindScaleFactor(ball.BallValue);
        scaleFactor += 1;
        
        ball.ScaleBallEffect = ball.scene.tweens.add({
            targets: ball,
            duration: 150 + (length * 75),
            ease: 'Linear',
            yoyo: false,
            loop: 0,
            scaleX: scaleFactor,
            scaleY: scaleFactor,
            onComplete: () => {
                ball.scene.ExplodeSound.play();
                // let particles = ball.scene.add.particles(_.Atlas.DEFAULT)
                // particles.createEmitter(
                //     {
                //         frame: [_.Atlas.Frame.DEFAULT.PARTICLE_DARK, _.Atlas.Frame.DEFAULT.PARTICLE_LIGHT],
                //         x: ball.x,
                //         y: ball.y,
                //         angle: { min: 180, max: 360},
                //         speed: 150,
                //         lifespan: 450,
                //         scale: {min: 0.3, max: 0.7},
                //         maxParticles: 20,
                //         gravityY: -150
                //     }
                // );
                this.HideBall(ball);
            }
        });
    }

    ExplodeClicked(ball: Balls){
        ball.setDepth(3);
        ball.BallTextValue.setDepth(4);
        ball.BallTextValue.text = ball.BallValue.toString();

        let scaleFactor = ball.FindScaleFactor(ball.BallValue);
        scaleFactor += 1;

        this.ScaleAndExplode(ball, scaleFactor, ball.EffectDuration);
    }
    
    NeighbourHide(ball: Balls, waitToHide: number){

        ball.setDepth(3);
        ball.BallTextValue.setDepth(4);

        let scaleFactor = ball.FindScaleFactor(ball.BallValue);
        scaleFactor += 1;

        waitToHide++;
        waitToHide *= (10 + 300);

        this.ScaleAndExplode(ball, scaleFactor, waitToHide);
    }
    
    ScaleBall(ball: Balls, duration: number){
        let scaleFactor = ball.FindScaleFactor(ball.BallValue);
        scaleFactor += 1;

        ball.scene.tweens.add({
            targets: ball,
            duration: duration,
            ease: 'Bounce.easeOut',
            yoyo: false,
            loop: 0,
            scaleX: scaleFactor,
            scaleY: scaleFactor,
            onStart: () => {
                ball.BallTextValue.text = ball.BallValue.toString();
            }
        });
    }

    ScaleAndExplode(ball: Balls, scaleFactor: number, delayDuration: number){
        ball.removeInteractive();
        
        ball.scene.tweens.add({
            targets: ball,
            delay: delayDuration,
            duration: 450,
            ease: 'BOunce.easeOut',
            yoyo: false,
            loop: 0,
            scaleX: scaleFactor,
            scaleY: scaleFactor,
            callbackScope: ball,
            onComplete: () => {
                ball.scene.ExplodeSound.play();
                // ball.scene.add.particles(_.Atlas.DEFAULT, [
                //     {
                //         frame: _.Atlas.Frame.DEFAULT.PARTICLE_DARK,
                //         x: ball.x,
                //         y: ball.y,
                //         angle: {min: 180, max: 360},
                //         speed: 150,
                //         gravity: -350,
                //         lifespan: 450,
                //         scale: {min: 0.3, max: 0.7},
                //         maxParticles: 10
                //     },
                //     {
                //         frame: _.Atlas.Frame.DEFAULT.PARTICLE_LIGHT,
                //         x: ball.x,
                //         y: ball.y,
                //         angle: {min: 180, max: 360},
                //         speed: 150,
                //         gravity: -350,
                //         lifespan: 450,
                //         scale: {min: 0.3, max: 0.7},
                //         maxParticles: 10
                //     }
                // ]).setDepth(20);
                this.HideBall(ball);
            }
        });

    }

    BallValueTweening(ball: Balls, AddedValue: number){
        ball.scene.tweens.addCounter({
            from: ball.BallValue,
            to: AddedValue,
            ease: 'Linear',
            loop: 0,
            yoyo: false,
            duration: 200,
            onUpdate: (tweens: Phaser.Tweens.Tween) => {
                ball.BallValue = Phaser.Math.RoundTo(tweens.getValue(), 0);
                ball.BallTextValue.text = ball.BallValue.toString();
            }
        });
    }

}
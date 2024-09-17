import * as Phaser from "phaser"
import { GameScene } from "../scenes/GameScene"

export class GameVFX {

    ScoreTextEffectTween!: Phaser.Tweens.Tween
    ScoreEffectDuration = 500
    ComboEffectTween!: Phaser.Tweens.Tween

    ValueTweening(GameScene: GameScene, ValueToTween: number, AddedValue: number, IsSkillValue: boolean){
        GameScene.tweens.addCounter({
            from: ValueToTween,
            to: ValueToTween + AddedValue,
            ease: "Power2",
            yoyo: false,
            loop: 0,
            duration: 500,
            onUpdate: (tween: Phaser.Tweens.Tween) => {
                if(IsSkillValue){
                    GameScene.PLayerSkillValue = Phaser.Math.RoundTo(tween.getValue(), 0);
                }else{
                    GameScene.FeverBarValue = Phaser.Math.RoundTo(tween.getValue(), 0);
                }
            }
        });
    }

    ScoreEffect(GameScene: GameScene, AddedValue: number){
        let finalScore = GameScene.Score + AddedValue;
        GameScene.tweens.addCounter({
            from: GameScene.Score,
            to: finalScore,
            ease: "Linear",
            yoyo: false,
            loop: 0,
            duration: this.ScoreEffectDuration,
            onUpdate: (tween: Phaser.Tweens.Tween) => {
                GameScene.Score = Phaser.Math.RoundTo(tween.getValue(), 0);
            }
        });
        this.ScoreTextEffectTween = GameScene.add.tween({
            targets: GameScene.ScoreNumberText,
            scaleX: 1.4,
            scaleY: 1.4,
            ease: "Power2",
            yoyo: false,
            loop: 0,
            duration: this.ScoreEffectDuration / 2,
            onComplete: () => {
                this.ResetScoreScale(GameScene);
            }
        });
    }

    ComboEffectCreation(GameScene: GameScene){
        this.ComboEffectTween = GameScene.add.tween({
            targets: GameScene.ComboText,
            scaleX: 1.2,
            scaleY: 1.2,
            ease: "Power2",
            yoyo: true,
            loop: -1,
            duration: this.ScoreEffectDuration / 2
        });
    }

    ResetScoreScale(GameScene: GameScene){
        this.ScoreTextEffectTween = GameScene.add.tween({
            targets: GameScene.ScoreNumberText,
            scaleX: 1,
            scaleY: 1,
            ease: "Power2",
            yoyo: false,
            loop: 0,
            duration: this.ScoreEffectDuration / 2
        });
    }

}
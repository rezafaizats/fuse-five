import { Stage } from "./Stage"
import { Balls } from "src/gameobjects/Balls";
import { GameVFX } from "./GameVFX";

export class Score{

    GameEffect!: GameVFX

    GetBonusGrowth(tapseed: number){
        if(tapseed < 2){
            return 0;
        }
        else if(tapseed == 2){
            return 1;
        }
        else if(tapseed == 3 || tapseed == 4){
            return 2;
        }
        else if(tapseed == 5 || tapseed == 6){
            return 3;
        }
        else if(tapseed == 7 || tapseed == 8 || tapseed == 9){
            return 4;
        }
        else{
            return 6;
        }
    }

    GetBonusGrowthRadius(totalseed: number){
        if(totalseed < 6){
            return 0;
        }
        else if(totalseed > 6 && totalseed <= 8){
            return 1;
        }
        else if(totalseed <= 10){
            return 2;
        }
        else if(totalseed <= 12){
            return 3;
        }
        else if(totalseed <= 14){
            return 4;
        }
        else{
            return 5;
        }
    }

    GetBonusForNeighbour(value: number){
        let valueFinal = value / 6;

        if(valueFinal <= 1){
            return 0;
        }else if(valueFinal > 1 && valueFinal < 1.5){
            return 1;
        }else if(valueFinal >= 1.5 && valueFinal < 1.8){
            return 2;
        }else if(valueFinal >= 1.8 && valueFinal < 2.1){
            return 3;
        }else if(valueFinal >= 2.1 && valueFinal < 2.5){
            return 4;
        }else{
            return 5;
        }
    }

    GetScoreCalculation(startval: number, comboNow: number){
        let stageCalulator = new Stage();
        let totalScore = startval;
        let stageCal = stageCalulator.CalculateStage(comboNow);
        let finalScore = totalScore * (100 + stageCal);
        return finalScore;
    }

    AddScoreToGame(ball: Balls, isNormal: boolean){
        // let scoreFinal = ball.ScoreCal.GetScoreCalculation(
        //     ball.BallValue,
        //     ball.scene.ComboCount);

        let scoreFinal = ball.BallValue * 100;
        this.GameEffect = new GameVFX();
        
        if(ball.scene.isFever){
            scoreFinal *= ball.scene.FeverScoreMultplier;
            // ball.ScoreEffect(ball);
            // ball.scene.Score += scoreFinal;
            this.GameEffect.ScoreEffect(ball.scene, scoreFinal);
        }else{
            // ball.ScoreEffect(ball);
            // ball.scene.Score += scoreFinal;
            console.log(ball.scene.Score.toString());
            this.GameEffect.ScoreEffect(ball.scene, scoreFinal);
        }

        if(isNormal){
            ball.scene.tapSeed = 0;
        }else{
            return;
        }

    }

}
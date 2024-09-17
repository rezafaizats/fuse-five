export enum StageEnum {
    Stage1 = 10,
    Stage2 = 50,
    Stage3 = 100,
}

export class Stage {

    CalculateStage(combo: number){
        
        let ComboCalc = combo/25;

        if(ComboCalc <= 0.40){
            return StageEnum.Stage1;
        }
        else if(ComboCalc <= 1){
            return StageEnum.Stage2;
        }
        else{
            return StageEnum.Stage3;
        }

    }
    
}
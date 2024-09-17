import * as Phaser from "phaser"
import { _ } from "Assets/_"
import { GameScene } from "src/scenes/GameScene"

export class ScoreObject extends Phaser.GameObjects.Text{
    
    constructor(scene: GameScene, x: number, y: number){

        let scoreText = "";
        let scoreTextStyle = {

        };

        super(scene, x, y, scoreText, {});
    }
}
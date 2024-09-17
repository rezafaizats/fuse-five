import { LoadingScene } from "./LoadingScene";
import { TitleScene } from "./TitleScene";
import { SampleScene } from "./SampleScene";
import { GameScene } from "./GameScene";
import { MainMenuScene } from "./MainMenuScene";
import { retry_popup } from "./popups/retry_popup";
import { selection_char } from "./popups/selection_char";
import { TestingScene } from "./TestingScene";
import { pause_popup } from "./popups/pause_popup";

const dialogs: (new (...args: any[]) => Phaser.Scene)[] = [

];

const popups: (new (...args: any[]) => Phaser.Scene)[] = [

];

const scenes: (new (...args: any[]) => Phaser.Scene)[] = [
    LoadingScene,
    MainMenuScene,
    GameScene,
    retry_popup,
    selection_char,
    pause_popup,
    TestingScene
]

export const Scenes: (new (...args: any[]) => Phaser.Scene)[] = scenes.concat(dialogs, popups);

import * as Phaser from "phaser";
import { _ } from "Assets/_";
import { Button } from "phaser3-plugin-ui-button";

export class SampleScene extends Phaser.Scene {

    constructor() {
        super(_.Scene.SAMPLE);
    }

    create() {

        const b1 = this.add.button(this.viewport.center.x, this.viewport.center.y, 200, 50, _.Image.BUTTON_UP.texture, _.Image.BUTTON_UP.frame, _.Image.BUTTON_UP.ninePatch)
            .setTint(0xff0000)
            .setText("Click Me!", _.TextStyle.BUTTON)
            ;
        
        b1.on(Button.Events.CLICK, () => this.scene.start(_.Scene.TITLE));
        
    }

}
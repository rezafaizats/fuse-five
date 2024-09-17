import * as Phaser from "phaser";
import { _ } from "Assets/_";
import { Data } from "Data";
import { Button } from "phaser3-plugin-ui-button";

export class TitleScene extends Phaser.Scene {

    constructor() {
        super(_.Scene.TITLE);
    }

    create() {
        const items = Data.Items.list.map(value => this.add.image(0, 0, value.image.texture, value.image.frame))
        Phaser.Actions.GridAlign(items, {
            x: this.viewport.center.x - 150 / 2,
            y: this.viewport.top + 200,
            cellWidth: 150,
            cellHeight: 150,
            width: 2,
            position: Phaser.Display.Align.CENTER
        });

        const b1 = this.add.button(this.viewport.center.x, this.viewport.center.y, 200, 50, _.Image.BUTTON_UP.texture, _.Image.BUTTON_UP.frame, _.Image.BUTTON_UP.ninePatch)
            .setTint(0xeeaa00)
            .setText("Click Me!", _.TextStyle.BUTTON)
            ;
        
        b1.on(Button.Events.CLICK, () => this.scene.start(_.Scene.SAMPLE));

        const b2 = this.add.button(this.viewport.center.x, this.viewport.center.y + 60, 200, 50)
            .setTint(0xee00aa)
            .setText("Click Me!")
            ;

        const p1 = this.add.progressBar(this.viewport.center.x, this.viewport.center.y + 110, 200, 20)
        this.tweens.addCounter({
            from: 0,
            to: 1,
            onUpdate: tween => p1.setRatio(tween.getValue()),
            repeat: -1,
            yoyo: true,
        })

    }

}
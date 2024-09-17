import * as Phaser from "phaser";
/// #if __DEV__
import { Dev } from "Core/Dev";
/// #endif
import { Preloader } from "phaser3-class-preloader";
import { _ } from "Assets/_";
import { CoreAssetLoader } from "Core/CoreAssetLoader";
import { AssetLoader } from "Src/AssetLoader";

export class LoadingScene extends Phaser.Scene {

    constructor() {
        super(_.Scene.LOADING);
    }

    async create() {
        /// #if __DEV__
        const devScene = this.inspector.addFolder("Scene");
        devScene.add(Dev.Scene, 'continueAfterLoading', Dev.Scene.continueAfterLoading);
        devScene.add(Dev.Scene, 'sceneAfterLoading',
            Object.keys(this.scene.manager.keys).splice(1)
        );
        devScene.add(Dev.Scene, 'jump', Dev.Scene.jump);

        if (this.physics) {
            const devPhysics = this.inspector.addFolder("Physics");
            devPhysics.add(Dev.Physics, 'debug', Dev.Physics.debug);
        }
        /// #endif

        let nextScene: string | undefined = _.Scene.TITLE;
        let nextSceneData = undefined;

        /// #if __DEV__
        if (Dev.Scene.continueAfterLoading) {
            if (Dev.Scene.jump) {
                nextScene = Dev.Scene.sceneAfterLoading;
            }
        } else {
            nextScene = undefined;
        }
        /// #endif

        const preloader = new Preloader(this, nextScene, nextSceneData, [
            new CoreAssetLoader(this),
            new AssetLoader(this)
        ]);

        await preloader.preloadFonts(
            [...new Set(Object.values(_.Font))]
        );

        preloader.start();

        const progressBar = this.add.progressBar(this.viewport.center.x, this.viewport.center.y, 400, 20);
        const progressBarBg = this.add.rectangle(progressBar.x, progressBar.y, progressBar.width + 4, progressBar.height + 4)
            .setStrokeStyle(2, 0xffffff)
            ;

        this.children.bringToTop(progressBar);

        const percentageText = this.add.text(progressBar.x, progressBar.y, "0%", _.TextStyle.LOADING)
            .setOrigin(.5)
            .setStroke("#000000", 4)
            ;

        preloader.on(Preloader.Events.PROGRESS, (value: number) => {
            progressBar.setRatio(value)
            percentageText.setText(`${Math.round(value * 100)}%`)
        })
    }

}
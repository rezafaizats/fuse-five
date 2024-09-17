import * as Phaser from "phaser";
import { NinePatchPluginInstall } from "phaser3-plugin-ui-ninepatch";
import { ButtonPluginInstall } from "phaser3-plugin-ui-button";
import { OverlayPluginInstall } from "phaser3-plugin-ui-overlay";
import { BGMPluginInstall } from "phaser3-plugin-bgm";
import { ViewportPluginInstall, ViewportPluginData } from "phaser3-plugin-viewport";

import "Core/static/style.css";

export type PluginData = {
    viewport?: ViewportPluginData
}

export function CreateConfig(scenes: (new (...args: any[]) => Phaser.Scene)[],
    pluginData: PluginData = {
        viewport: { safeRatio: 9 / 16 }
        }
) {
    const defaultConfig: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        backgroundColor: 0x000000,
        width: 820,
        height: 1024,
        scale: {
            parent: 'game',
            mode: Phaser.Scale.ScaleModes.HEIGHT_CONTROLS_WIDTH,
            autoCenter: Phaser.Scale.Center.CENTER_BOTH,
        },
        dom: {
            createContainer: true
        },
        disableContextMenu: true,
        input: {
            windowEvents: false
        },
        plugins: {
            global: [
                NinePatchPluginInstall(),
                ButtonPluginInstall(),
                OverlayPluginInstall(),
                BGMPluginInstall(),
                ViewportPluginInstall(pluginData.viewport),
            ]
        },
        images: {
            default: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAAIUlEQVR42mP8/5+BIsA4asCoAaMGjBowasCoAaMGDDcDAFIVP+GKh4jUAAAAAElFTkSuQmCC",
        },
        scene: scenes
    }

    return defaultConfig
}
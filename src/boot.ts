import * as Phaser from "phaser";
/// #if __DEV__
import { InspectorPluginInstall } from "phaser3-plugin-inspector"
/// #endif
import { CreateConfig } from "Core/Config";
import { Scenes } from "./scenes";
import { ProgressBarPluginInstall } from "phaser3-plugin-ui-progressbar";

const config = CreateConfig(Scenes);

config.physics = {
    default: "matter",
    matter: {
    }
}

// PLUGIN START

/*
 * These plugins installed by default:
 * NinePatch
 * Button
 * Overlay
 * BGM
 * Viewport
 */
const globalPlugin = (config.plugins as Phaser.Types.Core.PluginObject).global;

globalPlugin?.push(ProgressBarPluginInstall());

/// #if __DEV__
globalPlugin?.push(InspectorPluginInstall());
/// #endif

// PLUGIN END

const game = new Phaser.Game(config);
import { Asset } from "Core/Asset"
import { Atlas } from "./Atlas";

export namespace Image {

    export const MONEY:Asset.Image = {
        texture: Atlas.DEFAULT,
        frame: Atlas.Frame.DEFAULT.MONEY
    }

    export const GAMEPAD: Asset.Image = {
        texture: Atlas.DEFAULT,
        frame: Atlas.Frame.DEFAULT.GAMEPAD
    }

    export const BUTTON_UP: Asset.Image = {
        texture: Atlas.DEFAULT,
        frame: Atlas.Frame.DEFAULT.BUTTON_UP,
        ninePatch: {
            top: 10,
            right: 10,
            bottom: 20
        }
    }

    export const BALL: Asset.Image = {
        texture: Atlas.DEFAULT,
        frame: Atlas.Frame.DEFAULT.BALL
    }

}
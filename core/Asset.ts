import { NinePatch } from "phaser3-plugin-ui-ninepatch";

export namespace Asset {

    export type Image = {
        texture: string,
        frame?: string | integer,
        ninePatch?: Partial<NinePatch.NinePatchParam>,
    }

}
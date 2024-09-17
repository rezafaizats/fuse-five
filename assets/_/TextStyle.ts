import { Font } from "./Font";

export namespace TextStyle {

    export const LOADING: Phaser.Types.GameObjects.Text.TextStyle = {
        fontFamily: Font.TITLE,
        fontSize: "18px",
        color: "#ffffff"
    }

    export const TITLE: Phaser.Types.GameObjects.Text.TextStyle = {
        fontFamily: Font.TITLE,
        fontSize: "60px",
        color: "#ffffff"
    }

    export const DESCRIPTION: Phaser.Types.GameObjects.Text.TextStyle = {
        fontFamily: Font.DESCRIPTION,
        fontSize: "24px",
        color: "#ffffff"
    }

    export const BUTTON: Phaser.Types.GameObjects.Text.TextStyle = {
        fontFamily: Font.BUTTON,
        fontSize: "36px",
        color: "#ffffff"
    }

}
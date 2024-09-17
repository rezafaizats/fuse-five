import { _ } from "Assets/_";
import { Asset } from "Core/Asset";

export namespace Item {

    export const list: ReadonlyArray<{
        name: string,
        price: integer,
        image: Asset.Image
    }> = [
            {
                name: "Money",
                price: 100,
                image: _.Image.MONEY
            },
            {
                name: "Gamepad",
                price: 200,
                image: _.Image.GAMEPAD
            }
        ];

}
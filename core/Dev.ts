/// #if __DEV__

function setString(key: string, value: string) {
    localStorage.setItem(key, value)
    return value
}

function getString(key: string, fallback: string) {
    let value = localStorage.getItem(key)

    if (!value) {
        value = fallback
        localStorage.setItem(key, value)
    }

    return value
}

function getInteger(key: string, fallback: integer): integer {
    return parseInt(getString(key, fallback.toString()))
}

function setBoolean(key: string, value: boolean) {
    localStorage.setItem(key, value.toString())
    return value;
}

function getBoolean(key: string, fallback: boolean): boolean {
    return getString(key, fallback.toString()) == 'true'
}

export namespace Dev {

    export class Scene {

        static get continueAfterLoading() {
            return getBoolean("dev.scene.continueAfterLoading", true);
        }

        static set continueAfterLoading(value: boolean) {
            setBoolean("dev.scene.continueAfterLoading", value);
        }

        static get sceneAfterLoading() {
            return getString("dev.scene.sceneAfterLoading", "Scene.Title");
        }

        static set sceneAfterLoading(value: string) {
            setString("dev.scene.sceneAfterLoading", value);
        }

        static get jump() {
            return getBoolean("dev.scene.jump", true);
        }

        static set jump(value: boolean) {
            setBoolean("dev.scene.jump", value);
        }

    }

    export class Physics {

        static get debug() {
            return getBoolean("dev.physics.debug", false);
        }

        static set debug(value: boolean) {
            setBoolean("dev.physics.debug", value);
        }

    }

}

/// #endif
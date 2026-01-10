import Vector3 from "../math/Vector3.js";

export default class Object3D {
    /** @private @type{Vector3} */ #position

    /**
    * @param {Vector3} position
    */
    constructor(position) {
        this.position = position
    }

    get position() {
        return this.#position
    }

    set position(position) {
        if (!(position instanceof Vector3)) throw new TypeError("Parameter 'position' is not Vector3")
        this.#position = position
    }

    toJSON() {
        return {
            Position: this.position.toJSON()
        }
    }
}

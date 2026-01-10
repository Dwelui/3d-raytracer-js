import Vector3 from "../math/Vector3.js"
import Object3D from "./Object3D.js"

export default class Scene extends Object3D {
    /** @private @type{Array<Object3D>} */ #objects = []

    /**
    * @param {?Vector3} position
    */
    constructor(position = null) {
        if (!(position instanceof Vector3) && position !== null) throw new TypeError("Parameter 'position' is not Vector3 or null")

        super(position ?? new Vector3())
    }

    /**
    * @param {Object3D} object
    */
    add(object) {
        if (!(object instanceof Object3D)) throw new TypeError("Parameter 'object' is not Object3D")

        this.#objects.push(object)
    }

    toJSON() {
        return {
            Objects3D: this.#objects.map(object => object.toJSON())
        }
    }
}

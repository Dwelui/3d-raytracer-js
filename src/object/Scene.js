import Vector3 from "../math/Vector3.js"
import Object3d from "./Object3d.js"

export default class Scene extends Object3d {
    /** @private @type{Array<Object3d>} */ #objects = []

    /**
    * @param {?Vector3} position
    */
    constructor(position) {
        if (!(position instanceof Vector3) && position !== null) throw new TypeError("Parameter 'position' is not Vector3 or null")

        this.position = position ?? new Vector3()
    }

    /**
    * @param {Object3d} object
    */
    add(object) {
        if (!(object instanceof Object3d)) throw new TypeError("Parameter 'object' is not Object3d")

        this.#objects.push(object)
    }
}

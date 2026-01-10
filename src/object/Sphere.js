import Color from "../math/Color.js"
import Vector3 from "../math/Vector3.js"
import Object3D from "./Object3D.js"

export default class Sphere extends Object3D {
    /** @private @type{number} */ #radius
    /** @private @type{Color} */ #color

    /**
    * @param {Vector3} position
    * @param {number} radius - Must be positive.
    * @param {Color} color
    */
    constructor(position, radius, color) {
        super(position)

        this.radius = radius
        this.color = color
    }

    get radius() {
        return this.#radius
    }

    set radius(radius) {
        if (typeof radius !== 'number') throw new TypeError("Parameter 'radius' is not number")
        if (radius <= 0) throw new RangeError("Parameter 'radius' is not positive")
        this.#radius = radius
    }

    get color() {
        return this.#color
    }

    set color(color) {
        if (!(color instanceof Color)) throw new TypeError("Parameter 'color' is not Color")
        this.#color = color
    }

    toJSON() {
        return {
            ...super.toJSON(),
            Color: this.color.toJSON()
        }
    }
}

import { assertInstancesMapped, assertNumbersBetween, assertPositiveNumbers } from "../Assert.js"
import Color from "../math/Color.js"
import Vector3 from "../math/Vector3.js"
import Object3D from "./Object3D.js"

// TODO: Color and Specular properties should be extracted to Material class.
export default class Sphere extends Object3D {
    /** @private @type{number} */ #radius

    /** @private @type{Color} */ #color
    /** @private @type{number} */ #specular
    /** @private @type{number} */ #reflective

    /**
    * @param {Object} args
    * @param {Vector3} args.position
    * @param {number} args.radius - Must be positive.
    * @param {Color} args.color
    * @param {number} args.specular - Must be positive.
    * @param {number} args.reflective - Must be between 0 and 1.
    */
    constructor({
        position,
        radius,
        color,
        specular,
        reflective
    }) {
        super(position)

        this.radius = radius
        this.color = color
        this.specular = specular
        this.reflective = reflective
    }

    get radius() { return this.#radius }
    /** @param {number} radius - Must be positive. */
    set radius(radius) { assertPositiveNumbers({radius}); this.#radius = radius }

    get color() { return this.#color }
    set color(color) { assertInstancesMapped({color}); this.#color = color }

    get specular() { return this.#specular }
    /** @param {number} specular - Must be positive. */
    set specular(specular) { assertPositiveNumbers({specular}); this.#specular = specular }

    get reflective() { return this.#reflective }
    /** @param {number} reflective - Must be between 0 and 1. */
    set reflective(reflective) { assertNumbersBetween({reflective}, 0, 1); this.#reflective = reflective }

    toJSON() {
        return {
            ...super.toJSON(),
            Radius: this.radius,
            Specular: this.specular,
            Reflective: this.reflective,
            Color: this.color.toJSON()
        }
    }
}

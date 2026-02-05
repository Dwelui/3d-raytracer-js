import Color from "../Color.js"
import Matrix3 from "../math/Matrix3.js"
import Vector3 from "../math/Vector3.js"
import Object3D from "./Object3D.js"

// TODO: Color and Specular properties should be extracted to Material class.
export default class Sphere extends Object3D {
    /** @type {string} */ type = "Sphere"

    /** @type{number} */ #radius

    /** @type{Color} */ #color
    /** @type{number} */ #specular
    /** @type{number} */ #reflective

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
        super({ position })

        this.radius = radius
        this.color = color
        this.specular = specular
        this.reflective = reflective
    }

    get radius() { return this.#radius }
    /** @param {number} radius - Must be positive. */
    set radius(radius) { this.#radius = radius }

    get color() { return this.#color }
    set color(color) { this.#color = color }

    get specular() { return this.#specular }
    /** @param {number} specular - Must be positive. */
    set specular(specular) { this.#specular = specular }

    get reflective() { return this.#reflective }
    /** @param {number} reflective - Must be between 0 and 1. */
    set reflective(reflective) { this.#reflective = reflective }

    toJSON() {
        return {
            ...super.toJSON(),
            Radius: this.radius,
            Specular: this.specular,
            Reflective: this.reflective,
            Color: this.color.toArray()
        }
    }

    /**
    * @param {{
    *   Position: Object,
    *   Rotation: Array<number> | Array<Vector3> | undefined,
    *   Radius: number,
    *   Reflective: number,
    *   Color: ArrayLike<number>,
    *   Specular: number
    * }} object
    */
    static fromJSON(object) {
        return new Sphere({
            position: Vector3.fromJSON(object.Position),
            rotation: Matrix3.fromJSON(object.Rotation),
            reflective: object.Reflective,
            specular: object.Specular,
            color: Color.fromArray(object.Color),
            radius: object.Radius
        })
    }
}

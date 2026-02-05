import Vector3 from "./math/Vector3.js";

export default class Color {
    /** @type {Uint8ClampedArray} */ #components = new Uint8ClampedArray(4)

    /**
    * @param {number} [r=0] Red component (0–255)
    * @param {number} [g=0] Green component (0–255)
    * @param {number} [b=0] Blue component (0–255)
    * @param {number} [a=255] Alpha component (0–255)
    */
    constructor(r = 0, g = 0, b = 0, a = 255) {
        this.#components[0] = r
        this.#components[1] = g
        this.#components[2] = b
        this.#components[3] = a
    }

    get r() { return this.#components[0] }
    /** @param {number} number - Must be between 0 and 255. */
    set r(number) { this.#components[0] = number }

    get g() { return this.#components[1] }
    /** @param {number} number - Must be between 0 and 255. */
    set g(number) { this.#components[1] = number }

    get b() { return this.#components[2] }
    /** @param {number} number - Must be between 0 and 255. */
    set b(number) { this.#components[2] = number }

    get a() { return this.#components[3] }
    /** @param {number} number - Must be between 0 and 255. */
    set a(number) { this.#components[3] = number }

    get hex() {
        /** @type {(value: number) => string} */
        const toHex = value => Math.round(value).toString(16).padStart(2, "0")

        return `#${toHex(this.#components[0])}${toHex(this.#components[1])}${toHex(this.#components[2])}${toHex(this.#components[3])}`
    }

    toArray() {
        const clone = new Uint8ClampedArray(this.#components.length)
        clone.set(this.#components)

        return clone
    }

    /** @param {ArrayLike<number>} array */
    static fromArray(array) {
        if (array.length === 3 || array.length === 4) {
            return new Color(array[0], array[1], array[2], array[3])
        } else {
            throw new Error(`Bad argument array length given: ${array.length}`)
        }
    }

    /** @param {Vector3} vector */
    static fromVector3(vector) {
        return new Color(vector.x, vector.y, vector.z)
    }
}

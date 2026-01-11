import Vector3 from "./Vector3.js";

export default class Color extends Vector3 {

    /**
    * @param {number} r - Must be between 0 and 255.
    * @param {number} g - Must be between 0 and 255.
    * @param {number} b - Must be between 0 and 255.
    */
    constructor(r = 0, g = 0, b = 0) {
        super(r, g, b)

        this.r = r
        this.g = g
        this.b = b
    }

    get r() { return super.x }

    /** @param {number} number - Must be between 0 and 255. */
    set r(number) {
        this.#validate(number)
        super.x = number
    }

    get g() { return super.y }

    /** @param {number} number - Must be between 0 and 255. */
    set g(number) {
        this.#validate(number)
        super.y = number
    }

    get b() { return super.z }

    /** @param {number} number - Must be between 0 and 255. */
    set b(number) {
        this.#validate(number)
        super.z = number
    }

    get hex() {
        const toHex = v => v.toString(16).padStart(2, "0")
        return `#${toHex(this.r)}${toHex(this.g)}${toHex(this.b)}`
    }

    #validate(number) {
        if (typeof number !== "number") throw new TypeError("Parameter 'number' is not number")
        if (number < 0 || number > 255) throw new RangeError("Parameter 'number' value is not between 0 and 255")
    }

    toJSON() {
        return {
            r: this.r,
            g: this.g,
            b: this.b,
        }
    }
}

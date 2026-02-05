import { assertInstancesMapped, assertNumbersBetween, assertNumbersUndefined } from "../Assert.js";
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
    set r(number) { assertNumbersBetween({ number }, 0, 255); super.x = number }

    get g() { return super.y }
    /** @param {number} number - Must be between 0 and 255. */
    set g(number) { assertNumbersBetween({ number }, 0, 255); super.y = number }

    get b() { return super.z }
    /** @param {number} number - Must be between 0 and 255. */
    set b(number) { assertNumbersBetween({ number }, 0, 255); super.z = number }

    get hex() {
        /** @type {(value: number) => string} */
        const toHex = value => Math.round(value).toString(16).padStart(2, "0")

        return `#${toHex(this.r)}${toHex(this.g)}${toHex(this.b)}`
    }

    get rgba() { return [this.r, this.g, this.b, 255] }

    /**
    * @param {{
    *       x?: number,
    *       y?: number,
    *       z?: number,
    *   }} [object]
    */
    static fromJSON({ x, y, z } = {}) {
        assertNumbersUndefined({ x, y, z })

        return new Color(x, y, z)
    }

    /**
    * @param {Array<number>} array
    */
    static fromArray(array) {
        return new Color(array[0], array[1], array[2])
    }

    /** @param {Vector3} vector */
    static fromVector3(vector) {
        assertInstancesMapped({ vector })

        /** @type {(value: number) => number} */
        const clamp = value => value < 0 ? 0 : value > 255 ? 255 : value

        return new Color(clamp(vector.x), clamp(vector.y), clamp(vector.z))
    }
}

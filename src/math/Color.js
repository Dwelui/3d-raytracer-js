import { assertInstancesMapped, assertNumbersBetween } from "../Assert.js";
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
    set r(number) { assertNumbersBetween({number}, 0, 255); super.x = number }

    get g() { return super.y }
    /** @param {number} number - Must be between 0 and 255. */
    set g(number) { assertNumbersBetween({number}, 0, 255); super.y = number }

    get b() { return super.z }
    /** @param {number} number - Must be between 0 and 255. */
    set b(number) { assertNumbersBetween({number}, 0, 255); super.z = number }

    get hex() {
        const toHex = v =>
            Math.round(v)
                .toString(16)
                .padStart(2, "0")

        return `#${toHex(this.r)}${toHex(this.g)}${toHex(this.b)}`
    }

    toJSON() {
        return {
            r: this.r,
            g: this.g,
            b: this.b,
        }
    }

    /** @param {Vector3} vector */
    static fromVector3(vector) {
        assertInstancesMapped({vector})

        const clamp = number => {
            number = number > 255 ? 255 : number
            number = number < 0 ? 0 : number

            return number
        }

        return new Color(clamp(vector.x), clamp(vector.y), clamp(vector.z))
    }
}

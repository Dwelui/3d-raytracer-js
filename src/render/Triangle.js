import Color from "../Color.js";

export default class Triangle {
    /** @type {Uint32Array} */ vertices = new Uint32Array(3)
    /** @type {Color} */ color = new Color()

    /**
    * @param {number} v1
    * @param {number} v2
    * @param {number} v3
    * @param {Color} color
    */
    constructor(v1, v2, v3, color) {
        this.vertices[0] = v1
        this.vertices[1] = v2
        this.vertices[2] = v3
        this.color = color
    }
}

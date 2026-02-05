/**
* @typedef {Object} ViewportOptions
* @property {number} width  - Viewport width in units
* @property {number} height - Viewport height in units
*/

import Vector3 from "./math/Vector3.js"

export default class Viewport {
    /** @type{number} */ #distanceToCamera
    /** @type{ViewportOptions} */ #options = {
        width: 1,
        height: 1,
    }

    /**
    * @param {ViewportOptions} options
    * @param {number} distanceToCamera
    */
    constructor(options, distanceToCamera) {
        this.width = options.width
        this.height = options.height

        this.distanceToCamera = distanceToCamera
    }

    get width() { return this.#options.width }
    /** @param {number} units - Must be positive */
    set width(units) { this.#options.width = units }

    get height() { return this.#options.height }
    /** @param {number} units - Must be positive */
    set height(units) { this.#options.height = units }

    get distanceToCamera() { return this.#distanceToCamera }
    /** @param {number} units - Must be positive */
    set distanceToCamera(units) { this.#distanceToCamera = units }

    toJSON() {
        return {
            DistanceToCamera: this.distanceToCamera,
            Width: this.width,
            Height: this.height
        }
    }

    /**
    * @param {any} object
    */
    static fromJSON({ DistanceToCamera, Width, Height }) {
        return new Viewport({ width: Width, height: Height }, DistanceToCamera)
    }

    /**
    * @param {number} x
    * @param {number} y
    * @param {number} canvasWidth
    * @param {number} canvasHeight
    */
    fromCanvas(x, y, canvasWidth, canvasHeight) {
        return new Vector3(x * this.width / canvasWidth, y * this.height / canvasHeight, this.distanceToCamera)
    }
}

import { assertInstance, assertInstancesMapped, assertNumbers, assertObjects, assertPositiveNumbers, assertStrings } from "./Assert.js"
import Color from "./math/Color.js"
import Vector3 from "./math/Vector3.js"
import RayTracer from "./RayTracer.js"
import Viewport from "./Viewport.js"

/**
* @typedef {Object} CanvasOptions
* @property {number} width  - Canvas width in pixels
* @property {number} height - Canvas height in pixels
* @property {Canvas.RayTraceDrawMode[keyof Canvas.RayTraceDrawMode]} rayTraceDrawMode
* @property {Color} backroundColor - Canvas backround color
*/

export default class Canvas {
    static RayTraceDrawMode = Object.freeze({
        FASTEST: 0,
        SLOW: 1,
        SLOWEST: 2
    })

    /** @private @type{HTMLCanvasElement} */ #canvas
    /** @private @type{CanvasRenderingContext2D} */ #context
    /** @private @type{CanvasOptions} */ #options = {}

    /**
    * @param {string} querySelector - Query selector to find canvas element by. Throws error if not found.
    * @param {CanvasOptions} options
    */
    constructor(querySelector, options) {
        assertStrings({querySelector})

        this.#canvas = document.querySelector(querySelector)
        if (this.#canvas === null) throw new Error("Canvas element not found")

        this.#context = this.#canvas.getContext('2d')
        if (this.#canvas === null) throw new Error("Context not found")

        assertObjects({options})

        this.backroundColor = options.backroundColor ?? new Color()
        this.rayTraceDrawMode = options.rayTraceDrawMode ?? Canvas.RayTraceDrawMode.FASTEST
        this.width = options.width
        this.height = options.height
    }

    get backroundColor() { return this.#options.backroundColor }
    set backroundColor(color) {
        assertInstancesMapped({color})

        this.#options.backroundColor = color
    }

    get rayTraceDrawMode() { return this.#options.rayTraceDrawMode }
    set rayTraceDrawMode(mode) {
        if (!Object.values(Canvas.RayTraceDrawMode).includes(mode)) {
            throw new TypeError(`Parameter 'options.rayTraceDrawMode' option ${rayTraceDrawMode} does not exist`)
        }

        this.#options.rayTraceDrawMode = mode
    }

    get width() { return this.#options.width }
    /** @param {number} pixels - Must be positive */
    set width(pixels) {
        assertPositiveNumbers({pixels})

        this.#options.width = pixels
        this.#canvas.width = pixels
    }

    get height() { return this.#options.height }
    /** @param {number} pixels - Must be positive */
    set height(pixels) {
        assertPositiveNumbers({pixels})

        this.#options.height = pixels
        this.#canvas.height = pixels
    }

    /**
     * @param {Object} args
     * @param {RayTracer} args.rayTracer
     * @param {Viewport} args.viewport
     * @param {Vector3} args.startPosition
     * @param {number} args.intersectionMin
     * @param {number} args.intersectionMax
     * @param {number} args.recursionDepth
     */
    async rayTrace({
        rayTracer,
        viewport,
        startPosition,
        intersectionMin,
        intersectionMax,
        recursionDepth
    }) {
        assertInstancesMapped({rayTracer, viewport})
        assertInstance(startPosition, Vector3, 'startPosition')
        assertPositiveNumbers({intersectionMin, intersectionMax, recursionDepth})

        this.clear()

        for (let x = -this.width / 2; x < this.width / 2; x++) {
            for (let y = -this.height / 2; y < this.height / 2; y++) {
                const rayDirection = viewport.fromCanvas(x, y, this)
                const color = rayTracer.traceRay(
                    startPosition,
                    rayDirection,
                    intersectionMin,
                    intersectionMax,
                    recursionDepth
                ) ?? this.backroundColor

                this.putPixel(x, y, color)

                if (this.rayTraceDrawMode === Canvas.RayTraceDrawMode.SLOWEST) {
                    await new Promise(requestAnimationFrame)
                }
            }

            if (this.rayTraceDrawMode === Canvas.RayTraceDrawMode.SLOW) {
                await new Promise(requestAnimationFrame)
            }
        }
    }

    /**
    * @param {number} x
    * @param {number} y
    * @param {Color} color
    */
    putPixel(x, y, color) {
        assertNumbers({x, y})
        assertInstancesMapped({color})

        x += this.width / 2
        y = this.height / 2 - y

        if (x < 0 || x > this.width || y < 0 || y > this.height) console.warn(`pixel is out of bounds: ${x} ${y}`);

        this.#context.fillStyle = color.hex;
        this.#context.fillRect(x, y - 1, 1, 1)
    }

    clear() {
        this.#context.fillStyle = this.backroundColor.hex
        this.#context.fillRect(0, 0, this.width, this.height)
    }
}

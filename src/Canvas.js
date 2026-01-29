import {  assertInstancesMapped, assertNumbers, assertObjects, assertPositiveNumbers, assertStrings } from "./Assert.js"
import Color from "./math/Color.js"
import Matrix3 from "./math/Matrix3.js"
import Camera from "./object/Camera.js"
import Scene from "./object/Scene.js"
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

    /** @type{HTMLCanvasElement} */ #canvas
    /** @type{CanvasRenderingContext2D} */ #context
    /** @type{CanvasOptions} */ #options = {
        width: 0,
        height: 0,
        rayTraceDrawMode: Canvas.RayTraceDrawMode.SLOW,
        backroundColor: new Color()
    }

    /**
    * @param {string} querySelector - Query selector to find canvas element by. Throws error if not found.
    * @param {CanvasOptions} options
    */
    constructor(querySelector, options) {
        assertStrings({ querySelector })

        const canvas = document.querySelector(querySelector)
        if (!(canvas instanceof HTMLCanvasElement)) throw new Error("Canvas element not found")
        this.#canvas = canvas

        const context = this.#canvas.getContext('2d')
        if (context === null) throw new Error("Context not found")
        this.#context = context

        assertObjects({ options })

        this.backroundColor = options.backroundColor ?? new Color()
        this.rayTraceDrawMode = options.rayTraceDrawMode ?? Canvas.RayTraceDrawMode.FASTEST
        this.width = options.width
        this.height = options.height
    }

    get backroundColor() { return this.#options.backroundColor }
    set backroundColor(color) {
        assertInstancesMapped({ color })

        this.#options.backroundColor = color
    }

    get rayTraceDrawMode() { return this.#options.rayTraceDrawMode }
    set rayTraceDrawMode(mode) {
        if (!Object.values(Canvas.RayTraceDrawMode).includes(mode)) {
            throw new TypeError(`Parameter 'options.rayTraceDrawMode' option ${this.rayTraceDrawMode} does not exist`)
        }

        this.#options.rayTraceDrawMode = mode
    }

    get width() { return this.#options.width }
    /** @param {number} pixels - Must be positive */
    set width(pixels) {
        assertPositiveNumbers({ pixels })

        this.#options.width = pixels
        this.#canvas.width = pixels
    }

    get height() { return this.#options.height }
    /** @param {number} pixels - Must be positive */
    set height(pixels) {
        assertPositiveNumbers({ pixels })

        this.#options.height = pixels
        this.#canvas.height = pixels
    }

    /**
     * @param {Object} args
     * @param {Scene} args.scene
     * @param {Viewport} args.viewport
     * @param {Camera} args.camera
     * @param {number} args.intersectionMin
     * @param {number} args.intersectionMax
     * @param {number} args.recursionDepth
     */
    async rayTrace({
        scene,
        viewport,
        camera,
        intersectionMin,
        intersectionMax,
        recursionDepth
    }) {
        assertInstancesMapped({ scene, viewport, camera })
        assertPositiveNumbers({ intersectionMin, intersectionMax, recursionDepth })

        this.clear()

        const start = performance.now()

        const traceRayWorker = new Worker('src/worker/TraceRayWorker.js', { type: "module" })

        traceRayWorker.onmessage = (e) => {
            console.log(e.data)
            console.log("Message received from worker")
        }

        for (let x = -this.width / 2; x < this.width / 2; x++) {
            for (let y = -this.height / 2; y < this.height / 2; y++) {
                const rayDirection = Matrix3.multiplyVector3(camera.rotation, viewport.fromCanvas(x, y, this))

                traceRayWorker.postMessage({
                    sceneJSON: scene.toJSON(),
                    startingPointJSON: camera.position.toJSON(),
                    rayDirectionJSON: rayDirection.toJSON(),
                    intersectionMin,
                    intersectionMax,
                    recursionDepth
                })






                // const color = new RayTracer(scene).traceRay(
                //     camera.position,
                //     rayDirection,
                //     intersectionMin,
                //     intersectionMax,
                //     recursionDepth
                // ) ?? this.backroundColor
                //
                // this.putPixel(x, y, color)
                //
                if (this.rayTraceDrawMode === Canvas.RayTraceDrawMode.SLOWEST) {
                    await new Promise(requestAnimationFrame)
                }
            }

            if (this.rayTraceDrawMode === Canvas.RayTraceDrawMode.SLOW) {
                await new Promise(requestAnimationFrame)
            }
        }

        console.log((performance.now() - start) / 1000)
    }

    /**
    * @param {number} x
    * @param {number} y
    * @param {Color} color
    */
    putPixel(x, y, color) {
        assertNumbers({ x, y })
        assertInstancesMapped({ color })

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

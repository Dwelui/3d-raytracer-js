import Color from "./Color.js"
import Vector2 from "./math/Vector2.js"
import Camera from "./object/Camera.js"
import Scene from "./object/Scene.js"
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
        const canvas = document.querySelector(querySelector)
        if (!(canvas instanceof HTMLCanvasElement)) throw new Error("Canvas element not found")
        this.#canvas = canvas

        const context = this.#canvas.getContext('2d')
        if (context === null) throw new Error("Context not found")
        this.#context = context

        this.backroundColor = options.backroundColor ?? new Color()
        this.rayTraceDrawMode = options.rayTraceDrawMode ?? Canvas.RayTraceDrawMode.FASTEST
        this.width = options.width
        this.height = options.height
    }

    get backroundColor() { return this.#options.backroundColor }
    set backroundColor(color) {
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
        this.#options.width = pixels
        this.#canvas.width = pixels
    }

    get height() { return this.#options.height }
    /** @param {number} pixels - Must be positive */
    set height(pixels) {
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
        const xChunkCount = 64
        const yChunkCount = 64
        const xChunkSize = this.width / xChunkCount
        const yChunkSize = this.height / yChunkCount

        const widthHalf = this.width / 2
        const heightHalf = this.height / 2

        const chunkCount = xChunkCount * yChunkCount
        const chunkBufferSize = chunkCount * 4 * Int32Array.BYTES_PER_ELEMENT
        const sharedChunkBuffer = new SharedArrayBuffer(chunkBufferSize)
        const sharedChunks = new Int32Array(sharedChunkBuffer)

        for (let x = 0; x < xChunkCount; x++) {
            const xChunk = [xChunkSize * x - widthHalf, xChunkSize * (x + 1) - widthHalf]
            const xChunkIndexOffset = x * yChunkCount

            for (let y = 0; y < yChunkCount; y++) {
                const yChunk = [yChunkSize * y - heightHalf, yChunkSize * (y + 1) - heightHalf]

                const chunkPosition = (xChunkIndexOffset + y) * 4
                sharedChunks[chunkPosition + 0] = xChunk[0]
                sharedChunks[chunkPosition + 1] = xChunk[1]
                sharedChunks[chunkPosition + 2] = yChunk[0]
                sharedChunks[chunkPosition + 3] = yChunk[1]
            }
        }

        const pixelBufferSize = this.width * this.height * 4
        const sharedPixelBuffer = new SharedArrayBuffer(pixelBufferSize)
        const sharedPixels = new Uint8ClampedArray(sharedPixelBuffer)
        const displayPixels = new Uint8ClampedArray(pixelBufferSize)

        const NEXT_CHUNK = 0;
        const COMPLETED = 1;
        const TOTAL = 2;
        const ABORT = 3;
        const controlBufferSize = 4 * Int32Array.BYTES_PER_ELEMENT
        const sharedControlBuffer = new SharedArrayBuffer(controlBufferSize)
        const sharedControls = new Int32Array(sharedControlBuffer)
        sharedControls[TOTAL] = chunkCount;
        sharedControls[NEXT_CHUNK] = 0;
        sharedControls[COMPLETED] = 0;
        sharedControls[ABORT] = 0;

        const start = performance.now()

        const initializeRayWorker = {
            sceneJSON: scene.toJSON(),
            cameraJSON: camera.toJSON(),
            viewportJSON: viewport.toJSON(),
            sharedPixelBuffer,
            sharedChunkBuffer,
            sharedControlBuffer,
            intersectionMin,
            intersectionMax,
            recursionDepth,
            width: this.width,
            height: this.height
        }

        let workerCount = 6
        workerCount = chunkCount < workerCount ? chunkCount : workerCount

        /** @type {Array<Worker>} */
        const workers = []
        for (let i = 0; i < workerCount; i++) {
            const traceRayWorker = new Worker('src/worker/TraceRayWorker.js', { type: "module" })
            workers.push(traceRayWorker)
            traceRayWorker.postMessage(initializeRayWorker)
        }

        const waitForCompletion = () => {
            const doneCount = Atomics.load(sharedControls, COMPLETED)
            if (doneCount === chunkCount) {
                displayPixels.set(sharedPixels)
                this.#context.putImageData(new ImageData(displayPixels, this.width, this.height), 0, 0)

                console.log((performance.now() - start) / 1000)
                workers.forEach(worker => worker.terminate())
            } else {
                if (doneCount % 6 === 0) {
                    displayPixels.set(sharedPixels)
                    this.#context.putImageData(new ImageData(displayPixels, this.width, this.height), 0, 0)
                }

                requestAnimationFrame(waitForCompletion)
            }
        }

        waitForCompletion()
    }

    /**
    * @param {Vector2} p1
    * @param {Vector2} p2
    * @param {Color} color
    */
    drawLine(p1, p2, color) {
        if (Math.abs(p2.x - p1.x) > Math.abs(p2.y - p1.y)) {
            // Line is horizontal-ish
            // Make sure p1.x < p2.x
            if (p1.x > p2.x) {
                const temp = p1
                p1 = p2
                p2 = temp
            }

            const ys = this.interpolate(p1.x, p1.y, p2.x, p2.y)
            for (let x = p1.x; x <= p2.x; x++) {
                this.putPixel(x, ys[x - p1.x], color)
            }
        } else {
            // Line is vertical-ish
            // Make sure p1.y < p2.y
            if (p1.y > p2.y) {
                const temp = p1
                p1 = p2
                p2 = temp
            }

            const xs = this.interpolate(p1.y, p1.x, p2.y, p2.x)
            for (let y = p1.y; y <= p2.y; y++) {
                this.putPixel(xs[y - p1.y], y, color)
            }
        }
    }

    /**
    * Uses linear function to calculates dependent values from indipendent ones. i is indipendent and d is dependent.
    * Independent values are array keys and are always integers, dependent values are the array values and are floats.
    *
    * @param {number} i0
    * @param {number} d0
    * @param {number} i1
    * @param {number} d1
    */
    interpolate(i0, d0, i1, d1) {
        if (i0 === i1) return [d0]

        const result = []
        const slope = (d1 - d0) / (i1 - i0)
        let d = d0
        for (let x = i0; x <= i1; x++) {
            result.push(d)
            d += slope
        }

        return result
    }

    /**
    * @param {number} x
    * @param {number} y
    * @param {Color} color
    */
    putPixel(x, y, color) {
        x += this.width / 2
        y = this.height / 2 - y
        x = Math.round(x)
        y = Math.round(y)

        if (x < 0 || x > this.width || y < 0 || y > this.height) console.warn(`pixel is out of bounds: ${x} ${y}`);

        this.#context.fillStyle = color.hex;
        this.#context.fillRect(x, y, 1, 1)
    }

    clear() {
        this.#context.fillStyle = this.backroundColor.hex
        this.#context.fillRect(0, 0, this.width, this.height)
    }
}

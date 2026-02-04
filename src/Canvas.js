import { assertInstancesMapped, assertNumbers, assertObjects, assertPositiveNumbers, assertStrings } from "./Assert.js"
import Color from "./math/Color.js"
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

        const xChunkCount = 16
        const yChunkCount = 16
        const xChunkSize = this.width / xChunkCount
        const yChunkSize = this.height / yChunkCount

        let chunkCount = 0
        /**
        * @type {Array<{
        *   id: number,
        *   xChunk: Array<number>,
        *   yChunk: Array<number>,
        *   status: 'waiting'|'done'|'inprogress'
        * }>}
        */
        const chunks = []
        for (let x = 0; x < xChunkCount; x++) {
            const xChunk = [xChunkSize * x - this.width / 2, xChunkSize * (x + 1) - this.width / 2]
            for (let y = 0; y < yChunkCount; y++) {
                const yChunk = [yChunkSize * y - this.height / 2, yChunkSize * (y + 1) - this.height / 2]

                chunks.push({
                    id: chunkCount,
                    xChunk,
                    yChunk,
                    status: "waiting"
                })

                chunkCount++
            }
        }

        const sab = new SharedArrayBuffer(this.width * this.height * 4)
        const sharedPixels = new Uint8ClampedArray(sab)

        const start = performance.now()

        /** @param {number} id */
        const initializeRayWorker = (id) => {
            return {
                type: 'initialize',
                id,
                sceneJSON: scene.toJSON(),
                cameraJSON: camera.toJSON(),
                viewportJSON: viewport.toJSON(),
                sab,
                intersectionMin,
                intersectionMax,
                recursionDepth,
                width: this.width,
                height: this.height
            }
        }

        /**
        * @param {MessageEvent<{
        *   chunkId: number,
        *   workerId: number
        * }>} ev
        */
        const handleRayWorker = (ev) => {
            const { chunkId, workerId } = ev.data

            const chunk = chunks.find(chunk => chunk.id === chunkId)
            if (chunk) chunk.status = "done"

            const doneChunks = chunks.filter(chunk => chunk.status === 'done')
            if (doneChunks.length === chunkCount) {
                const displayPixels = new Uint8ClampedArray(this.width * this.height * 4)
                displayPixels.set(sharedPixels)
                this.#context.putImageData(new ImageData(displayPixels, this.width, this.height), 0, 0)
                console.log((performance.now() - start) / 1000)
                return
            }

            const waitingChunks = chunks.filter(chunk => chunk.status === 'waiting')
            if (waitingChunks.length === 0) {
                return
            }

            const nextChunk = waitingChunks[0]
            nextChunk.status = "inprogress"

            workers[workerId].worker.postMessage({
                type: 'trace',
                chunk: nextChunk,
            })
        }

        let workerCount = 6
        workerCount = chunks.length < workerCount ? chunks.length : workerCount
        /**
        * @type {Array<{
        *   worker: Worker,
        * }>}
        */
        const workers = []
        for (let i = 0; i < workerCount; i++) {
            const traceRayWorker = new Worker('src/worker/TraceRayWorker.js', { type: "module" })
            workers.push({ worker: traceRayWorker })
            traceRayWorker.postMessage(initializeRayWorker(i))
            traceRayWorker.onmessage = handleRayWorker
            traceRayWorker.postMessage({
                type: 'trace',
                chunk: chunks[i],
            })
        }
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

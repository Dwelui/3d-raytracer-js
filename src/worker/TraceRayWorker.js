import { disableAsserts } from "../Assert.js"
import Matrix3 from "../math/Matrix3.js"
import Camera from "../object/Camera.js"
import Scene from "../object/Scene.js"
import RayTracer from "../RayTracer.js"
import Viewport from "../Viewport.js"

disableAsserts()

let scene = null
/** @type {?RayTracer} */
let rayTracer = null
/** @type {?Camera} */
let camera = null
/** @type {?Viewport} */
let viewport = null
/** @type {?number} */
let intersectionMin = null
/** @type {?number} */
let intersectionMax = null
/** @type {?number} */
let recursionDepth = null
/** @type {?number} */
let width = null
/** @type {?number} */
let height = null

/** @type Int32Array */
let chunks
/** @type Uint8ClampedArray */
let pixels
/** @type Int32Array */
let controls

const NEXT_CHUNK = 0;
const COMPLETED = 1;
const TOTAL = 2;
const ABORT = 3;

onmessage = (ev) => {
    const { type } = ev.data

    if (type === 'initialize') {
        const { sceneJSON, cameraJSON, viewportJSON, sharedPixelBuffer, sharedChunkBuffer, sharedControlBuffer } = ev.data;
        ({ intersectionMin, intersectionMax, recursionDepth, width, height } = ev.data)

        chunks = new Int32Array(sharedChunkBuffer)
        pixels = new Uint8ClampedArray(sharedPixelBuffer)
        controls = new Int32Array(sharedControlBuffer)

        scene = Scene.fromJSON(sceneJSON)
        rayTracer = new RayTracer(scene)
        camera = Camera.fromJSON(cameraJSON)
        viewport = Viewport.fromJSON(viewportJSON)

        while (true) {
            if (Atomics.load(controls, ABORT)) return

            const chunkId = Atomics.add(controls, NEXT_CHUNK, 1)
            if (chunkId >= controls[TOTAL]) break;

            const chunkPosition = chunkId * 4
            const chunk = [
                chunks[chunkPosition + 0],
                chunks[chunkPosition + 1],
                chunks[chunkPosition + 2],
                chunks[chunkPosition + 3],
            ]

            TraceRayBatch(chunk)

            Atomics.add(controls, COMPLETED, 1)
        }
    }
}

/**
* @param {Array<number>} chunk
*/
function TraceRayBatch(chunk) {
    if (!rayTracer || !camera || !viewport || !intersectionMin || !intersectionMax || !recursionDepth || !width || !height) {
        console.log({ rayTracer, camera, viewport, intersectionMin, intersectionMax, recursionDepth, width, height })
        throw new Error('Worker not initialized')
    }

    for (let x = chunk[0]; x < chunk[1]; x++) {
        const offsetX = (Math.floor(x + width / 2))

        for (let y = chunk[2]; y < chunk[3]; y++) {
            const rayDirection = Matrix3.multiplyVector3(camera.rotation, viewport.fromCanvas(x, y, width, height))

            const color = rayTracer.traceRay(
                camera.position,
                rayDirection,
                intersectionMin,
                intersectionMax,
                recursionDepth
            )

            const pixelIndex = ((Math.floor(height / 2 - y)) * width + offsetX) * 4
            const rgba = color?.rgba
            if (rgba) {
                pixels[pixelIndex + 0] = rgba[0]
                pixels[pixelIndex + 1] = rgba[1]
                pixels[pixelIndex + 2] = rgba[2]
                pixels[pixelIndex + 3] = 255
            } else {
                pixels[pixelIndex + 0] = 255
                pixels[pixelIndex + 1] = 255
                pixels[pixelIndex + 2] = 255
                pixels[pixelIndex + 3] = 255
            }
        }
    }
}

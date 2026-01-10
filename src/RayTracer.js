import Vector3 from "./math/Vector3.js"
import Camera from "./object/Camera.js"
import Scene from "./object/Scene.js"

export default class RayTracer
{
    /** @private @type{Camera} */ #camera
    /** @private @type{Scene} */ #scene
    /** @private @type{number} */ #rayMin
    /** @private @type{number} */ #rayMax

    /**
    * @param {Camera} camera
    * @param {Scene} camera
    * @param {number} rayMin - Must be positive.
    * @param {number} rayMax - Must be larger than `rayMin`.
    */
    constructor(camera, scene, rayMin, rayMax) {
        if (!(camera instanceof Camera)) throw new TypeError("Parameter 'camera' is not Camera")
        this.#camera = camera

        if (!(scene instanceof Scene)) throw new TypeError("Parameter 'scene' is not Scene")
        this.#scene = scene

        if (typeof rayMin !== 'number') throw new TypeError("Parameter 'rayMin' is not number")
        if (rayMin <= 0) throw new RangeError("Parameter 'rayMin' is not positive")
        this.#rayMin = rayMin

        if (typeof rayMax !== 'number') throw new TypeError("Parameter 'rayMax' is not number")
        if (rayMax <= rayMin) throw new RangeError("Parameter 'rayMax' is not larger than 'rayMin'")
        this.#rayMax = rayMax
    }

    /**
    * Calculates traced color for given viewport point.
    *
    * @param {Vector3} viewportPoint
    */
    trace(viewportPoint) {
        if (!(viewportPoint instanceof Vector3)) throw new TypeError("Parameter 'viewportPoint' is not Vector3")

        
    }
}

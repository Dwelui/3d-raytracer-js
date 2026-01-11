import Vector3 from "./math/Vector3.js"
import Camera from "./object/Camera.js"
import Scene from "./object/Scene.js"
import Sphere from "./object/Sphere.js"

export default class RayTracer {
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

        let closestIntersection = this.#rayMax
        let closestObject = null

        for (const object of this.#scene.objects) {
            if (object instanceof Sphere) {
                const isClosest = intersection =>
                    intersection !== null &&
                    intersection > this.#rayMin &&
                    intersection <= this.#rayMax &&
                    intersection < closestIntersection

                /*
                * t < 0 - Behind the camera.
                * 0 <= t <= 1 - Between the camera and the viewport.
                * t > 1 - Infront of the viewport.
                */

                const [intersection1, intersection2] = this.intersectRaySphere(viewportPoint, object)

                if ((isClosest(intersection1))) {
                    closestIntersection = intersection1
                    closestObject = object
                }

                if ((isClosest(intersection2))) {
                    closestIntersection = intersection2
                    closestObject = object
                }
            } else {
                console.warn(`Intersection not implemented for ${object.toJSON()}`)
                return null;
            }
        }

        if (closestObject === null) return null

        if (closestObject instanceof Sphere) {
            return closestObject.color
        } else {
            console.warn(`Color for object not implemented ${closestObject.toJSON()}`)
            return null;
        }
    }

    /**
    * @param {Vector3} ray
    * @param {Sphere} sphere
    */
    intersectRaySphere(ray, sphere) {
        if (!(ray instanceof Vector3)) throw new TypeError("Parameter 'viewportPoint' is not Vector3")
        if (!(sphere instanceof Sphere)) throw new TypeError("Parameter 'sphere' is not Sphere")

        const cameraToSphere = Vector3.subtract(this.#camera.position, sphere.position)

        const a = Vector3.dot(ray, ray)
        const b = 2 * Vector3.dot(cameraToSphere, ray)
        const c = Vector3.dot(cameraToSphere, cameraToSphere) - sphere.radius * sphere.radius

        const discriminant = b * b - 4 * a * c
        if (discriminant < 0) {
            return [null, null]
        }

        const t1 = (-b + Math.sqrt(discriminant)) / (2 * a)
        const t2 = (-b - Math.sqrt(discriminant)) / (2 * a)

        return [t1, t2]
    }
}

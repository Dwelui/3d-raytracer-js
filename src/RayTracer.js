import Color from "./math/Color.js"
import Vector3 from "./math/Vector3.js"
import AmbientLight from "./object/AmbientLight.js"
import DirectionalLight from "./object/DirectionalLight.js"
import Light from "./object/Light.js"
import PointLight from "./object/PointLight.js"
import Scene from "./object/Scene.js"
import Sphere from "./object/Sphere.js"

export default class RayTracer {
    /** @private @type{Scene} */ #scene

    /**
    * @param {Scene} scene
    */
    constructor(scene) {
        if (!(scene instanceof Scene)) throw new TypeError("Parameter 'scene' is not Scene")
        this.#scene = scene
    }

    /**
    * Calculates traced color for ray vector.
    *
    * @param {Vector3} startingPoint
    * @param {Vector3} rayDirection
    * @param {number} intersectionMin - Must be positive.
    * @param {number} intersectionMax - Must be positive.
    * @param {number} recursionDepth - Must be positive.
    */
    traceRay(startingPoint, rayDirection, intersectionMin, intersectionMax, recursionDepth) {
        if (!(rayDirection instanceof Vector3)) throw new TypeError("Parameter 'ray' is not Vector3")
        if (typeof recursionDepth !== 'number') throw new TypeError("Parameter 'recursionDepth' is not number")

        const { closestObject, closestIntersection } = this.closestIntersection(startingPoint, rayDirection, intersectionMin, intersectionMax)

        if (closestObject === null) return null

        const intersectionPoint = Vector3.add(startingPoint, Vector3.multiplyScalar(rayDirection, closestIntersection))

        let localColor = new Color()
        let surfaceNormal = null
        if (closestObject instanceof Sphere) {
            surfaceNormal = Vector3.subtract(intersectionPoint, closestObject.position).normalize()

            const lightStrenght = this.calculateLightStrength(intersectionPoint, surfaceNormal, closestObject.specular, rayDirection.clone().invert(), intersectionMax)
            if (lightStrenght < 0) {
                throw new Error(`Light strenght is negative for object ${closestObject.toJSON()}`)
            }

            localColor = Color.fromVector3(Vector3.multiplyScalar(closestObject.color, lightStrenght))
        } else {
            console.warn(`Color for object not implemented ${closestObject.toJSON()}`)
        }

        if (recursionDepth <= 0 || closestObject.reflective <= 0) {
            return localColor
        }

        const reflectionDirection = this.reflectRay(rayDirection.clone().invert(), surfaceNormal)
        let reflectionColor = this.traceRay(intersectionPoint, reflectionDirection, 0.0001, intersectionMax, recursionDepth - 1)
        if (reflectionColor === null) {
            return localColor
        }

        localColor.multiplyScalar(1 - closestObject.reflective)
        reflectionColor.multiplyScalar(closestObject.reflective)
        return Color.fromVector3(Vector3.add(localColor, reflectionColor))
    }

    /**
    * @param {Vector3} rayDirection
    * @param {number} intersectionMin
    * @param {number} intersectionMax
    */
    closestIntersection(startingPoint, rayDirection, intersectionMin, intersectionMax) {
        if (!(startingPoint instanceof Vector3)) throw new TypeError("Parameter 'startingPoint' is not Vector3")
        if (!(rayDirection instanceof Vector3)) throw new TypeError("Parameter 'ray' is not Vector3")
        if (typeof intersectionMin !== 'number') throw new TypeError("Parameter 'intersectionMin' is not number")
        if (typeof intersectionMax !== 'number') throw new TypeError("Parameter 'intersectionMax' is not number")

        let closestIntersection = intersectionMax
        let closestObject = null

        for (const object of this.#scene.objects) {
            if (object instanceof Light) {
                continue
            }

            if (object instanceof Sphere) {
                const isClosest = intersection =>
                    intersection !== null &&
                    intersection > intersectionMin &&
                    intersection <= intersectionMax &&
                    intersection < closestIntersection

                const [intersection1, intersection2] = this.intersectRaySphere(startingPoint, rayDirection, object)

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
            }
        }

        return {
            closestObject,
            closestIntersection
        }
    }

    /**
    * @param {Vector3} startingPoint
    * @param {Vector3} ray
    * @param {Sphere} sphere
    */
    intersectRaySphere(startingPoint, ray, sphere) {
        if (!(startingPoint instanceof Vector3)) throw new TypeError("Parameter 'startingPoint' is not Vector3")
        if (!(ray instanceof Vector3)) throw new TypeError("Parameter 'ray' is not Vector3")
        if (!(sphere instanceof Sphere)) throw new TypeError("Parameter 'sphere' is not Sphere")

        const cameraToSphere = Vector3.subtract(startingPoint, sphere.position)

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

    /**
    * @param {Vector3} rayDirection
    * @param {Vector3} surfaceNormalDirection
    */
    reflectRay(rayDirection, surfaceNormalDirection) {
        if (!(rayDirection instanceof Vector3)) throw new TypeError("Parameter 'rayDirection' is not Vector3")
        if (!(surfaceNormalDirection instanceof Vector3)) throw new TypeError("Parameter 'surfaceNormalDirection' is not Vector3")

        surfaceNormalDirection = surfaceNormalDirection.clone()

        return surfaceNormalDirection.multiplyScalar(surfaceNormalDirection.dot(rayDirection) * 2).subtract(rayDirection)
    }

    /**
    * @param {Vector3} intersectionPoint
    * @param {Vector3} surfaceNormal
    * @param {Vector3} specularExponent
    * @param {Vector3} viewVector - Vector from intersectionPoint to the Camera.
    */
    calculateLightStrength(intersectionPoint, surfaceNormal, specularExponent, viewVector, intersectionMax) {
        if (!(intersectionPoint instanceof Vector3)) throw new TypeError("Parameter 'intersectionPoint' is not Vector3")
        if (!(surfaceNormal instanceof Vector3)) throw new TypeError("Parameter 'surfaceNormal' is not Vector3")
        if (Math.abs(surfaceNormal.magnitude - 1) > 1e-6) {
            throw new Error(
                `Parameter 'surfaceNormal' is not normalized ${surfaceNormal.magnitude}`
            );
        }
        if (typeof specularExponent !== 'number') throw new TypeError("Parameter 'specularExponent' is not number")
        if (!(viewVector instanceof Vector3)) throw new TypeError("Parameter 'viewVector' is not Vector3")

        let result = 0

        let lightDirection = null;

        const sceneLights = this.#scene.objects.filter(object => object instanceof Light)
        for (const light of sceneLights) {
            if (light instanceof AmbientLight) {
                result += light.intensity
                continue
            } else if (light instanceof PointLight) {
                lightDirection = Vector3.subtract(light.position, intersectionPoint)
            } else if (light instanceof DirectionalLight) {
                lightDirection = light.direction.clone()
            }

            // Shadow check
            const { closestObject } = this.closestIntersection(intersectionPoint, lightDirection, 0.0001, intersectionMax)
            if (closestObject) {
                continue;
            }

            // Calculate defuse surface.
            if (lightDirection) {
                const dot = Vector3.dot(surfaceNormal, lightDirection)
                if (dot > 0) {
                    result += light.intensity * dot / (surfaceNormal.magnitude * lightDirection.magnitude)
                }
            }

            // Calculate shiny surface.
            if (specularExponent !== 0) {
                const reflectionVector = this.reflectRay(lightDirection, surfaceNormal)
                const reflectionDotView = Vector3.dot(reflectionVector, viewVector)
                if (reflectionDotView > 0) {
                    const reflectionAngleView = reflectionDotView / (reflectionVector.magnitude * viewVector.magnitude)
                    const specularStrength = Math.pow(reflectionAngleView, specularExponent)
                    result += light.intensity * specularStrength
                }
            }
        }

        return result
    }
}

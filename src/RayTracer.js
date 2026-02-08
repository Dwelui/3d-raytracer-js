import Color from "./Color.js"
import Vector3 from "./math/Vector3.js"
import AmbientLight from "./object/AmbientLight.js"
import DirectionalLight from "./object/DirectionalLight.js"
import Light from "./object/Light.js"
import PointLight from "./object/PointLight.js"
import Scene from "./object/Scene.js"
import Sphere from "./object/Sphere.js"

export default class RayTracer {
    /** @type{Scene} */ #scene

    /**
    * @param {Scene} scene
    */
    constructor(scene) {
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
    * @returns {Color|null}
    */
    traceRay(startingPoint, rayDirection, intersectionMin, intersectionMax, recursionDepth) {
        const { closestObject, closestIntersection } = this.closestIntersection(startingPoint, rayDirection, intersectionMin, intersectionMax)

        if (closestObject === null) return null

        const intersectionPoint = Vector3.add(startingPoint, Vector3.multiplyScalar(rayDirection, closestIntersection))

        let localColor = new Color()
        const surfaceNormal = Vector3.normalize(Vector3.subtract(intersectionPoint, closestObject.position))

        const lightStrenght = this.calculateLightStrength(intersectionPoint, surfaceNormal, closestObject.specular, Vector3.invert(rayDirection.clone()), intersectionMax)
        if (lightStrenght < 0) {
            throw new Error(`Light strenght is negative for object ${closestObject.toJSON()}`)
        }

        localColor = Color.fromVector3(Vector3.multiplyScalar(closestObject.color.toVector3(), lightStrenght))

        if (recursionDepth <= 0 || closestObject.reflective <= 0) {
            return localColor
        }

        const reflectionDirection = this.reflectRay(Vector3.invert(rayDirection.clone()), surfaceNormal)
        let reflectionColor = this.traceRay(intersectionPoint, reflectionDirection, 0.0001, intersectionMax, recursionDepth - 1)
        if (reflectionColor === null) {
            return localColor
        }

        localColor.multiplyScalar(1 - closestObject.reflective)
        reflectionColor.multiplyScalar(closestObject.reflective)
        return Color.fromVector3(Vector3.add(localColor.toVector3(), reflectionColor.toVector3()))
    }

    /**
    * @param {Vector3} startingPoint
    * @param {Vector3} rayDirection
    * @param {number} intersectionMin - Must be positive.
    * @param {number} intersectionMax - Must be positive.
    */
    closestIntersection(startingPoint, rayDirection, intersectionMin, intersectionMax) {
        let closestIntersection = intersectionMax
        let closestObject = null

        for (const object of this.#scene.objects) {
            if (object instanceof Light) {
                continue
            }

            if (object instanceof Sphere) {
                /** @type{(intersection: number) => boolean} */
                const isClosest = intersection =>
                    intersection > intersectionMin &&
                    intersection <= intersectionMax &&
                    intersection < closestIntersection

                const [intersection1, intersection2] = this.intersectRaySphere(startingPoint, rayDirection, object)

                if (intersection1 !== null && isClosest(intersection1)) {
                    closestIntersection = intersection1
                    closestObject = object
                }

                if (intersection2 !== null && isClosest(intersection2)) {
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
    * @param {Vector3} rayDirection
    * @param {Sphere} sphere
    */
    intersectRaySphere(startingPoint, rayDirection, sphere) {
        const cameraToSphere = Vector3.subtract(startingPoint, sphere.position)

        const a = Vector3.dot(rayDirection, rayDirection)
        const b = 2 * Vector3.dot(cameraToSphere, rayDirection)
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
        surfaceNormalDirection = surfaceNormalDirection.clone()

        return Vector3.subtract(Vector3.multiplyScalar(surfaceNormalDirection, Vector3.dot(surfaceNormalDirection, rayDirection) * 2), rayDirection)
    }

    /**
    * @param {Vector3} intersectionPoint
    * @param {Vector3} surfaceNormal
    * @param {number} specularExponent - Must be positive.
    * @param {Vector3} viewVector - Vector from intersectionPoint to the Camera.
    * @param {number} intersectionMax - Must be positive.
    */
    calculateLightStrength(intersectionPoint, surfaceNormal, specularExponent, viewVector, intersectionMax) {
        if (Math.abs(surfaceNormal.magnitude - 1) > 1e-6) {
            throw new Error(
                `Parameter 'surfaceNormal' is not normalized ${surfaceNormal.magnitude}`
            );
        }

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

            // Calculate defuse surface.
            if (lightDirection) {

                // Shadow check
                const { closestObject } = this.closestIntersection(intersectionPoint, lightDirection, 0.0001, intersectionMax)
                if (closestObject) {
                    continue;
                }

                const dot = Vector3.dot(surfaceNormal, lightDirection)
                if (dot > 0) {
                    result += light.intensity * dot / (surfaceNormal.magnitude * lightDirection.magnitude)
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
        }

        return result
    }
}

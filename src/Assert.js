import Canvas from "./Canvas.js"
import Color from "./math/Color.js"
import Vector3 from "./math/Vector3.js"
import Object3D from "./object/Object3D.js"
import Scene from "./object/Scene.js"
import RayTracer from "./RayTracer.js"
import Viewport from "./Viewport.js"

const instancesMap = {
    color: () => Color,
    rayTracer: () => RayTracer,
    viewport: () => Viewport,
    object3D: () => Object3D,
    scene: () => Scene,
    canvas: () => Canvas,
    vector: () => Vector3,
    vector3: () => Vector3,
}

let enabled = true

export function enableAsserts() {
    enabled = true
}

export function disableAsserts() {
    enabled = false
}

/** @param {Object.<string, Object>} instances */
export function assertInstancesMapped(instances) {
    if (!enabled) return

    for (const [name, value] of Object.entries(instances)) {
        const instanceClass = instancesMap[name]?.()

        assertInstance(value, instanceClass, name)
    }
}

/**
* @param {Object.<string, Object>} instances
* @param {Object} targetInstance
*/
export function assertInstances(instances, targetInstance) {
    if (!enabled) return

    for (const [name, value] of Object.entries(instances)) {
        assertInstance(value, targetInstance, name)
    }
}

/**
* @param {Object.<string, Object>} instances
* @param {Object} targetInstance
*/
export function assertInstancesNullable(instances, targetInstance) {
    if (!enabled) return

    for (const [name, value] of Object.entries(instances)) {
        assertInstanceNullable(value, targetInstance, name)
    }
}

/**
* @param {Object} value
* @param {Function} targetInstance
* @param {string} name
*/
function assertInstanceNullable(value, targetInstance, name) {
    if (value !== null) {
        assertInstance(value, targetInstance, name)
    }
}

/**
* @param {Object} value
* @param {Function} targetInstance
* @param {string} name
*/
function assertInstance(value, targetInstance, name) {
    if (!(value instanceof targetInstance)) {
        const actual = value?.constructor?.name ?? typeof value

        throw new TypeError(`Parameter '${name}' must be an instance of ${targetInstance.name}, got '${actual}'`)
    }
}

/**
* @param {number} value
* @param {string} name
*/
function assertPositiveNumber(value, name) {
    assertNumber(value, name)

    if (value < 0) {
        throw new RangeError(`Parameter '${name}' must be positive`)
    }
}

/** @param {Object.<string, number>} numbers */
export function assertPositiveNumbers(numbers) {
    if (!enabled) return

    for (const [name, value] of Object.entries(numbers)) {
        assertPositiveNumber(value, name)
    }
}

/** @param {Object.<string, number>} numbers */
export function assertNumbers(numbers) {
    if (!enabled) return

    for (const [name, value] of Object.entries(numbers)) {
        assertNumber(value, name)
    }
}

/**
* @param {Object.<string, number>} numbers
* @param {number} from
* @param {number} till
*/
export function assertNumbersBetween(numbers, from, till) {
    if (!enabled) return

    for (const [name, value] of Object.entries(numbers)) {
        assertNumberBetween(value, name, from, till)
    }
}

/**
* @param {number} value
* @param {string} name
* @param {number} from
* @param {number} till
*/
export function assertNumberBetween(value, name, from, till) {
    if (!enabled) return

    if (typeof value !== 'number') {
        throw new TypeError(`Parameter '${name}' is not number`)
    }

    if (value < from || value > till) {
        throw new RangeError(`Parameter '${name}' is not between ${from} and ${till}`)
    }
}

/**
* @param {number} value
* @param {string} name
*/
function assertNumber(value, name) {
    if (typeof value !== 'number') {
        throw new TypeError(`Parameter '${name}' is not number`)
    }
}

/** @param {Object.<string, string>} strings */
export function assertStrings(strings) {
    if (!enabled) return

    for (const [name, value] of Object.entries(strings)) {
        assertString(value, name)
    }
}

/**
* @param {string} value
* @param {string} name
*/
function assertString(value, name) {
    if (typeof value !== 'string') {
        throw new TypeError(`Parameter '${name}' is not string`)
    }
}

/** @param {Object.<string, Object>} objects */
export function assertObjects(objects) {
    if (!enabled) return

    for (const [name, value] of Object.entries(objects)) {
        assertObject(value, name)
    }
}

/**
* @param {Object} value
* @param {string} name
*/
function assertObject(value, name) {
    if (typeof value !== 'object') {
        throw new TypeError(`Parameter '${name}' is not object`)
    }
}

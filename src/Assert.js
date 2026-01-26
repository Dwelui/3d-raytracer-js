import Color from "./math/Color.js"
import RayTracer from "./RayTracer.js"
import Viewport from "./Viewport.js"

const instancesMap = {
    color: Color,
    rayTracer: RayTracer,
    viewport: Viewport,
}

/** @param {Object.<string, Object>} instance */
export function assertInstancesMapped(instance) {
    for (const [name, value] of Object.entries(instance)) {
        const instanceClass = instancesMap[name]

        assertInstance(value, instanceClass, name)
    }
}

/**
* @param {Object} value
* @param {Object} targetInstance
* @param {string} name
*/
export function assertInstance(value, targetInstance, name) {
    if (!(value instanceof targetInstance)) {
        throw new TypeError(`Parameter '${name}' is not ${targetInstance.name}`)
    }
}

/**
* @param {number} value
* @param {string} name
*/
export function assertPositiveNumber(value, name) {
    assertNumber(value, name)

    if (value < 0) {
        throw new RangeError(`Parameter '${name}' must be positive`)
    }
}

/** @param {Object.<string, number>} numbers */
export function assertPositiveNumbers(numbers) {
    for (const [name, value] of Object.entries(numbers)) {
        assertPositiveNumber(value, name)
    }
}

/** @param {Object.<string, number>} numbers */
export function assertNumbers(numbers) {
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
export function assertNumber(value, name) {
    if (typeof value !== 'number') {
        throw new TypeError(`Parameter '${name}' is not number`)
    }
}

/** @param {Object.<string, string>} strings */
export function assertStrings(strings) {
    for (const [name, value] of Object.entries(strings)) {
        assertString(value, name)
    }
}

/**
* @param {string} value
* @param {string} name
*/
export function assertString(value, name) {
    if (typeof value !== 'string') {
        throw new TypeError(`Parameter '${name}' is not string`)
    }
}

/** @param {Object.<string, Object>} objects */
export function assertObjects(objects) {
    for (const [name, value] of Object.entries(objects)) {
        assertObject(value, name)
    }
}

/**
* @param {Object} value
* @param {string} name
*/
export function assertObject(value, name) {
    if (typeof value !== 'object') {
        throw new TypeError(`Parameter '${name}' is not object`)
    }
}

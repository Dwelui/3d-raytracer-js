import Vector3 from "./Vector3.js"

export default class Matrix3 {
    /** @type{Array<number>} */ #components

    /** @param {Array<number> | Array<Vector3>} [components] */
    constructor(components) {
        if (
            Array.isArray(components) &&
            components.length === 9 &&
            components.every(c => typeof c === 'number')
        ) {
            this.#components = components
        } else if (
            Array.isArray(components) &&
            components.length === 3 &&
            components.every(c => c instanceof Vector3)
        ) {
            this.#components = components.flatMap(component => component.toArray())
        } else if (typeof components === 'undefined') {
            this.#components = Matrix3.zero().toArray()
        } else {
            console.assert(false, components)
            throw TypeError(`Bad '...components' parameter ${components}`)
        }
    }

    /**
    * @overload
    * @param {number} row - Number between 0 and 2.
    * @param {number} col - Number between 0 and 2.
    * @return {number}
    */

    /**
    * @overload
    * @param {number} index - Number between 0 and 8.
    * @return {number}
    */

    /** @param {...number} args */
    get(...args) {
        let index = null

        if (args.length === 1) {
            index = args[0]
        } else if (args.length === 2) {
            const [row, col] = args
            index = row * 3 + col
        } else {
            throw new Error(`Bad '..args' parameter ${args}`)
        }

        return this.#components[index]
    }

    /**
    * @overload
    * @param {number} row - Number between 0 and 2.
    * @param {number} col - Number between 0 and 2.
    * @param {number} value
    * @return {void}
    */

    /**
    * @overload
    * @param {number} index - Number between 0 and 8.
    * @param {number} value
    * @return {void}
    */

    /** @param {...number} args */
    set(...args) {
        let index = null
        let value = null

        if (args.length == 2) {
            [index, value] = args
        } else if (args.length === 3) {
            const [row, col] = args
            index = row * 3 + col
            value = args[2]
        } else {
            throw new Error(`Bad '..args' parameter ${args}`)
        }

        this.#components[index] = value
    }

    toArray() {
        return this.#components.slice()
    }

    toJSON() {
        const c = this.#components
        return {
            1: c[0], 2: c[1], 3: c[2],
            4: c[3], 5: c[4], 6: c[5],
            7: c[6], 8: c[7], 9: c[8]
        }
    }

    /** @param {Record<string, number> | undefined} object */
    static fromJSON(object) { return new Matrix3(object ? Object.values(object) : object) }

    static zero() {
        return new Matrix3([
            0, 0, 0,
            0, 0, 0,
            0, 0, 0,
        ])
    }

    static identity() {
        return new Matrix3([
            1, 0, 0,
            0, 1, 0,
            0, 0, 1,
        ])
    }

    /** @param {Matrix3} matrix */
    static transpose(matrix) {
        const c = matrix.#components

        return new Matrix3([
            c[0], c[3], c[6],
            c[1], c[4], c[7],
            c[2], c[5], c[8],
        ])
    }

    /**
    * @param {Matrix3} a
    * @param {Matrix3} b
    */
    static multiplyMatrix3(a, b) {
        const ac = a.#components
        const bc = b.#components

        return new Matrix3([
            ac[0] * bc[0] + ac[1] * bc[3] + ac[2] * bc[6],
            ac[0] * bc[1] + ac[1] * bc[4] + ac[2] * bc[7],
            ac[0] * bc[2] + ac[1] * bc[5] + ac[2] * bc[8],

            ac[3] * bc[0] + ac[4] * bc[3] + ac[5] * bc[6],
            ac[3] * bc[1] + ac[4] * bc[4] + ac[5] * bc[7],
            ac[3] * bc[2] + ac[4] * bc[5] + ac[5] * bc[8],

            ac[6] * bc[0] + ac[7] * bc[3] + ac[8] * bc[6],
            ac[6] * bc[1] + ac[7] * bc[4] + ac[8] * bc[7],
            ac[6] * bc[2] + ac[7] * bc[5] + ac[8] * bc[8],
        ])
    }

    /**
    * @param {Matrix3} matrix
    * @param {Vector3} vector
    */
    static multiplyVector3(matrix, vector) {
        const m = matrix.#components
        const x = vector.x, y = vector.y, z = vector.z

        return new Vector3(
            m[0] * x + m[1] * y + m[2] * z,
            m[3] * x + m[4] * y + m[5] * z,
            m[6] * x + m[7] * y + m[8] * z
        )
    }
}

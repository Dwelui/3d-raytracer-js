import { assertInstances, assertInstancesMapped, assertNumbers, assertNumbersBetween } from "../Assert.js"
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
            assertNumbersBetween({ index }, 0, 8)
        } else if (args.length === 2) {
            const [row, col] = args
            assertNumbersBetween({ row, col }, 0, 2)

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

            assertNumbersBetween({ index }, 0, 8)
            assertNumbers({ value })

        } else if (args.length === 3) {
            const [row, col] = args
            index = row * 3 + col
            value = args[2]

            assertNumbersBetween({ row, col }, 0, 2)
            assertNumbers({ value })
        } else {
            throw new Error(`Bad '..args' parameter ${args}`)
        }

        this.#components[index] = value
    }

    toJSON() {
        return {
            1: this.get(0),
            2: this.get(1),
            3: this.get(2),
            4: this.get(3),
            5: this.get(4),
            6: this.get(5),
            7: this.get(6),
            8: this.get(7),
            9: this.get(8),
        }
    }

    toArray() {
        return [
            this.get(0),
            this.get(1),
            this.get(2),
            this.get(3),
            this.get(4),
            this.get(5),
            this.get(6),
            this.get(7),
            this.get(8),
        ]
    }

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

    /**
    * @param {Matrix3} a
    * @param {Matrix3} b
    */
    static multiplyMatrix3(a, b) {
        assertInstances({ a, b }, Matrix3)

        return new Matrix3([
            a.get(0) * b.get(0) + a.get(1) * b.get(3) + a.get(2) * b.get(6),
            a.get(0) * b.get(1) + a.get(1) * b.get(4) + a.get(2) * b.get(7),
            a.get(0) * b.get(2) + a.get(1) * b.get(5) + a.get(2) * b.get(8),

            a.get(3) * b.get(0) + a.get(4) * b.get(3) + a.get(5) * b.get(6),
            a.get(3) * b.get(1) + a.get(4) * b.get(4) + a.get(5) * b.get(7),
            a.get(3) * b.get(2) + a.get(4) * b.get(5) + a.get(5) * b.get(8),

            a.get(6) * b.get(0) + a.get(7) * b.get(3) + a.get(8) * b.get(6),
            a.get(6) * b.get(1) + a.get(7) * b.get(4) + a.get(8) * b.get(7),
            a.get(6) * b.get(2) + a.get(7) * b.get(5) + a.get(8) * b.get(8),
        ])
    }

    /**
    * @param {Matrix3} matrix
    * @param {Vector3} vector
    */
    static multiplyVector3(matrix, vector) {
        assertInstancesMapped({ matrix, vector })

        return new Vector3(
            matrix.get(0) * vector.x + matrix.get(1) * vector.y + matrix.get(2) * vector.z,
            matrix.get(3) * vector.x + matrix.get(4) * vector.y + matrix.get(5) * vector.z,
            matrix.get(6) * vector.x + matrix.get(7) * vector.y + matrix.get(8) * vector.z,
        )
    }
}

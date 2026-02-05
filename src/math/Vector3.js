export default class Vector3 {
    /** @type{number} */ #x
    /** @type{number} */ #y
    /** @type{number} */ #z

    constructor(x = 0, y = 0, z = 0) {
        this.x = x
        this.y = y
        this.z = z
    }

    get x() { return this.#x }
    set x(number) { this.#x = number }

    get y() { return this.#y }
    set y(number) { this.#y = number }

    get z() { return this.#z }
    set z(number) { this.#z = number }

    get magnitude() { return Math.sqrt(this.#x * this.#x + this.#y * this.#y + this.#z * this.#z) }

    normalize() {
        const mag = this.magnitude
        if (mag !== 0) this.multiplyScalar(1 / mag)

        return this
    }

    invert() {
        this.multiplyScalar(-1)

        return this
    }

    clone() { return new Vector3(this.#x, this.#y, this.#z) }

    toJSON() {
        return {
            x: this.x,
            y: this.y,
            z: this.z,
        }
    }

    /**
    * @param {{
    *       x?: number,
    *       y?: number,
    *       z?: number,
    *   }} [object]
    */
    static fromJSON({ x, y, z } = {}) {
        return new Vector3(x, y, z)
    }

    toArray() { return [this.x, this.y, this.z] }

    /**
    * Mutates vector
    *
    * @param {number} number
    */
    multiplyScalar(number) {
        this.#x *= number
        this.#y *= number
        this.#z *= number

        return this
    }

    /**
    * Mutates vector
    *
    * @param {Vector3} vector
    */
    add(vector) {
        this.#x += vector.x
        this.#y += vector.y
        this.#z += vector.z

        return this
    }

    /**
    * Mutates vector
    *
    * @param {Vector3} vector
    */
    subtract(vector) {
        this.#x -= vector.x
        this.#y -= vector.y
        this.#z -= vector.z

        return this
    }

    /** @param {Vector3} vector */
    dot(vector) {
        return this.#x * vector.x + this.#y * vector.y + this.#z * vector.z
    }

    /**
    * @param {Vector3} vector
    */
    cross(vector) {
        return new Vector3(
            this.#y * vector.z - this.#z * vector.y,
            this.#z * vector.x - this.#x * vector.z,
            this.#x * vector.y - this.#y * vector.x,
        )
    }

    /**
    * @param {Vector3} a
    * @param {Vector3} b
    */
    static add(a, b) {
        return new Vector3(a.x + b.x, a.y + b.y, a.z + b.z)
    }

    /**
    * @param {Vector3} vector
    * @param {number} number
    */
    static multiplyScalar(vector, number) {
        return new Vector3(vector.x * number, vector.y * number, vector.z * number)
    }

    /**
    * @param {Vector3} a
    * @param {Vector3} b
    */
    static subtract(a, b) {
        return new Vector3(a.x - b.x, a.y - b.y, a.z - b.z)
    }

    /**
    * @param {Vector3} a
    * @param {Vector3} b
    */
    static dot(a, b) {
        return a.x * b.x + a.y * b.y + a.z * b.z
    }
}

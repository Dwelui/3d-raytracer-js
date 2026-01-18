export default class Vector3 {
    /** @protected @type{number} */ #x
    /** @protected @type{number} */ #y
    /** @protected @type{number} */ #z

    constructor(x = 0, y = 0, z = 0) {
        this.x = x
        this.y = y
        this.z = z
    }

    get x() { return this.#x }
    set x(number) {
        this.#validate(number)
        this.#x = number
    }

    get y() { return this.#y }
    set y(number) {
        this.#validate(number)
        this.#y = number
    }

    get z() { return this.#z }
    set z(number) {
        this.#validate(number)
        this.#z = number
    }

    get magnitude() {
        return Math.sqrt(this.#x * this.#x + this.#y * this.#y + this.#z * this.#z)
    }

    #validate(number) {
        if (typeof number !== "number") throw new TypeError("Parameter 'number' must be a number")
    }

    normalize() {
        const mag = this.magnitude
        if (mag !== 0) this.divideScalar(mag)
        return this
    }

    clone() {
        return new Vector3(this.#x, this.#y, this.#z)
    }

    toJSON() {
        return {
            x: this.x,
            y: this.y,
            z: this.z,
        }
    }

    /**
    * Mutates vector
    *
    * @param {number} number
    */
    multiplyScalar(number) {
        if (typeof number !== 'number') throw new TypeError("Parameter 'number' is not number")

        this.#x *= number
        this.#y *= number
        this.#z *= number

        return this
    }

    /**
    * @param {Vector3} Vector3
    * @param {number} number
    */
    static multiplyScalar(vector, number) {
        if (!(vector instanceof Vector3)) throw new TypeError("Parameter 'vector' is not Vector3")
        if (typeof number !== 'number') throw new TypeError("Parameter 'number' is not number")

        return new Vector3(vector.x * number, vector.y * number, vector.z * number)
    }

    /**
    * Mutates vector
    *
    * @param {Vector3} otherVector
    */
    add(otherVector) {
        this.#x += otherVector.x
        this.#y += otherVector.y
        this.#z += otherVector.z
        return this
    }

    /**
    * Mutates vector
    *
    * @param {Vector3} otherVector
    */
    subtract(otherVector) {
        this.#x -= otherVector.x
        this.#y -= otherVector.y
        this.#z -= otherVector.z
        return this
    }

    /**
    * @param {Vector3} a
    * @param {Vector3} b
    */
    static subtract(a, b) {
        if (!(a instanceof Vector3)) throw new TypeError("Parameter 'a' is not Vector3")
        if (!(b instanceof Vector3)) throw new TypeError("Parameter 'b' is not Vector3")

        return new Vector3(a.x - b.x, a.y - b.y, a.z - b.z)
    }

    /**
    * @param {Vector3} otherVector
    */
    dot(otherVector) {
        return this.#x * otherVector.x + this.#y * otherVector.y + this.#z * otherVector.z
    }

    /**
    * @param {Vector3} a
    * @param {Vector3} b
    */
    static dot(a, b) {
        if (!(a instanceof Vector3)) throw new TypeError("Parameter 'a' is not Vector3")
        if (!(b instanceof Vector3)) throw new TypeError("Parameter 'b' is not Vector3")

        return a.x * b.x + a.y * b.y + a.z * b.z
    }

    /**
    * @param {Vector3} otherVector
    */
    cross(otherVector) {
        return new Vector3(
            this.#y * otherVector.z - this.#z * otherVector.y,
            this.#z * otherVector.x - this.#x * otherVector.z,
            this.#x * otherVector.y - this.#y * otherVector.x,
        )
    }
}

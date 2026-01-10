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
    * @param {number} number
    */
    divideScalar(number) {
        this.#x /= number
        this.#y /= number
        this.#z /= number
        return this
    }

    /**
    * @param {number} number
    */
    multiplyScalar(number) {
        this.#x *= number
        this.#y *= number
        this.#z *= number
        return this
    }

    /**
    * @param {Vector3} otherVector
    */
    add(otherVector) {
        this.#x += otherVector.x
        this.#y += otherVector.y
        this.#z += otherVector.z
        return this
    }

    /**
    * @param {Vector3} otherVector
    */
    subtract(otherVector) {
        this.#x -= otherVector.x
        this.#y -= otherVector.y
        this.#z -= otherVector.z
        return this
    }

    /**
    * @param {Vector3} otherVector
    */
    dot(otherVector) {
        return this.#x * otherVector.x + this.#y * otherVector.y + this.#z * otherVector.z
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

import { assertInstances, assertNumbers, assertObjects } from "../Assert.js";
import Matrix3 from "../math/Matrix3.js";
import Vector3 from "../math/Vector3.js";

export default class Object3D {
    /** @type{Vector3} */ #position
    /** @type{Matrix3} */ #rotation

    /**
    * @param {Object} args
    * @param {Vector3} args.position
    * @param {Matrix3} [args.rotation]
    */
    constructor({ position, rotation }) {
        this.position = position
        this.rotation = rotation ?? Matrix3.identity()
    }

    get position() { return this.#position }
    set position(position) { assertInstances({ position }, Vector3); this.#position = position }

    get rotation() { return this.#rotation }
    set rotation(rotation) { assertInstances({ rotation }, Matrix3); this.#rotation = rotation }

    toJSON() {
        return {
            Position: this.position.toJSON(),
            Rotation: this.rotation.toJSON()
        }
    }

    /**
    * @param {{
    *   Position: Object,
    *   Rotation: Array<number> | Array<Vector3> | undefined
    * }} abject
    */
    static fromJSON({ Position, Rotation }) {
        return new Object3D({
            position: Vector3.fromJSON(Position),
            rotation: Matrix3.fromJSON(Rotation)
        })
    }

    /** @param {number} units */
    translateX(units) {
        assertNumbers({ units })

        this.position.x += units
    }

    /** @param {number} units */
    translateY(units) {
        assertNumbers({ units })

        this.position.y += units
    }

    /** @param {number} units */
    translateZ(units) {
        assertNumbers({ units })

        this.position.z += units
    }

    /** @param {number} degress */
    rotateX(degress) {
        assertNumbers({ degress })

        const radians = degress * Math.PI / 180
        const cos = Math.cos(radians)
        const sin = Math.sin(radians)

        const rotationMatrix = new Matrix3([
            1, 0, 0,
            0, cos, -1 * sin,
            0, sin, cos
        ])

        this.rotation = Matrix3.multiplyMatrix3(this.rotation, rotationMatrix)
    }

    /** @param {number} degress */
    rotateY(degress) {
        assertNumbers({ degress })

        const radians = degress * Math.PI / 180
        const cos = Math.cos(radians)
        const sin = Math.sin(radians)

        const rotationMatrix = new Matrix3([
            cos, 0, sin,
            0, 1, 0,
            -1 * sin, 0, cos
        ])

        this.rotation = Matrix3.multiplyMatrix3(this.rotation, rotationMatrix)
    }

    /** @param {number} degress */
    rotateZ(degress) {
        assertNumbers({ degress })

        const radians = degress * Math.PI / 180
        const cos = Math.cos(radians)
        const sin = Math.sin(radians)

        const rotationMatrix = new Matrix3([
            cos, -1 * sin, 0,
            sin, cos, 0,
            0, 0, 1
        ])

        this.rotation = Matrix3.multiplyMatrix3(this.rotation, rotationMatrix)
    }
}

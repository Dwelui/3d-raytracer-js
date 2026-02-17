import Matrix3 from "../math/Matrix3.js";
import Vector3 from "../math/Vector3.js";
import Mesh from "../render/Mesh.js";

export default class Object3D {
    /** @type {string} */ type = "Object3D"

    /** @type{Vector3} */ #position
    /** @type{Matrix3} */ #rotation
    /** @type{number} */ #scale
    /** @type{Mesh|undefined} */ #mesh

    /**
    * @param {Object} args
    * @param {Vector3} [args.position]
    * @param {Matrix3} [args.rotation]
    * @param {number} [args.scale]
    * @param {Mesh} [args.mesh]
    */
    constructor({ position, rotation, scale, mesh } = {}) {
        this.#position = position ?? new Vector3()
        this.#rotation = rotation ?? Matrix3.identity()
        this.#scale = scale ?? 1

        if (mesh !== undefined) {
            this.#mesh = mesh
        }
    }

    get position() { return this.#position }
    set position(position) {
        this.#position = position
    }

    get rotation() { return this.#rotation }
    set rotation(rotation) { this.#rotation = rotation }

    get scale() { return this.#scale }
    set scale(units) { this.#scale = units }

    get mesh() { return this.#mesh }
    set mesh(mesh) { this.#mesh = mesh }

    toJSON() {
        return {
            type: this.type,
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

    /**
    * @param {Vector3} vector
    */
    translate(vector) {
        this.#position.add(vector)
    }

    /** @param {number} degress */
    rotateX(degress) {
        const radians = degress * Math.PI / 180
        const cos = Math.cos(radians)
        const sin = Math.sin(radians)

        const rotationMatrix = new Matrix3([
            1, 0, 0,
            0, cos, -1 * sin,
            0, sin, cos
        ])

        this.rotation = Matrix3.multiplyMatrix3(this.rotation, rotationMatrix)

        return this
    }

    /** @param {number} degress */
    rotateY(degress) {
        const radians = degress * Math.PI / 180
        const cos = Math.cos(radians)
        const sin = Math.sin(radians)

        const rotationMatrix = new Matrix3([
            cos, 0, sin,
            0, 1, 0,
            -1 * sin, 0, cos
        ])

        this.rotation = Matrix3.multiplyMatrix3(this.rotation, rotationMatrix)

        return this
    }

    /** @param {number} degress */
    rotateZ(degress) {
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

import Matrix3 from "../math/Matrix3.js";
import Vector3 from "../math/Vector3.js";
import Vertex from "../render/Vertex.js";
import Object3D from "./Object3D.js";

export default class Box extends Object3D {
    /** @type {string} */ type = "Box"

    /** @type {number} */ #width
    /** @type {number} */ #height
    /** @type {number} */ #length

    /**
    * @param {Object} args
    * @param {number} [args.width]
    * @param {number} [args.height]
    * @param {number} [args.length]
    * @param {Vector3} [args.position]
    * @param {Matrix3} [args.rotation]
    */
    constructor({ width = 1, height = 1, length = 1, position, rotation } = {}) {
        super({ position, rotation })
        this.#width = width
        this.#height = height
        this.#length = length

        this.updateMesh()
    }

    get width() { return this.#width }
    set width(units) {
        this.#width = units
        this.updateMesh()
    }

    get height() { return this.#height }
    set height(units) {
        this.#height = units
        this.updateMesh()
    }

    get length() { return this.#length }
    set length(units) {
        this.#length = units
        this.updateMesh()
    }

    updateMesh() {
        if (this.mesh.vertices.length !== 8) {
            this.mesh.vertices = Array(8).fill(new Vertex(), 0, 8)
        }

        const vertices = this.mesh.vertices

        const x = this.width / 2
        const y = this.height / 2
        const z = this.length / 2

        // TODO: Optimize:
        // 1. Do not create new instances of Vector3
        // 2. Change the delta instead of reseting the vertices, to avoid translating again
        vertices[0].position = new Vector3(x, y, z)
        vertices[1].position = new Vector3(-x, y, z)
        vertices[2].position = new Vector3(-x, -y, z)
        vertices[3].position = new Vector3(x, -y, z)
        vertices[4].position = new Vector3(x, y, -z)
        vertices[5].position = new Vector3(-x, y, -z)
        vertices[6].position = new Vector3(-x, -y, -z)
        vertices[7].position = new Vector3(x, -y, -z)

        for (const vertex of vertices) {
            vertex.position.add(this.position)
        }
    }
}

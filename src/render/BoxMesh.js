import Color from "../Color.js";
import Vector3 from "../math/Vector3.js";
import Mesh from "./Mesh.js";
import Triangle from "./Triangle.js";
import Vertex from "./Vertex.js";

export default class BoxMesh extends Mesh {
    /** @type {string} */ type = "BoxMesh"

    /** @type {number} */ #width
    /** @type {number} */ #height
    /** @type {number} */ #length

    /**
    * @param {Object} args
    * @param {number} [args.width]
    * @param {number} [args.height]
    * @param {number} [args.length]
    */
    constructor({ width = 1, height = 1, length = 1 } = {}) {
        super()

        this.#width = width
        this.#height = height
        this.#length = length

        this.update()

        const blue = new Color(0, 0, 200)
        const red = new Color(200, 0, 0)
        const green = new Color(0, 200, 0)
        const yellow = new Color(200, 200, 0)
        const purple = new Color(200, 0, 200)
        const cyan = new Color(0, 200, 200)

        this.triangles = [
            new Triangle(0, 1, 2, red),
            new Triangle(0, 2, 3, red),
            new Triangle(4, 0, 3, green),
            new Triangle(4, 3, 7, green),
            new Triangle(5, 4, 7, blue),
            new Triangle(5, 7, 6, blue),
            new Triangle(1, 5, 6, yellow),
            new Triangle(1, 6, 2, yellow),
            new Triangle(4, 5, 1, purple),
            new Triangle(4, 1, 0, purple),
            new Triangle(2, 6, 7, cyan),
            new Triangle(2, 7, 3, cyan),
        ]
    }

    get width() { return this.#width }
    set width(units) { this.#width = units; this.update() }

    get height() { return this.#height }
    set height(units) { this.#height = units; this.update() }

    get length() { return this.#length }
    set length(units) { this.#length = units; this.update() }

    update() {
        if (this.vertices.length !== 8) {
            this.vertices = Array(8).fill(null).map(() => new Vertex())
        }

        const vertices = this.vertices

        const x = this.#width / 2
        const y = this.#height / 2
        const z = this.#length / 2

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
    }
}

import Triangle from "./Triangle.js"
import Vertex from "./Vertex.js"

export default class Mesh {
    /** @type {string} */ type = "Mesh"

    /** @type {Array<Vertex>} */ vertices = []
    /** @type {Array<Triangle>} */ triangles = []

    /**
    * @param {Array<Vertex>} [vertices]
    * @param {Array<Triangle>} [triangles]
    */
    constructor(vertices = [], triangles = []) {
        this.vertices = vertices
        this.triangles = triangles
    }

    update() { }
}

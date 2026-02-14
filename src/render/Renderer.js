import Canvas from "../Canvas.js"
import Vector2 from "../math/Vector2.js"
import Object3D from "../object/Object3D.js"
import Scene from "../object/Scene.js"
import Triangle from "./Triangle.js"
import Vertex from "./Vertex.js"

export default class Renderer {
    /** @type {Canvas} canvas */ #canvas

    /**
    * @param {Object} args
    * @param {Canvas} args.canvas
    */
    constructor({ canvas }) {
        this.#canvas = canvas
    }

    /**
    * @param {Scene} scene
    */
    renderScene(scene) {
        for (const object of scene.objects) {
            this.renderObject(object)
        }
    }

    /**
    * @param {Object3D} object
    */
    renderObject(object) {
        const mesh = object.mesh
        if (!mesh) return

        /** @type {Array<Vector2>} */
        const projectedVertices = []
        for (const vertex of mesh.vertices) {
            const transformedVertex = this.applyTransform(vertex, object)
            projectedVertices.push(this.#canvas.projectVertex(transformedVertex))
        }

        for (let triangle of mesh.triangles) {
            this.renderTriangle(triangle, projectedVertices)
        }
    }

    /**
    * @param {Triangle} triangle
    * @param {Array<Vector2>} projectedVertices
    */
    renderTriangle(triangle, projectedVertices) {
        this.#canvas.drawWireframeTriangle(
            projectedVertices[triangle.vertices[0]],
            projectedVertices[triangle.vertices[1]],
            projectedVertices[triangle.vertices[2]],
            triangle.color
        )
    }

    /**
    * @param {Vertex} vertex
    * @param {Object3D} object
    */
    applyTransform(vertex, object) {
        vertex = vertex.clone()
        vertex.position.multiplyScalar(object.scale)
        vertex.position.multiplyMatrix3(object.rotation)
        vertex.position.add(object.position)

        return vertex
    }
}

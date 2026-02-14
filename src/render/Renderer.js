import Canvas from "../Canvas.js"
import Matrix3 from "../math/Matrix3.js"
import Vector2 from "../math/Vector2.js"
import Camera from "../object/Camera.js"
import Object3D from "../object/Object3D.js"
import Scene from "../object/Scene.js"
import Triangle from "./Triangle.js"
import Vertex from "./Vertex.js"

export default class Renderer {
    /** @type {Canvas} */ #canvas
    /** @type {Camera} */ #camera

    /**
    * @param {Object} args
    * @param {Canvas} args.canvas
    * @param {Camera} args.camera
    */
    constructor({ canvas, camera }) {
        this.#canvas = canvas
        this.#camera = camera
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
            const transformedVertex = this.applyTransform(vertex.clone(), object)
            const cameraSpaceVertex = this.applyCameraSpaceTransform(transformedVertex)
            projectedVertices.push(this.#canvas.projectVertex(cameraSpaceVertex))
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
        vertex.position.multiplyScalar(object.scale)
        vertex.position.multiplyMatrix3(object.rotation)
        vertex.position.add(object.position)

        return vertex
    }

    /**
    * @param {Vertex} vertex
    */
    applyCameraSpaceTransform(vertex) {
        vertex.position.multiplyMatrix3(Matrix3.transpose(this.#camera.rotation))
        vertex.position.subtract(this.#camera.position)

        return vertex
    }
}

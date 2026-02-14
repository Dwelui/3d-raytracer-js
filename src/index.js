import Canvas from "./Canvas.js"
import Color from "./Color.js"
import Vector3 from "./math/Vector3.js"
import Box from "./object/Box.js"
import Triangle from "./render/Triangle.js"
import Viewport from "./Viewport.js"

const [width, height] = [window.innerWidth, window.innerHeight]

const viewport = new Viewport({ width: 1, height: 1 * height / width }, 1)

const canvas = new Canvas('#canvas', {
    width,
    height,
    backroundColor: new Color(255, 255, 255),
    viewport
})

const box = new Box()
box.translate(new Vector3(-1.5, 0, 7))

console.log(box)

const blue = new Color(0, 0, 200)
const red = new Color(200, 0, 0)
const green = new Color(0, 200, 0)
const yellow = new Color(200, 200, 0)
const purple = new Color(200, 0, 200)
const cyan = new Color(0, 200, 200)

/**
* @param {Array<Vector3>} vertices
* @param {Vector3} translationVector
*/
const tranlate = (vertices, translationVector) => {
    for (let vertex of vertices) {
        vertex.add(translationVector)
    }
}

const vertices = [
    new Vector3(1, 1, 1),
    new Vector3(-1, 1, 1),
    new Vector3(-1, -1, 1),
    new Vector3(1, -1, 1),
    new Vector3(1, 1, -1),
    new Vector3(-1, 1, -1),
    new Vector3(-1, -1, -1),
    new Vector3(1, -1, -1),
]

tranlate(vertices, new Vector3(-1.5, 0, 7))

const triangles = [
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

canvas.renderObject(vertices, triangles)

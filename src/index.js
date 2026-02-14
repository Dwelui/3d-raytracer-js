import Canvas from "./Canvas.js"
import Color from "./Color.js"
import Vector3 from "./math/Vector3.js"
import Box from "./object/Box.js"
import Viewport from "./Viewport.js"

const [width, height] = [window.innerWidth, window.innerHeight]

const viewport = new Viewport({ width: 1, height: 1 * height / width }, 1)

const canvas = new Canvas('#canvas', {
    width,
    height,
    backroundColor: new Color(255, 255, 255),
    viewport
})

const box = new Box({
    position: new Vector3(-1.5, 0, 7)
})

canvas.renderObject(box.mesh.vertices, box.mesh.triangles)

import Canvas from "./Canvas.js"
import Color from "./Color.js"
import Vector3 from "./math/Vector3.js"
import Object3D from "./object/Object3D.js"
import BoxMesh from "./render/BoxMesh.js"
import Viewport from "./Viewport.js"

const [width, height] = [window.innerWidth, window.innerHeight]

const viewport = new Viewport({ width: 1, height: 1 * height / width }, 1)

const canvas = new Canvas('#canvas', {
    width,
    height,
    backroundColor: new Color(255, 255, 255),
    viewport
})

const boxMesh = new BoxMesh()

const box1 = new Object3D({
    mesh: boxMesh,
    position: new Vector3(0, 0, 5)
})

console.log(box1)

// const box2 = new Object3D({
//     mesh: boxMesh,
//     position: new Vector3(1, 2, 3)
// })

canvas.renderObject(box1)
// canvas.renderObject(box2.mesh.vertices, box2.mesh.triangles)

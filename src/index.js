import Canvas from "./Canvas.js"
import Color from "./Color.js"
import Vector3 from "./math/Vector3.js"
import Camera from "./object/Camera.js"
import Object3D from "./object/Object3D.js"
import Scene from "./object/Scene.js"
import BoxMesh from "./render/BoxMesh.js"
import Renderer from "./render/Renderer.js"
import Viewport from "./Viewport.js"

const [width, height] = [window.innerWidth, window.innerHeight]
const viewport = new Viewport({ width: 2, height: 2 * height / width }, 1)
// TODO implement rotation to be passed into initilization
const camera = new Camera({
    position: new Vector3(0, 0, -3),
}).rotateY(25)

const canvas = new Canvas('#canvas', {
    width,
    height,
    backroundColor: new Color(255, 255, 255),
    viewport
})

const boxMesh = new BoxMesh()
// TODO implement rotation to be passed into initilization
const box1 = new Object3D({
    mesh: boxMesh,
    scale: 3,
    position: new Vector3(0, 0, 5)
}).rotateY(45)

const box2 = new Object3D({
    mesh: boxMesh,
    position: new Vector3(1, 2, 3)
})

new Renderer({ canvas, camera }).renderScene(
    new Scene().add([box1, box2])
)

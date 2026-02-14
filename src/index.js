import Canvas from "./Canvas.js"
import Color from "./Color.js"
import Vector3 from "./math/Vector3.js"
import Object3D from "./object/Object3D.js"
import Scene from "./object/Scene.js"
import BoxMesh from "./render/BoxMesh.js"
import Renderer from "./render/Renderer.js"
import Viewport from "./Viewport.js"

const [width, height] = [window.innerWidth, window.innerHeight]

const viewport = new Viewport({ width: 2, height: 2 * height / width }, 1)

const canvas = new Canvas('#canvas', {
    width,
    height,
    backroundColor: new Color(255, 255, 255),
    viewport
})

const mesh = new BoxMesh()
const scene = new Scene()
scene.add(new Object3D({
    mesh,
    scale: 2,
    position: new Vector3(0, 0, 5)
}))
scene.add(new Object3D({
    mesh,
    position: new Vector3(1, 2, 3)
}))

const renderer = new Renderer({ canvas })
renderer.renderScene(scene)

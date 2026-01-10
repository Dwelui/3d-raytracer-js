import Canvas from "./Canvas.js"
import Color from "./math/Color.js"
import Vector3 from "./math/Vector3.js"
import Camera from "./object/Camera.js"
import Scene from "./object/Scene.js"
import Sphere from "./object/Sphere.js"
import RayTracer from "./RayTracer.js"
import Viewport from "./Viewport.js"

const canvas = new Canvas('#canvas', { width: 500, height: 500 })
const viewport = new Viewport({ width: 1, height: 1 }, 1)
const camera = new Camera(new Vector3())

const scene = new Scene()
const rayTracer = new RayTracer(camera, scene, viewport.distanceToCamera, 100)

const sphere1 = new Sphere()

canvas.clear()

for (let x = -1 * canvas.width / 2; x < canvas.width / 2; x++) {
    for (let y = -1 * canvas.height / 2; y < canvas.height / 2; y++) {
        const D = viewport.fromCanvas(x, y, canvas)
        const color = rayTracer.trace(D)
        console.log(color)

        canvas.putPixel(x, y, new Color(255, 0, 0))
    }
}

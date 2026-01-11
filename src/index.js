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

const sphere1 = new Sphere(new Vector3(0, -1, 3), 1, new Color(255, 0, 0))
const sphere2 = new Sphere(new Vector3(2, 0, 4), 1, new Color(0, 0, 255))
const sphere3 = new Sphere(new Vector3(-2, 0, 4), 1, new Color(0, 255, 0))
scene.add(sphere1)
scene.add(sphere2)
scene.add(sphere3)

canvas.clear()

async function render() {
    for (let x = -canvas.width / 2; x < canvas.width / 2; x++) {
        for (let y = -canvas.height / 2; y < canvas.height / 2; y++) {
            const ray = viewport.fromCanvas(x, y, canvas)
            const color = rayTracer.trace(ray)
            canvas.putPixel(x, y, color ?? new Color(255, 255, 255))
        }
    await new Promise(requestAnimationFrame)
    }
}

render()

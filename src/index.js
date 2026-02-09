import Canvas from "./Canvas.js"
import Color from "./Color.js"
import Vector3 from "./math/Vector3.js"
import AmbientLight from "./object/AmbientLight.js"
import Camera from "./object/Camera.js"
import DirectionalLight from "./object/DirectionalLight.js"
import PointLight from "./object/PointLight.js"
import Scene from "./object/Scene.js"
import Sphere from "./object/Sphere.js"
import Viewport from "./Viewport.js"

const [width, height] = [window.innerWidth, window.innerHeight]

const viewport = new Viewport({ width: 1, height: height / width }, 1)
const camera = new Camera({ position: new Vector3(3, 0, 1) })
camera.rotateY(-45)

const sphere1 = new Sphere({
    position: new Vector3(0, -1, 3),
    radius: 1,
    color: new Color(255, 0, 0),
    specular: 200,
    reflective: 0.2,
})
const sphere2 = new Sphere({
    position: new Vector3(2, 0, 4),
    radius: 1,
    color: new Color(0, 0, 255),
    specular: 500,
    reflective: 0.3
})
const sphere3 = new Sphere({
    position: new Vector3(-2, 0, 4),
    radius: 1,
    color: new Color(0, 255, 0),
    specular: 0,
    reflective: 0.4
})
const sphere4 = new Sphere({
    position: new Vector3(0, -5001, 0),
    radius: 5000,
    color: new Color(255, 255, 0),
    specular: 1000,
    reflective: 0.5
})

const ambientLight = new AmbientLight({ intensity: 0.2 })
const pointLight = new PointLight({
    position: new Vector3(2, 1, 0),
    intensity: 0.6
})
const directionalLight = new DirectionalLight({
    direction: new Vector3(1, 4, 4),
    intensity: 0.2
})

const scene = new Scene()
scene.add(sphere1)
scene.add(sphere2)
scene.add(sphere3)
scene.add(sphere4)
scene.add(ambientLight)
scene.add(pointLight)
scene.add(directionalLight)

const canvas = new Canvas('#canvas', {
    width,
    height,
    backroundColor: new Color(255, 255, 255),
    rayTraceDrawMode: Canvas.RayTraceDrawMode.SLOW
})

canvas.drawLine({ x: -200, y: -100}, { x: 240, y: 120}, new Color())
canvas.drawLine({ x: -50, y: -200}, { x: 60, y: 240}, new Color())

// canvas.rayTrace({
//     camera,
//     viewport,
//     scene,
//     intersectionMin: viewport.distanceToCamera,
//     intersectionMax: 100,
//     recursionDepth: 3
// })

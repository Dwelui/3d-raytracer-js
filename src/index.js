import Canvas from "./Canvas.js"
import Color from "./Color.js"
// import Vector2 from "./math/Vector2.js"
import Vector3 from "./math/Vector3.js"
// import AmbientLight from "./object/AmbientLight.js"
// import Camera from "./object/Camera.js"
// import DirectionalLight from "./object/DirectionalLight.js"
// import PointLight from "./object/PointLight.js"
// import Scene from "./object/Scene.js"
// import Sphere from "./object/Sphere.js"
import Viewport from "./Viewport.js"

const [width, height] = [window.innerWidth, window.innerHeight]

const viewport = new Viewport({ width: 100, height: 100 * height / width }, 1)
// const camera = new Camera({ position: new Vector3(3, 0, 1) })
// camera.rotateY(-45)

// const sphere1 = new Sphere({
//     position: new Vector3(0, -1, 3),
//     radius: 1,
//     color: new Color(255, 0, 0),
//     specular: 200,
//     reflective: 0.2,
// })
// const sphere2 = new Sphere({
//     position: new Vector3(2, 0, 4),
//     radius: 1,
//     color: new Color(0, 0, 255),
//     specular: 500,
//     reflective: 0.3
// })
// const sphere3 = new Sphere({
//     position: new Vector3(-2, 0, 4),
//     radius: 1,
//     color: new Color(0, 255, 0),
//     specular: 0,
//     reflective: 0.4
// })
// const sphere4 = new Sphere({
//     position: new Vector3(0, -5001, 0),
//     radius: 5000,
//     color: new Color(255, 255, 0),
//     specular: 1000,
//     reflective: 0.5
// })
//
// const ambientLight = new AmbientLight({ intensity: 0.2 })
// const pointLight = new PointLight({
//     position: new Vector3(2, 1, 0),
//     intensity: 0.6
// })
// const directionalLight = new DirectionalLight({
//     direction: new Vector3(1, 4, 4),
//     intensity: 0.2
// })
//
// const scene = new Scene()
// scene.add(sphere1)
// scene.add(sphere2)
// scene.add(sphere3)
// scene.add(sphere4)
// scene.add(ambientLight)
// scene.add(pointLight)
// scene.add(directionalLight)

const canvas = new Canvas('#canvas', {
    width,
    height,
    backroundColor: new Color(255, 255, 255),
    viewport
})

// The four "front" vertices
const vAf = new Vector3(-1,  1, 1)
const vBf = new Vector3( 1,  1, 1)
const vCf = new Vector3( 1, -1, 1)
const vDf = new Vector3(-1, -1, 1)

// The four "back" vertices

const vAb = new Vector3(-1,  1, 2)
const vBb = new Vector3( 1,  1, 2)
const vCb = new Vector3( 1, -1, 2)
const vDb = new Vector3(-1, -1, 2)

const blue = new Color(0, 0, 200)
const red = new Color(200, 0, 0)
const green = new Color(0, 200, 0)

// The front face
canvas.drawLine(canvas.projectVertex(vAf), canvas.projectVertex(vBf), blue)
canvas.drawLine(canvas.projectVertex(vBf), canvas.projectVertex(vCf), blue)
canvas.drawLine(canvas.projectVertex(vCf), canvas.projectVertex(vDf), blue)
canvas.drawLine(canvas.projectVertex(vDf), canvas.projectVertex(vAf), blue)

// The back face
canvas.drawLine(canvas.projectVertex(vAb), canvas.projectVertex(vBb), red)
canvas.drawLine(canvas.projectVertex(vBb), canvas.projectVertex(vCb), red)
canvas.drawLine(canvas.projectVertex(vCb), canvas.projectVertex(vDb), red)
canvas.drawLine(canvas.projectVertex(vDb), canvas.projectVertex(vAb), red)

// The front-to-back edges
canvas.drawLine(canvas.projectVertex(vAf), canvas.projectVertex(vAb), green)
canvas.drawLine(canvas.projectVertex(vBf), canvas.projectVertex(vBb), green)
canvas.drawLine(canvas.projectVertex(vCf), canvas.projectVertex(vCb), green)
canvas.drawLine(canvas.projectVertex(vDf), canvas.projectVertex(vDb), green)

// canvas.drawLine(new Vector2(-200, -100), new Vector2(240, 120), new Color())
// canvas.drawLine(new Vector2(-50, -200), new Vector2(60, 240), new Color())

// canvas.drawFilledTriangle(
//     new Vector3(-200, -250, 1),
//     new Vector3(200, 50, 0),
//     new Vector3(20, 250, 1),
//     new Color(0, 200, 70)
// )
//
// canvas.drawWireframeTriangle(
//     new Vector2(-200, -250),
//     new Vector2(200, 50),
//     new Vector2(20, 250),
// )

// canvas.rayTrace({
//     camera,
//     scene,
//     intersectionMin: viewport.distanceToCamera,
//     intersectionMax: 100,
//     recursionDepth: 3
// })

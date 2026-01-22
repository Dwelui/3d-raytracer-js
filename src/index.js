import Canvas from "./Canvas.js"
import Color from "./math/Color.js"
import Vector3 from "./math/Vector3.js"
import AmbientLight from "./object/AmbientLight.js"
import Camera from "./object/Camera.js"
import DirectionalLight from "./object/DirectionalLight.js"
import PointLight from "./object/PointLight.js"
import Scene from "./object/Scene.js"
import Sphere from "./object/Sphere.js"
import RayTracer from "./RayTracer.js"
import Viewport from "./Viewport.js"

const viewport = new Viewport({ width: 1, height: 1 }, 1)
const camera = new Camera(new Vector3())

const sphere1 = new Sphere(new Vector3(0, -1, 3), 1, new Color(255, 0, 0))
const sphere2 = new Sphere(new Vector3(2, 0, 4), 1, new Color(0, 0, 255))
const sphere3 = new Sphere(new Vector3(-2, 0, 4), 1, new Color(0, 255, 0))
const sphere4 = new Sphere(new Vector3(0, -5001, 0), 5000, new Color(255, 255, 0))

const ambientLight = new AmbientLight(0.2)
const pointLight = new PointLight(new Vector3(2, 1, 0), 0.6)
const directionalLight = new DirectionalLight(new Vector3(1, 4, 4), 0.2)

const scene = new Scene()
scene.add(sphere1)
scene.add(sphere2)
scene.add(sphere3)
scene.add(sphere4)
scene.add(ambientLight)
scene.add(pointLight)
scene.add(directionalLight)

const canvas = new Canvas('#canvas', {
    width: 500,
    height: 500,
    backroundColor: new Color(255, 255, 255),
    rayTraceDrawMode: Canvas.RayTraceDrawMode.SLOW
})

const rayTracer = new RayTracer(camera, scene, viewport.distanceToCamera, 100)
canvas.rayTrace(viewport, rayTracer)

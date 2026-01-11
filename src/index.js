import Canvas from "./Canvas.js"
import Color from "./math/Color.js"
import Vector3 from "./math/Vector3.js"
import Camera from "./object/Camera.js"
import Scene from "./object/Scene.js"
import Sphere from "./object/Sphere.js"
import RayTracer from "./RayTracer.js"
import Viewport from "./Viewport.js"

const viewport = new Viewport({ width: 1, height: 1 }, 1)
const camera = new Camera(new Vector3())

const sphere1 = new Sphere(new Vector3(0, -1, 3), 1, new Color(255, 0, 0))
const sphere2 = new Sphere(new Vector3(2, 0, 4), 1, new Color(0, 0, 255))
const sphere3 = new Sphere(new Vector3(-2, 0, 4), 1, new Color(0, 255, 0))

const scene = new Scene()
scene.add(sphere1)
scene.add(sphere2)
scene.add(sphere3)

const rayTracer = new RayTracer(camera, scene, viewport.distanceToCamera, 100)

const canvas = new Canvas('#canvas', { width: 500, height: 500, backroundColor: new Color(255, 255, 255) })
canvas.rayTrace(viewport, rayTracer)

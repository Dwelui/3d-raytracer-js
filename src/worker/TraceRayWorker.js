import { assertNumbers, assertObjects } from "../Assert.js"
import Vector3 from "../math/Vector3.js"
import Scene from "../object/Scene.js"
import RayTracer from "../RayTracer.js"

onmessage = (ev) => {
    /**
    * @type {{
    *   sceneJSON: any,
    *   startingPointJSON: any,
    *   rayDirectionJSON: any,
    *   intersectionMin: number,
    *   intersectionMax: number,
    *   recursionDepth: number
    * }} data
    */
    const { sceneJSON, startingPointJSON, rayDirectionJSON, intersectionMin, intersectionMax, recursionDepth } = ev.data

    assertObjects({ sceneJSON, startingPointJSON, rayDirectionJSON })
    assertNumbers({ intersectionMin, intersectionMax, recursionDepth })

    const scene = Scene.fromJSON(sceneJSON)
    const rayTracer = new RayTracer(scene)
    const color = rayTracer.traceRay(
        Vector3.fromJSON(startingPointJSON),
        Vector3.fromJSON(rayDirectionJSON),
        intersectionMin,
        intersectionMax,
        recursionDepth
    )

    postMessage(color ? color.toJSON() : color)
}

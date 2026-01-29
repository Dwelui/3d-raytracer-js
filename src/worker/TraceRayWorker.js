import { assertObjects } from "../Assert.js"
import Scene from "../object/Scene.js"

onmessage = (e) => {
    const sceneJSON = e.data
    assertObjects({ sceneJSON })

    const scene = Scene.fromJSON(sceneJSON)

    console.log(scene)

    postMessage('test')
}

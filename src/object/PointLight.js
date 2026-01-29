import Matrix3 from "../math/Matrix3.js"
import Vector3 from "../math/Vector3.js"
import Light from "./Light.js"

export default class PointLight extends Light {
    /** @type {string} */ type = "PointLight"

    /**
    * @param {{
    *   Position: Object,
    *   Rotation: Array<number> | Array<Vector3> | undefined
    *   Intensity: number
    * }} abject
    */
    static fromJSON({ Position, Rotation, Intensity }) {
        return new PointLight({
            position: Vector3.fromJSON(Position),
            rotation: Matrix3.fromJSON(Rotation),
            intensity: Intensity
        })
    }
}

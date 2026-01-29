import Matrix3 from "../math/Matrix3.js"
import Vector3 from "../math/Vector3.js"
import Light from "./Light.js"

export default class AmbientLight extends Light {
    /** @type {string} */ type = "AmbientLight"

    /**
    * @param {object} args
    * @param {number} args.intensity - Must be between 0 and 1.
    */
    constructor({intensity}) {
        super({ position: new Vector3(), intensity })
    }

    /**
    * @param {{
    *   Position: Object,
    *   Rotation: Array<number> | Array<Vector3> | undefined
    *   Intensity: number
    * }} abject
    */
    static fromJSON({ Position, Rotation, Intensity }) {
        return new AmbientLight({
            position: Vector3.fromJSON(Position),
            rotation: Matrix3.fromJSON(Rotation),
            intensity: Intensity
        })
    }
}

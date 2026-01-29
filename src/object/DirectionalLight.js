import Matrix3 from "../math/Matrix3.js";
import Vector3 from "../math/Vector3.js";
import Light from "./Light.js"

export default class DirectionalLight extends Light {
    /** @type {string} */ type = "DirectionalLight"

    /**
    * @param {Object} args
    * @param {Vector3} args.direction
    * @param {number} args.intensity - Must be between 0 and 1.
    */
    constructor({direction, intensity}) {
        super({position: direction, intensity})
    }

    set direction(direction) { this.position = direction }
    get direction() { return this.position }

    /**
    * @param {{
    *   Position: Object,
    *   Rotation: Array<number> | Array<Vector3> | undefined
    *   Intensity: number
    * }} abject
    */
    static fromJSON({ Position, Rotation, Intensity }) {
        return new DirectionalLight({
            direction: Vector3.fromJSON(Position),
            rotation: Matrix3.fromJSON(Rotation),
            intensity: Intensity
        })
    }
}

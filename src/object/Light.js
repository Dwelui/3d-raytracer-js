import { assertNumbersBetween } from "../Assert.js"
import Matrix3 from "../math/Matrix3.js"
import Vector3 from "../math/Vector3.js"
import Object3D from "./Object3D.js"

export default class Light extends Object3D {
    /** @type {string} */ type = "Light"

    /** @type{number} */ #intensity

    /**
    * @param {Object} args
    * @param {Vector3} args.position
    * @param {number} args.intensity - Must be between 0 and 1.
    */
    constructor({position, intensity}) {
        super({ position })

        this.intensity = intensity
    }

    get intensity() { return this.#intensity }
    set intensity(intensity) { assertNumbersBetween({intensity}, 0, 1); this.#intensity = intensity }

    toJSON() {
        return {
            ...super.toJSON(),
            Intensity: this.intensity
        }
    }

    /**
    * @param {{
    *   Position: Object,
    *   Rotation: Array<number> | Array<Vector3> | undefined
    *   Intensity: number
    * }} abject
    */
    static fromJSON({ Position, Rotation, Intensity }) {
        return new Light({
            position: Vector3.fromJSON(Position),
            rotation: Matrix3.fromJSON(Rotation),
            intensity: Intensity
        })
    }
}

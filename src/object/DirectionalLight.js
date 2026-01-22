import Vector3 from "../math/Vector3.js";
import Light from "./Light.js"

export default class DirectionalLight extends Light {

    /**
    * @param {Vector3} direction
    * @param {number} intensity - Must be between 0 and 1.
    */
    constructor(direction, intensity) {
        super(direction, intensity)
    }

    set direction(direction) { this.position = direction }
    get direction() { return this.position }
}

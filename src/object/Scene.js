import { assertInstancesMapped, assertInstancesNullable } from "../Assert.js"
import Vector3 from "../math/Vector3.js"
import Object3D from "./Object3D.js"
import Sphere from "./Sphere.js"

export default class Scene extends Object3D {
    /** @type{Array<Object3D>} */ #objects = []

    /**
    * @param {Object} [args]
    * @param {Vector3} [args.position]
    */
    constructor({ position } = {}) {
        position = position ?? new Vector3()

        assertInstancesNullable({ position }, Vector3)

        super({ position })
    }

    get objects() { return this.#objects }

    /** @param {Object3D} object3D */
    add(object3D) { assertInstancesMapped({ object3D }); this.#objects.push(object3D) }

    toJSON() {
        return {
            ...super.toJSON(),
            Objects3D: this.#objects.map(object => object.toJSON())
        }
    }

    /**
    * @param {{
    *   Position: Object,
    *   Rotation: Array<number> | Array<Vector3> | undefined
    *   Objects3D: Array<any> | undefined
    * }} abject
    */
    static fromJSON({ Position, Objects3D }) {
        const scene = new Scene({
            position: Vector3.fromJSON(Position)
        })

        if (Objects3D) {
            for (const objectJSON of Objects3D) {
                console.log(objectJSON)
                if (objectJSON.type === "Sphere") {
                    scene.add(Sphere.fromJSON(objectJSON))
                }
            }
        }

        return scene
    }
}

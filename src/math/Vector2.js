export default class Vector2 {
    /** @type{number} */ x
    /** @type{number} */ y

    constructor(x = 0, y = 0) {
        this.x = x
        this.y = y
    }

    toArray() { return [this.x, this.y] }
}

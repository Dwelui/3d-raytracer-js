export function assertInstance(value, targetInstance, name) {
    if (!(value instanceof targetInstance)) {
        throw new TypeError(`Parameter '${name}' is not ${targetInstance.name}`)
    }
}

export function assertPositiveNumber(value, name) {
    if (typeof value !== 'number') {
        throw new TypeError(`Parameter '${name}' is not number`)
    }

    if (value <= 0) {
        throw new RangeError(`Parameter '${name}' must be positive`)
    }
}


/* size_handle.js */

import { Handle } from './handle.js'

export class SizeHandle extends Handle {
    constructor(properties) {
        super(properties)
    }

    getRotation() {
        return 0
    }
}

export function create(properties) {
    return new SizeHandle(properties)
}
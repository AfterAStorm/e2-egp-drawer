
/* handle.js */

//import { Object, toRadians } from './object.js'
import { Rectangle } from './rectangle.js'

export class Handle extends Rectangle {

    #visible = false

    constructor(properties) {
        //properties.x = properties.width / 2 //-- before getX fix with this.width / 2
        //properties.y = properties.height / 2
        super(properties)
    }

    /*setX(x) {
        super.setX(x + this.getWidth() / 2)
    }

    setY(y) {
        super.setY(y + this.getHeight() / 2)
    }*/

    getVisible() {
        return this.#visible
    }

    setVisible(visible) {
        this.#visible = visible
    }

    draw(ctx) {
        if (this.#visible)
            super.draw(ctx)
    }
}

export function create(properties) {
    return new Handle(properties)
}
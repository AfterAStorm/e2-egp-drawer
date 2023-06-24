
/* box.js */

import { Object, toRadians } from './object.js'

export class Rectangle extends Object {
    constructor(properties) {
        super(properties)
    }

    draw(drawer) {
        const x = this.getX()
        const y = this.getY()
        const width = this.getWidth()
        const height = this.getHeight()
        const rotation = this.getRotation()

        const needsRotation = (this.getWidth() != this.getHeight() || rotation % 90 != 0) // if its a cube and its rotation is 0, 90, 180, or 270, then ignore it!
        drawer.fillStyle = this.getColor()
        
        if (needsRotation) {
            /*if (this.getParent() != null) {
                drawer.translate(this.getParent().getX(), this.getParent().getY())//x + width / 2, y + height / 2) // move pivot to center of the shape
                drawer.rotate(-toRadians(rotation)) // rotate
                drawer.translate(-this.getParent().getX(), -this.getParent().getY())//-(x + width / 2), -(y + height / 2)) // move the pivot back
            }
            else {
                drawer.translate(x + width / 2, y + height / 2) // move pivot to center of the shape
                drawer.rotate(-toRadians(rotation)) // rotate
                drawer.translate(-(x + width / 2), -(y + height / 2)) // move the pivot back
            }*/
            drawer.translate(x + width / 2, y + height / 2) // move pivot to center of the shape
            drawer.rotate(-toRadians(rotation)) // rotate
            drawer.translate(-(x + width / 2), -(y + height / 2)) // move the pivot back
        }

        drawer.fillRect(x, y, width, height) // draw the rectangle

        if (needsRotation)
            drawer.resetTransform() // reset transform for other shapes
    }

    inBounds(boundX, boundY) { // TODO: rotation, only "detects" default rotation of zero
        const x = this.getX()
        const y = this.getY()

        return  boundX >= x &&
                boundX <= x + this.getWidth() &&
                boundY >= y &&
                boundY <= y + this.getHeight()
    }
}

export function create(properties) {
    return new Rectangle(properties)
}
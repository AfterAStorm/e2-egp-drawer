
/* rotation_handle.js */

import { toRadians } from './object.js'
import { Handle } from './handle.js'

export class RotationHandle extends Handle {
    constructor(properties) {
        super(properties)
    }

    draw(ctx) {
        if (this.getVisible()) {
            const x = this.getX()
            const y = this.getY()
            const width = this.getWidth()
            const height = this.getHeight()
            const rotation = this.getRotation()

            const translateX = Math.sin(toRadians(rotation)) * (this.getParent().getWidth() / 2 + 20)
            const translateY = Math.cos(toRadians(rotation)) * (this.getParent().getHeight() / 2 + 20)

            ctx.fillStyle = this.getColor()
            ctx.translate(translateX, translateY)
            //super.draw(ctx)

            ctx.translate(x + width / 2, y + height / 2) // move pivot to center of the shape
            ctx.rotate(-toRadians(rotation)) // rotate
            ctx.translate(-(x + width / 2), -(y + height / 2)) // move the pivot back
            ctx.fillRect(x, y, width, height) // draw the rectangle
            const lineWidth = 3
            const lineHeight = 20 - this.getHeight() / 2//this.getParent().getHeight() / 2 - this.getHeight() / 2
            ctx.fillRect(
                x + this.getWidth() / 2 - lineWidth / 2,
                y - lineHeight,//y + lineHeight + height - (rotation % 90 == 0 ? lineHeight * 2 + height : 0),
                lineWidth,
                lineHeight) // draw the rectangle
            
            ctx.translate(-translateX, -translateY)
        }
        ctx.resetTransform() // reset transform for other shapes
    }

    inBounds(boundsX, boundsY, ctx) {
        let x = this.getX()
        let y = this.getY()
        
    }
}

export function create(properties) {
    return new RotationHandle(properties)
}
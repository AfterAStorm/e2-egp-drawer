
/* object.js */

const PI = Math.PI

export function toRadians(degrees) {
    return degrees * (PI / 180)
}

export class Object {

    #x = 0 // Coordinates are based on the top left!
    #y = 0
    #width = 0
    #height = 0
    #rotation = 0
    #color = ""
    #parent = null

    constructor(properties) {
        this.#x = properties.x || 0
        this.#y = properties.y || 0
        this.#width = properties.width || 0
        this.#height = properties.height || 0
        this.#rotation = properties.rotation || 0
        this.#color = properties.color || "#ffffff"
        this.#parent = properties.parent || null
    }

    getX() { // gets THIS OBJECT'S x + (if existant) THIS OBJECT'S PARENT's x
        return this.#parent != null ? (this.#parent.getX() + this.#parent.getWidth() / 2 - this.#width / 2) + this.#x : this.#x
    }

    getXSingle() { // gets THIS OBJECT's x
        return this.#x
    }

    setX(x) {
        this.#x = x
    }

    getY() { // gets THIS OBJECT'S y + (if existant) THIS OBJECT'S PARENT's y
        return this.#parent != null ? (this.#parent.getY() + this.#parent.getHeight() / 2 - this.#height / 2) + this.#y : this.#y
    }

    getYSingle() { // gets THIS OBJECT's y
        return this.#y
    }

    setY(y) {
        this.#y = y
    }

    getWidth() { // gets THIS OBJECT's width
        return this.#width
    }

    setWidth(width) {
        this.#width = width
    }

    getHeight() { // gets THIS OBJECT's height
        return this.#height
    }

    setHeight(height) {
        this.#height = height
    }

    getRotation() { // gets THIS OBJECT'S rotation + (if existant) THIS OBJECT'S PARENT's rotation
        return this.#parent != null ? this.#parent.getRotation() + this.#rotation : this.#rotation
    }

    getSingleRotation() { // gets THIS OBJECT's rotation
        return this.#rotation
    }

    setRotation(rotation) {
        if (rotation < 0) {
            rotation = 360 + rotation
        }
        while (rotation > 360) {
            rotation -= 360
        }
        this.#rotation = rotation
    }

    getColor() { // gets THIS OBJECT'S color
        return this.#color
    }

    setColor(color) {
        this.#color = color
    }

    getParent() { // gets THIS OBJECT'S parent
        return this.#parent
    }

    setParent(parent) {
        this.#parent = parent
    }

    draw() {
        throw new Error("Not implemented!")
    }

    drawBoundingBox(ctx) {
        ctx.save() // save state

        let dash = [5, 10]
        ctx.setLineDash(dash) // set line dash
        ctx.lineDashOffset = -(Date.now() / 75 % 15)
        ctx.rect(this.getX(), this.getY(), this.getWidth(), this.getHeight()) // set the bounding box
        ctx.lineWidth = 2
        ctx.strokeStyle = "#ffffffaa"
        ctx.stroke() // draw the border

        ctx.restore() // restore state
    }

    inBounds() {
        throw new Error("Not implemented!")
    }

    toCode() { // {0} is the EGP object or other, {1} is the EGP index
        return [
            `{0}:egpAngle({1}, ${this.#rotation})`//,
            //`{0}:egpColor({1}, ${this.#color})` // need to convert to vec(r, g, b) or vec4(r, g, b, a)
        ]
    }
}
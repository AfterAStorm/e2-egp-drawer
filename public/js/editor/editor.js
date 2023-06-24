
/* editor.js */

/* Imports */
// Modules are just so fun!

import * as constants from './constants.js' 
import { create as createSizeHandle } from './objects/size_handle.js'
import { create as createRotationHandle } from './objects/rotation_handle.js'
import { create as createRectangle } from './objects/rectangle.js'
import { create as createCircle } from './objects/circle.js'
import { toRadians } from './objects/object.js'

/* Document */

const canvas = document.getElementById("editor")
const ctx = canvas.getContext("2d")

if (ctx == null) {
    console.log("Your browser doesn't support canvases!")
    alert("Your browser doesn't support canvases!")
    exit()
}

/* Document Settings/Inputs */

function getCheckboxInput(id) {
    const checkbox = document.getElementById(id)
    console.assert(checkbox != null, "Failed to find checkbox input '" + id + "'!")
    return {
        set(value) {
            checkbox.value = value
        },
        get() {
            return checkbox.checked
        }
    }
}

function getNumberInput(id) {
    const numberi = document.getElementById(id)
    console.assert(numberi != null, "Failed to find number input '" + id + "'!")
    return {
        set(value) {
            numberi.value = value
        },
        get() {
            return parseInt(numberi.value)
        }
    }
}

const objects = {
    Box: createRectangle,
    Circle: createCircle
}

const gridEnabled               = getCheckboxInput  ("OPTION_enableGrid")
const gridLinesEnabled          = getCheckboxInput  ("OPTION_enableGridLines")
const gridSize                  = getNumberInput    ("OPTION_gridSize")
const borderCollisionsEnabled   = getCheckboxInput  ("OPTION_borderCollisions")

/* Screens */

let globalElements = []
let screens = []
let currentScreen = 'main'

function getScreen() { // gets the current screen
    return screens[currentScreen]
}

function createScreen(name) {
    screens[name] = {
        elements: [],
        getElements() {
            return this.elements
        },
        addElement(element) {
            this.elements.push(element)
        }
    }
}
createScreen(currentScreen)

// test //
getScreen().addElement(createRectangle({x: 16, y: 16, width: 16 * 4, height: 16 * 4}))
getScreen().addElement(createRectangle({x: 16 * 6, y: 16, width: 16 * 4, height: 16 * 4, color: "#0000ffaa", rotation: 35}))
getScreen().addElement(createRectangle({x: 16 * 12, y: 16, width: 16 * 5, height: 16 * 4, color: "#ff00ffaa", rotation: 30}))
// end test //

/* Rendering */

ctx.translateRotate = function(x, y, angle) { // pivot x, pivot y, angle (in radians)
    this.translate(x, y)
    this.rotate(angle)
    this.translate(-x, -y)
}

let animationFrame = null

function draw() {
    const screen = getScreen()
    const elements = screen.elements

    ctx.reset()
    ctx.clearRect(0, 0, canvas.width, canvas.height) // clear the canvas
    for (let i = 0; i < elements.length; i++) { // draw screen elements
        if (i == 1) {
            elements[i].setRotation(elements[i].getRotation() + 1)
        }
        elements[i].draw(ctx)
    }
    for (let i = 0; i < globalElements.length; i++) { // draw global elements
        globalElements[i].draw(ctx)
    }

    if (selectedObject != null) { // draw selected object's bounding box
        selectedObject.drawBoundingBox(ctx)
        // draw width/height
        ctx.fillStyle = "#aaddffaa"
        ctx.font = "10px serif"
        const widthText = selectedObject.getWidth()
        const heightText = selectedObject.getHeight()
        const widthTextMeasure = ctx.measureText(widthText)
        const heightTextMeasure = ctx.measureText(heightText)
        ctx.fillText(widthText, selectedObject.getX() + selectedObject.getWidth() / 2 - widthTextMeasure.width / 2, selectedObject.getY() + 15) // width text

        ctx.translateRotate(selectedObject.getX(), selectedObject.getY() + selectedObject.getHeight() / 2, -toRadians(90)) // rotate 90 degrees
            ctx.fillText(heightText, selectedObject.getX() - heightTextMeasure.width / 2, selectedObject.getY() + selectedObject.getHeight() / 2 + 15) // height text
        ctx.resetTransform() // reset transform!
    }

    if (gridEnabled.get() && gridLinesEnabled.get() && gridSize.get() > 0) { // Draw grid
        ctx.fillStyle = "#aaaaaa"
        let lineWidth = .25
        let counter = 0
        let grid = gridSize.get()
        while (counter < editor.width) { // for when the for loop is sus
            ctx.fillRect(counter - (lineWidth / 2), 0, lineWidth, editor.height)
            counter = counter + grid
        }
        counter = 0
        while (counter < editor.height) {
            ctx.fillRect(0, counter - (lineWidth / 2), editor.width, lineWidth)
            counter += grid
        }
    }
}

function loop() {
    draw()
    animationFrame = window.requestAnimationFrame(loop)
}
animationFrame = window.requestAnimationFrame(loop)

/* Mouse Input */

let selectedObject = null
let handleMode = 'move'

const sizeXLeftHandle = createSizeHandle({width: constants.HANDLE_SIZE, height: constants.HANDLE_SIZE, color: constants.HANDLE_X_COLOR})
const sizeXRightHandle = createSizeHandle({width: constants.HANDLE_SIZE, height: constants.HANDLE_SIZE, color: constants.HANDLE_X_COLOR})
const sizeYTopHandle = createSizeHandle({width: constants.HANDLE_SIZE, height: constants.HANDLE_SIZE, color: constants.HANDLE_Y_COLOR})
const sizeYBottomHandle = createSizeHandle({width: constants.HANDLE_SIZE, height: constants.HANDLE_SIZE, color: constants.HANDLE_Y_COLOR})
const rotationHandle = createRotationHandle({width: constants.HANDLE_SIZE, height: constants.HANDLE_SIZE, color: constants.HANDLE_ROTATE_COLOR})
const handles = [sizeXLeftHandle, sizeXRightHandle, sizeYTopHandle, sizeYBottomHandle, rotationHandle]
handles.forEach((handle) => globalElements.push(handle))

let mouseDown = false
let mouseX, mouseY, mouseStartX, mouseStartY
let objectStartX, objectStartY
let objectStartSizeX, objectStartSizeY

function setMouseXYEvent(e) {
    const clientRect = canvas.getBoundingClientRect()
    mouseX = (e.clientX - clientRect.left) / clientRect.width * canvas.width
    mouseY = (e.clientY - clientRect.top) / clientRect.height * canvas.height
}

function findObjectXY(x, y) {
    const elements = getScreen().elements
    for (let i = elements.length - 1; i > -1; i--) {
        const element = elements[i]
        if (element.inBounds(x, y)) {
            return element
        }
    }
}

function updateHandles(setVariables) {
    handles.forEach((obj) => {
        obj.setVisible(selectedObject != null)
        obj.setParent(selectedObject != null ? selectedObject : null)
    })
    rotationHandle.setVisible(false)
    if (selectedObject != null) {
        if (setVariables) {
            objectStartX = selectedObject.getX()
            objectStartY = selectedObject.getY()
            objectStartSizeX = selectedObject.getWidth()
            objectStartSizeY = selectedObject.getHeight()
        }
        sizeXLeftHandle.setX(-selectedObject.getWidth() / 2)
        sizeXRightHandle.setX(selectedObject.getWidth() / 2)
        sizeYTopHandle.setY(-selectedObject.getHeight() / 2)
        sizeYBottomHandle.setY(selectedObject.getHeight() / 2)
        //rotationHandle.setY(-selectedObject.getHeight() / 2 - 20)
    }
}

// Events

function canvasMouseDown(e) {
    setMouseXYEvent(e)
    mouseDown = true
    mouseStartX = mouseX
    mouseStartY = mouseY
    if (selectedObject == null) { // find objects that the user might be clicking on
        selectedObject = findObjectXY(mouseX, mouseY)
        console.log("selectedObject:")
        console.log(selectedObject)
    }
    else { // check if they are clicking on resize handles
        if (sizeXLeftHandle.inBounds(mouseX, mouseY)) {
            handleMode = 'resizeX-'
        }
        else if (sizeXRightHandle.inBounds(mouseX, mouseY)) {
            handleMode = 'resizeX+'
        }
        else if (sizeYTopHandle.inBounds(mouseX, mouseY)) {
            handleMode = 'resizeY-'
        }
        else if (sizeYBottomHandle.inBounds(mouseX, mouseY)) {
            handleMode = 'resizeY+'
        }
        else if (rotationHandle.inBounds(mouseX, mouseY, ctx)) {
            handleMode = 'rotate'
        }
        else if (!selectedObject.inBounds(mouseX, mouseY)) {
            selectedObject = findObjectXY(mouseX, mouseY)
            console.log("new selectedObject:")
            console.log(selectedObject)
        }
        else {
            handleMode = 'move'
        }
    }

    // move side handles/setup side handles
    updateHandles(true)
}

function canvasMouseUp(e) {
    mouseDown = false
}

function canvasMouseMove(e) {
    if (!mouseDown) return
    setMouseXYEvent(e)

    // handling moving selected
    if (selectedObject != null) {
        const grid = gridEnabled.get() ? gridSize.get() : 0
        const deltaX = mouseX - mouseStartX
        const deltaY = mouseY - mouseStartY

        if (handleMode == 'move') {
            if (grid > 0) { // snap to grid
                selectedObject.setX(Math.round((objectStartX + deltaX) / grid) * grid)
                selectedObject.setY(Math.round((objectStartY + deltaY) / grid) * grid)
            }
            else { // freeform
                selectedObject.setX(objectStartX + deltaX)
                selectedObject.setY(objectStartY + deltaY)
            }

            // do some basic border collision detection if there isnt a parent
            if (borderCollisionsEnabled.get() && selectedObject.getParent() == null) {
                const x = selectedObject.getX()
                const y = selectedObject.getY()
                const width = selectedObject.getWidth()
                const height = selectedObject.getHeight()
                selectedObject.setX(x >= 0 ? (x > canvas.width - width ? canvas.width - width : x) : 0)
                selectedObject.setY(y >= 0 ? (y > canvas.height - height ? canvas.height - height : y) : 0)
            }
        }
        else if (handleMode == 'rotate') {
            // TOOD: rotation handle
        }
        else if (handleMode.includes("resize")) {
            if (handleMode.includes("X-")) {
                selectedObject.setX(objectStartX + deltaX)
                selectedObject.setWidth(objectStartSizeX - deltaX)
            }
            if (handleMode.includes("X+")) {
                selectedObject.setX(objectStartX)
                selectedObject.setWidth(objectStartSizeX + deltaX)
            }
            if (handleMode.includes("Y-")) {
                selectedObject.setY(objectStartY + deltaY)
                selectedObject.setHeight(objectStartSizeY - deltaY)
            }
            if (handleMode.includes("Y+")) {
                selectedObject.setY(objectStartY)
                selectedObject.setHeight(objectStartSizeY + deltaY)
            }

            if (selectedObject.getWidth() < 0) selectedObject.setWidth(0.1)
            if (selectedObject.getHeight() < 0) selectedObject.setHeight(0.1)
            if (grid > 0) { // if grid enabled, snap to it!
                selectedObject.setX(Math.round(selectedObject.getX() / grid) * grid)
                selectedObject.setY(Math.round(selectedObject.getY() / grid) * grid)
                selectedObject.setWidth(Math.round(selectedObject.getWidth() / grid) * grid)
                selectedObject.setHeight(Math.round(selectedObject.getHeight() / grid) * grid)
            }
            updateHandles(false)
        }
    }
}

canvas.addEventListener('mousedown', canvasMouseDown)
canvas.addEventListener('mouseup', canvasMouseUp)
canvas.addEventListener('mouseleave', canvasMouseUp)
canvas.addEventListener('mousemove', canvasMouseMove)

/* Keyboard Input */

let keysDown = []

// Events

function keyDown(e) {
    e = e || window.event
    keysDown[e.key] = true
}

function keyUp(e) {
    e = e || window.event
    keysDown[e.key] = false
}

function contextMenu(e) {
    e.preventDefault()
}

document.addEventListener('keydown', keyDown)
document.addEventListener('keyup', keyUp)
editor.addEventListener('contextmenu', contextMenu)
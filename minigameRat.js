function clear() {
    localStorage.setItem('additionalCheese',JSON.stringify(0))
}
let container = document.getElementById('container')
const canvas = document.getElementById('canvContainer')
const ctx = canvas.getContext('2d')
let map = [
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, ],
    [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 9, 9, 0, 0, 0, 0, 4, 9, ],
    [9, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 9, 9, 3, 3, 3, 8, 0, 9, ],
    [9, 0, 0, 3, 3, 3, 3, 3, 3, 0, 0, 7, 0, 0, 9, 9, 3, 0, 3, 3, 0, 9, ],
    [9, 0, 0, 3, 4, 0, 0, 8, 3, 8, 0, 7, 0, 0, 9, 9, 3, 3, 3, 0, 3, 9, ],
    [9, 0, 0, 3, 3, 3, 3, 3, 3, 0, 0, 7, 7, 8, 9, 9, 3, 0, 0, 0, 0, 9, ],
    [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 9, 9, 3, 3, 0, 0, 3, 9, ],
    [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 9, 9, 3, 3, 3, 3, 3, 9, ],
    [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 9, 9, 0, 3, 0, 0, 3, 9, ],
    [9, 0, 5, 5, 5, 5, 5, 5, 0, 0, 0, 2, 0, 0, 9, 9, 0, 3, 3, 0, 3, 9, ],
    [9, 0, 5, 5, 5, 5, 5, 5, 0, 0, 0, 2, 0, 0, 9, 9, 3, 0, 8, 3, 0, 9, ],
    [9, 0, 5, 5, 5, 5, 5, 5, 0, 0, 0, 2, 0, 0, 9, 9, 0, 0, 0, 0, 3, 9, ],
    [9, 0, 5, 5, 5, 5, 5, 5, 0, 0, 3, 3, 3, 3, 9, 9, 0, 0, 0, 0, 0, 9, ],
    [9, 6, 0, 0, 0, 4, 0, 0, 0, 0, 3, 8, 0, 4, 9, 9, 0, 0, 6, 0, 0, 9, ],
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, ],
]
let legal = [
    0, 1, 2, 4, 8, 5, 6
]
let undergroundLegal = [
    2, 3, 7, 8
]
let legalBackup = legal
let colors = [
    "brown", "#5C4033", "#800020", "#8a380f", "yellow", "green", "chocolate", "#e5e5e5", "brown", "black"
]
let moved = false
let curY = 2
let curX = 2
let curOffsetY = 0
let curOffsetX = 0
let displayHeight = 5
let displayWidth = displayHeight*(canvas.width/canvas.height)
let yOffset = 0
let xOffset = 0
let width = canvas.width/displayWidth
let height = canvas.height/displayHeight
let previous = 0
let previousPos = [curY, curX]
let previousOffset = [yOffset, xOffset]
let previousPlayerOffset = [curOffsetY, curOffsetX]
let underground = false
let map2 = false
class Tile {
    constructor(color, top, left) {
        this.color = color
        this.top = top 
        this.left = left
    }
    create() {
        if (underground && this.color === 1) {
            this.color = previous
        }
        ctx.fillStyle = colors[this.color]
        if (this.color === 1) {
            ctx.strokeStyle = "black"
            ctx.lineWidth = width*0.05
            ctx.fillRect((this.left*width)-(xOffset*width)+(width*0.05/2), (this.top*height)-(yOffset*height)+(width*0.05/2), width*0.95, height*0.95)
            ctx.strokeRect((this.left*width)-(xOffset*width)+((width*0.05/2)), (this.top*height)-(yOffset*height)+((width*0.05/2)), width*0.95, height*0.95)
            ctx.fillStyle = "pink"
            ctx.fillRect((this.left*width)+(width*.5)-(xOffset*width)-width*.075, (this.top*height)+(width*.75)-(height*0.05)-(yOffset*height), width*0.15, height*0.1)
            ctx.beginPath()
            ctx.arc((this.left*width)-(xOffset*width)+(width*.25), (this.top*height)-(yOffset*height)+(height*0.25), width*.125, 0, Math.PI, true)
            ctx.fill()
            ctx.stroke()
            ctx.beginPath()
            ctx.arc((this.left*width)-(xOffset*width)+(width*.75), (this.top*height)-(yOffset*height)+(height*0.25), width*.125, 0, Math.PI, true)
            ctx.fill()
            ctx.stroke()
            ctx.fillStyle = "red"
            ctx.fillRect((this.left*width)+(width*.25)-(xOffset*width)-(width*0.05), (this.top*height)+(width*.5)-(height*0.05)-(yOffset*height), width*0.1, height*0.1)
            ctx.fillRect((this.left*width)+(width*.75)-(xOffset*width)-(width*0.05), (this.top*height)+(width*.5)-(height*0.05)-(yOffset*height), width*0.1, height*0.1)
        } else if (this.color === 0 || this.color === 2) {
            if (this.color === 2 && !underground) {
                ctx.fillStyle = colors[0]
            }
            ctx.fillRect((this.left*width)-(xOffset*width), (this.top*height)-(yOffset*height), width, height)
            ctx.fillStyle = "tan"
            ctx.fillRect((this.left*width)-(xOffset*width), (this.top*height)-(yOffset*height), width*0.025, height)
            ctx.fillRect((this.left*width)-(xOffset*width)+(width*0.975), (this.top*height)-(yOffset*height), width*0.025, height)
            ctx.fillRect((this.left*width)-(xOffset*width)+(width*.175), (this.top*height)-(yOffset*height), width*0.05, height)
            ctx.fillRect((this.left*width)-(xOffset*width)+(width*.375), (this.top*height)-(yOffset*height), width*0.05, height)
            ctx.fillRect((this.left*width)-(xOffset*width)+(width*.575), (this.top*height)-(yOffset*height), width*0.05, height)
            ctx.fillRect((this.left*width)-(xOffset*width)+(width*.775), (this.top*height)-(yOffset*height), width*0.05, height)
        } else if (this.color === 3) {
            ctx.fillRect((this.left*width)-(xOffset*width), (this.top*height)-(yOffset*height), width, height)
            ctx.fillStyle = "#964B00"
            ctx.fillRect((this.left*width)-(xOffset*width), (this.top*height)-(yOffset*height), width, height*0.025)
            ctx.fillRect((this.left*width)-(xOffset*width), (this.top*height)-(yOffset*height)+(height*0.975), width, height*0.025)
            ctx.fillRect((this.left*width)-(xOffset*width), (this.top*height)-(yOffset*height)+(height*.175), width, height*0.05)
            ctx.fillRect((this.left*width)-(xOffset*width), (this.top*height)-(yOffset*height)+(height*.375), width, height*0.05)
            ctx.fillRect((this.left*width)-(xOffset*width), (this.top*height)-(yOffset*height)+(height*.575), width, height*0.05)
            ctx.fillRect((this.left*width)-(xOffset*width), (this.top*height)-(yOffset*height)+(height*.775), width, height*0.05)
            ctx.fillStyle = "gray"
            if (map[this.top-1][this.left] != 3 || (map[this.top-1][this.left] === 1 && underground)) {
                ctx.fillRect((this.left*width)-(xOffset*width), (this.top*height)-(yOffset*height), width, height*0.05)
            }
            if (map[this.top+1][this.left] != 3 || (map[this.top+1][this.left] === 1 && underground)) {
                ctx.fillRect((this.left*width)-(xOffset*width), (this.top*height)-(yOffset*height)+(height*0.95), width, height*0.05)
            }
            if (map[this.top][this.left-1] != 3 || (map[this.top][this.left-1] === 1 && underground)) {
                ctx.fillRect((this.left*width)-(xOffset*width), (this.top*height)-(yOffset*height), width*0.05, height)
            }
            if (map[this.top][this.left+1] != 3 || (map[this.top][this.left+1] === 1 && underground)) {
                ctx.fillRect((this.left*width)-(xOffset*width)+(width*0.95), (this.top*height)-(yOffset*height), width*0.05, height)
            }
            if (map[this.top-1][this.left-1] != 3) {
                ctx.fillRect((this.left*width)-(xOffset*width), (this.top*height)-(yOffset*height), width*0.05, height*0.05)
            }
            if (map[this.top-1][this.left+1] != 3) {
                ctx.fillRect((this.left*width)-(xOffset*width)+(width*0.95), (this.top*height)-(yOffset*height), width*0.05, height*0.05)
            }
            if (map[this.top+1][this.left-1] != 3) {
                ctx.fillRect((this.left*width)-(xOffset*width), (this.top*height)-(yOffset*height)+(height*0.95), width*0.05, height*0.05)
            }
            if (map[this.top+1][this.left+1] != 3) {
                ctx.fillRect((this.left*width)-(xOffset*width)+(width*0.95), (this.top*height)-(yOffset*height)+(height*0.95), width*0.05, height*0.05)
            }
        } else if (this.color === 8) {
            ctx.fillRect((this.left*width)-(xOffset*width), (this.top*height)-(yOffset*height), width, height)
            ctx.fillStyle = "tan"
            ctx.fillRect((this.left*width)-(xOffset*width), (this.top*height)-(yOffset*height), width*0.025, height)
            ctx.fillRect((this.left*width)-(xOffset*width)+(width*0.975), (this.top*height)-(yOffset*height), width*0.025, height)
            ctx.fillRect((this.left*width)-(xOffset*width)+(width*.175), (this.top*height)-(yOffset*height), width*0.05, height)
            ctx.fillRect((this.left*width)-(xOffset*width)+(width*.375), (this.top*height)-(yOffset*height), width*0.05, height)
            ctx.fillRect((this.left*width)-(xOffset*width)+(width*.575), (this.top*height)-(yOffset*height), width*0.05, height)
            ctx.fillRect((this.left*width)-(xOffset*width)+(width*.775), (this.top*height)-(yOffset*height), width*0.05, height)
            ctx.fillStyle = "black"
            ctx.fillRect((this.left*width)-(xOffset*width)+(width*0.3), (this.top*height)-(yOffset*height)+(height*0.3), width*0.4, height*0.4)
        } else if (this.color === 7) {
            ctx.fillRect((this.left*width)-(xOffset*width), (this.top*height)-(yOffset*height), width, height)
            ctx.fillStyle = "black"
            if (map[this.top-1][this.left] != 7 || (map[this.top-1][this.left] === 1 && underground)) {
                ctx.fillRect((this.left*width)-(xOffset*width), (this.top*height)-(yOffset*height), width, height*0.05)
            }
            if (map[this.top+1][this.left] != 7 || (map[this.top+1][this.left] === 1 && underground)) {
                ctx.fillRect((this.left*width)-(xOffset*width), (this.top*height)-(yOffset*height)+(height*0.95), width, height*0.05)
            }
            if (map[this.top][this.left-1] != 7 || (map[this.top][this.left-1] === 1 && underground)) {
                ctx.fillRect((this.left*width)-(xOffset*width), (this.top*height)-(yOffset*height), width*0.05, height)
            }
            if (map[this.top][this.left+1] != 7 || (map[this.top][this.left+1] === 1 && underground)) {
                ctx.fillRect((this.left*width)-(xOffset*width)+(width*0.95), (this.top*height)-(yOffset*height), width*0.05, height)
            }
            if (map[this.top-1][this.left-1] != 7) {
                ctx.fillRect((this.left*width)-(xOffset*width), (this.top*height)-(yOffset*height), width*0.05, height*0.05)
            }
            if (map[this.top-1][this.left+1] != 7) {
                ctx.fillRect((this.left*width)-(xOffset*width)+(width*0.95), (this.top*height)-(yOffset*height), width*0.05, height*0.05)
            }
            if (map[this.top+1][this.left-1] != 7) {
                ctx.fillRect((this.left*width)-(xOffset*width), (this.top*height)-(yOffset*height)+(height*0.95), width*0.05, height*0.05)
            }
            if (map[this.top+1][this.left+1] != 7) {
                ctx.fillRect((this.left*width)-(xOffset*width)+(width*0.95), (this.top*height)-(yOffset*height)+(height*0.95), width*0.05, height*0.05)
            }
        } else if (this.color === 5) {
            ctx.fillRect((this.left*width)-(xOffset*width), (this.top*height)-(yOffset*height), width, height)
            ctx.fillStyle = "black"
            if (map[this.top-1][this.left] != 5) {
                ctx.fillRect((this.left*width)-(xOffset*width), (this.top*height)-(yOffset*height), width, height*0.05)
            }
            if (map[this.top+1][this.left] != 5) {
                ctx.fillRect((this.left*width)-(xOffset*width), (this.top*height)-(yOffset*height)+(height*0.95), width, height*0.05)
            }
            if (map[this.top][this.left-1] != 5) {
                ctx.fillRect((this.left*width)-(xOffset*width), (this.top*height)-(yOffset*height), width*0.05, height)
            }
            if (map[this.top][this.left+1] != 5) {
                ctx.fillRect((this.left*width)-(xOffset*width)+(width*0.95), (this.top*height)-(yOffset*height), width*0.05, height)
            }
            if (map[this.top-1][this.left-1] != 5) {
                ctx.fillRect((this.left*width)-(xOffset*width), (this.top*height)-(yOffset*height), width*0.05, height*0.05)
            }
            if (map[this.top-1][this.left+1] != 5) {
                ctx.fillRect((this.left*width)-(xOffset*width)+(width*0.95), (this.top*height)-(yOffset*height), width*0.05, height*0.05)
            }
            if (map[this.top+1][this.left-1] != 5) {
                ctx.fillRect((this.left*width)-(xOffset*width), (this.top*height)-(yOffset*height)+(height*0.95), width*0.05, height*0.05)
            }
            if (map[this.top+1][this.left+1] != 5) {
                ctx.fillRect((this.left*width)-(xOffset*width)+(width*0.95), (this.top*height)-(yOffset*height)+(height*0.95), width*0.05, height*0.05)
            }
        } else {
            ctx.fillRect((this.left*width)-(xOffset*width), (this.top*height)-(yOffset*height), width, height)
        }
        if (underground && map[this.top][this.left] === 1) {
            ctx.lineWidth = width*0.05
            ctx.strokeStyle = "white"
            ctx.strokeRect((this.left*width)-(xOffset*width)+((width*0.05/2)), (this.top*height)-(yOffset*height)+((width*0.05/2)), width*0.95, height*0.95)
        }
    }
}
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    let topOffset = yOffset
    let length = map.length
    let displayY = displayHeight
    for (var y = 0 + topOffset; y < displayY + topOffset; y++) {
        let leftOffset = xOffset
        let length2 = map[y].length
        let displayX = displayWidth
        for (var x = 0 + leftOffset; x < displayWidth + leftOffset; x++) {
            const el = new Tile(map[y][x], y, x)
            el.create()
        }
    }
}
function register() {
    window.addEventListener("keydown", (e) => {
        move(e)
    })
}
function move(e) {
    let code = e.code
    let prevPrevious = previous
    previousPos[0] = curY
    previousPos[1] = curX
    previousOffset[0] = yOffset
    previousOffset[1] = xOffset
    previousPlayerOffset[0] = curOffsetY
    previousPlayerOffset[1] = curOffsetX
    if (code == 'KeyW') {
        if (legal.includes(map[curY-1][curX])) {
            curY -= 1
            map[curY+1][curX] = previous
            previous = map[curY][curX]
            map[curY][curX] = 1
            if (yOffset > 0) {
                if (curOffsetY > 0) {
                    curOffsetY -= 1
                } else {
                   yOffset -= 1
                }
            } else {
                curOffsetY -= 1
            }
            moved = true
        }
    } else if (code == 'KeyS') {
        if (legal.includes(map[curY+1][curX])) {
            curY += 1
            map[curY-1][curX] = previous
            previous = map[curY][curX]
            map[curY][curX] = 1
            if (yOffset < map.length - displayHeight) {
                if (curOffsetY < 0) {
                    curOffsetY += 1
                } else {
                    yOffset += 1
                }
            } else {
                curOffsetY += 1
            }
            moved = true
        }
    } else if (code == 'KeyA') {
        if (legal.includes(map[curY][curX-1])) {
            curX -= 1
            map[curY][curX+1] = previous
            previous = map[curY][curX]
            map[curY][curX] = 1
            if (xOffset > 0) {
                if (curOffsetX > 0) {
                    curOffsetX -= 1
                } else {
                   xOffset -= 1
                }
            } else {
                curOffsetX -= 1
            }
            moved = true
        }
    } else if (code == 'KeyD') {
        if (legal.includes(map[curY][curX+1])) {
            curX += 1
            map[curY][curX-1] = previous
            previous = map[curY][curX]
            map[curY][curX] = 1
            if (xOffset < map[0].length - displayHeight) {
                if (curOffsetX < 0) {
                    curOffsetX += 1
                } else {
                    xOffset += 1
                }
            } else {
                curOffsetX += 1
            }
            moved = true
        }
    }
    if (previous === 4) {
        previous = 0
        let additionalTotal = JSON.parse(localStorage.getItem('additionalCheese'))
        additionalTotal += 2500
        localStorage.setItem('additionalCheese',JSON.stringify(additionalTotal))
    }
    if (previous === 8 && code == 'Enter' && !moved) {
        if (underground) {
            legal = legalBackup
        } else {
            legal = undergroundLegal
        }
        underground = !underground
    }
    if (previous === 6 && code == 'Enter' && !moved) {
        if (map2) {
            map[curY][curX] = previous
            map[curY][curX - 17] = 1
            xOffset -= 16
            map2 = !map2
            curX -= 17
            curOffsetX = -1
        } else {
            map[curY][curX] = previous
            map[curY][curX + 17] = 1
            xOffset += 16
            map2 = !map2
            curX += 17
            curOffsetX = 0
        }
        let prevPrevious = previous
    }
    if (moved) {
        moved = false
    }
    render()
}
render()
register()
const canvas = document.getElementById('canvas')
        const ctx = canvas.getContext('2d')
        let started = false
        let simulated = false
        let runFullDuration = true
        let autoRun = true
        let size = 5
        let map = []
        let totalOrganisms = 128
        let genesPerOrganism = 3
        let movesPerOrganism = 1
        let turns = 0
        let totalTurns = 100
        let turnsUntilDeath = 50
        let baseTurnsUntilDeath = turnsUntilDeath
        let allowKilling = false
        let allowMutations = true
        let mutationChance = 1000
        let currentSelection = [
            "left"
        ]
        let concentration = (canvas.height / size) * (canvas.width / size) / totalOrganisms
        let colors = [
            "red", "orange", "yellow", "green", "blue", "purple", "brown", "white", "gray", "yellowgreen", "cyan", "pink"
        ]
        let shapes = [
            "square", /*"triangle", "circle"*/
        ]
        let shapeDrawings = {
            square: function(y, x, color) {
                ctx.fillStyle = color
                ctx.fillRect(x * size, y * size, size, size)
            },
            triangle: function(y, x, color) {
                ctx.fillStyle = "black"
                ctx.fillRect(x * size, y * size, size, size)
                ctx.fillStyle = color
                ctx.beginPath()
                ctx.moveTo(x * size + size / 2, y * size)
                ctx.lineTo(x * size + size, y * size + size)
                ctx.lineTo(x * size, y * size + size)
                ctx.fill()
                ctx.closePath()
            },
            circle: function(y, x, color) {
                ctx.fillStyle = "black"
                ctx.fillRect(x * size, y * size, size, size)
                ctx.fillStyle = color
                ctx.beginPath()
                ctx.arc(x * size + size / 2, y * size + size / 2, size / 2, 0, 2 * Math.PI, false)
                ctx.fill()
                ctx.closePath()
            }

        }
        let speeds = [
            1, 1, 1, 1, 1, 1, 2, 2, 2, 3
        ]
        let selections = {
            left: function(y, x) {
                if (x <= map[0].length / 2) {
                    return(true)
                }
            },
            right: function(y, x) {
                if (x >= map[0].length / 2) {
                    return(true)
                }
            },
            top: function(y, x) {
                if (y <= map.length / 2) {
                    return(true)
                }
            },
            bottom: function(y, x) {
                if (y >= map.length / 2) {
                    return(true)
                }
            }
        }
        let receptors = [
            {
                name: "Distance to Top",
                check: function(element, x) {
                    let connectionStrength = element.genes[x][2]
                    let distance = (element.yPos) / 50
                    let result = Math.tanh(distance*connectionStrength)
                    if (result < 0.8) {
                        element.actionCheck(x)
                    }
                }
            },
            {
                name: "Distance to Bottom",
                check: function(element, x) {
                    let connectionStrength = element.genes[x][2]
                    let distance = (map.length - element.yPos) / 50
                    let result = Math.tanh(distance*connectionStrength)
                    if (result < 0.8) {
                        element.actionCheck(x)
                    }
                }
            },
            {
                name: "Distance to Left",
                check: function(element, x) {
                    let connectionStrength = element.genes[x][2]
                    let distance = (element.xPos) / 50
                    let result = Math.tanh(distance*connectionStrength)
                    if (result < 0.8) {
                        element.actionCheck(x)
                    }
                }
            },
            {
                name: "Distance to Right",
                check: function(element, x) {
                    let connectionStrength = element.genes[x][2]
                    let distance = (map[0].length - element.xPos) / 50
                    let result = Math.tanh(distance*connectionStrength)
                    if (result < 0.8) {
                        element.actionCheck(x)
                    }
                }
            },
            {
                name: "Top Right",
                check: function(element, x) {
                    let connectionStrength = element.genes[x][2]
                    let distance = (Math.sqrt(element.yPos**2 + element.xPos**2)) / 70.71
                    let result = Math.tanh(distance*connectionStrength)
                    if (result < 0.8) {
                        element.actionCheck(x)
                    }
                }
            },
            {
                name: "Bottom Right",
                check: function(element, x) {
                    let connectionStrength = element.genes[x][2]
                    let distance = (Math.sqrt((map.length - element.yPos)**2 + element.xPos**2)) / 70.71
                    let result = Math.tanh(distance*connectionStrength)
                    if (result < 0.8) {
                        element.actionCheck(x)
                    }
                }
            },
            {
                name: "Top Left",
                check: function(element, x) {
                    let connectionStrength = element.genes[x][2]
                    let distance = (Math.sqrt(element.yPos**2 + (map[0].length - element.xPos)**2)) / 70.71
                    let result = Math.tanh(distance*connectionStrength)
                    if (result < 0.8) {
                        element.actionCheck(x)
                    }
                }
            },
            {
                name: "Bottom Left",
                check: function(element, x) {
                    let connectionStrength = element.genes[x][2]
                    let distance = (Math.sqrt((map.length - element.yPos)**2 + (map[0].length - element.xPos)**2)) / 70.71
                    let result = Math.tanh(distance*connectionStrength)
                    if (result < 0.8) {
                        element.actionCheck(x)
                    }
                }
            },
            {
                name: "Near Other Organism",
                check: function(element, x) {
                    for (var y1 = Math.round(element.yPos - 2 * element.genes[x][2]); y1 < Math.round(element.yPos + 2 * element.genes[x][2]); y1++) {
                        for (var x1 = Math.round(element.xPos - 2 * element.genes[x][2]); x1 < Math.round(element.xPos + 2 * element.genes[x][2]); x1++) {
                            if (y1 < 0 || y1 >= map.length || x1 < 0 || x1 >= map[0].length) {
                                
                            } else if (map[y1][x1] !== 0) {
                                if (map[y1][x1] !== element && map[y1][x1].moves === 0) {
                                    element.actionCheck(x)
                                    break
                                }
                            }
                        }
                    }
                }
            },
            {
                name: "Top Side",
                check: function(element, x) {
                    if (element.yPos === 0) {
                        element.actionCheck(x)
                    }
                }
            },
            {
                name: "Bottom Side",
                check: function(element, x) {
                    if (element.yPos === map.length - 1) {
                        element.actionCheck(x)
                    }
                }
            },
            {
                name: "Left Side",
                check: function(element, x) {
                    if (element.xPos === 0) {
                        element.actionCheck(x)
                    }
                }
            }, 
            {
                name: "Right Side",
                check: function(element, x) {
                    if (element.xPos === map[0].length - 1) {
                        element.actionCheck(x)
                    }
                }
            },
            {
                name: "Always True",
                check: function(element, x) {
                    element.actionCheck(x)
                }
            },
            {
                name: "Organism Above",
                check: function(element, x) {
                    if (map[element.yPos - 1][element.xPos] <! 0 && map[element.yPos - 1][element.xPos] != 0) {
                        element.actionCheck(x)
                    }
                }
            },
            {
                name: "Organism Below",
                check: function(element, x) {
                    if (map[element.yPos + 1][element.xPos] >=! map.length && map[element.yPos + 1][element.xPos] != 0) {
                        element.actionCheck(x)
                    }
                }
            },
            {
                name: "Organism to Left",
                check: function(element, x) {
                    if (map[element.yPos][element.xPos - 1] <! 0 && map[element.yPos][element.xPos - 1] != 0) {
                        element.actionCheck(x)
                    }
                }
            },
            {
                name: "Organism to Right",
                check: function(element, x) {
                    if (map[element.yPos][element.xPos + 1] >=! map[0].length && map[element.yPos][element.xPos + 1] != 0) {
                        element.actionCheck(x)
                    }
                }
            },
            {
                name: "Stomach Full",
                check: function(element, x) {
                    if (element.eaten === element.stomachCapacity) {
                        element.actionCheck(x)
                    }
                }
            },
            {
                name: "Later Turns",
                check: function(element, x) {
                    let connectionStrength = element.genes[x][2]
                    let turnsLeft = (totalTurns - turns) / 50
                    let result = Math.tanh(turnsLeft * connectionStrength)
                    if (result < 0.9) {
                        element.actionCheck(x)
                    }
                }
            },
            {
                name: "Earlier Turns",
                check: function(element, x) {
                    let connectionStrength = element.genes[x][2]
                    let turnsLeft = (turns) / 50
                    let result = Math.tanh(turnsLeft * connectionStrength)
                    if (result < 0.9) {
                        element.actionCheck(x)
                    }
                }
            }
        ]
        let actions = [
            {
                name: "Move Up",
                check: function(element) {
                    if (!(element.yPos - element.speed < 0) && map[element.yPos - element.speed][element.xPos] === 0) {
                        changeLocation(element, [element.yPos - element.speed, element.xPos])
                        element.moves += 1
                    }
                }
            },
            {
                name: "Move Down",
                check: function(element) {
                    if (!(element.yPos + element.speed >= map.length) && map[element.yPos + element.speed][element.xPos] === 0) {
                        changeLocation(element, [element.yPos + element.speed, element.xPos])
                        element.moves += 1
                    }
                }
            },
            {
                name: "Move Left",
                check: function(element) {
                    if (!(element.xPos - element.speed < 0) && map[element.yPos][element.xPos - element.speed] === 0) {
                        changeLocation(element, [element.yPos, element.xPos - element.speed])
                        element.moves += 1
                    }
                }
            },
            {
                name: "Move Right",
                check: function(element) {
                    if (!(element.xPos + element.speed >= map[0].length) && map[element.yPos][element.xPos + element.speed] === 0) {
                        changeLocation(element, [element.yPos, element.xPos + element.speed])
                        element.moves += 1
                    }
                }
            },
            {
                name: "Eat Nearby Organisms",
                check: function(element) {
                    let adjacentOrganisms = []
                    for (var y1 = element.yPos - 2 * element.speed; y1 < element.yPos + 2 * element.speed; y1++) {
                        for (var x1 = element.xPos - 2 * element.speed; x1 < element.xPos + 2 * element.speed; x1++) {
                            if (y1 < 0 || y1 >= map.length || x1 < 0 || x1 >= map[0].length) {
                                
                            } else if (map[y1][x1] !== 0) {
                                if (map[y1][x1] !== element && map[y1][x1].moves === 0) {
                                    adjacentOrganisms.push(map[y1][x1])
                                }
                            }
                        }
                    }
                    if (adjacentOrganisms.length > 0) {
                        let targetOrganism = adjacentOrganisms[Math.floor(Math.random()*adjacentOrganisms.length)]
                        if (element.eaten < element.stomachCapacity && allowKilling) {
                            changeLocation(element, [targetOrganism.yPos, targetOrganism.xPos])
                            element.moves += 1
                            element.eaten += 1
                        }
                    }
                }
            }, 
            {
                name: "Move Up Left",
                check: function(element) {
                    if (!(element.yPos - element.speed < 0 || element.xPos - element.speed < 0) && map[element.yPos - element.speed][element.xPos - element.speed] === 0) {
                        changeLocation(element, [element.yPos - element.speed, element.xPos - element.speed])
                    }
                }
            },
            {
                name: "Move Down Left",
                check: function(element) {
                    if (!(element.yPos + element.speed >= map.length || element.xPos - element.speed < 0) && map[element.yPos + element.speed][element.xPos - element.speed] === 0) {
                        changeLocation(element, [element.yPos + element.speed, element.xPos - element.speed])
                    }
                }
            },
            {
                name: "Move Up Right",
                check: function(element) {
                    if (!(element.yPos - element.speed < 0 || element.xPos + element.speed >= map[0].length) && map[element.yPos - element.speed][element.xPos + element.speed] === 0) {
                        changeLocation(element, [element.yPos - element.speed, element.xPos + element.speed])
                    }
                }
            },
            {
                name: "Move Down Right",
                check: function(element) {
                    if (!(element.yPos + element.speed >= map.length || element.xPos + element.speed >= map[0].length) && map[element.yPos + element.speed][element.xPos + element.speed] === 0) {
                        changeLocation(element, [element.yPos + element.speed, element.xPos + element.speed])
                    }
                }
            }
        ]
        class Organism {
            constructor(givenY, givenX, givenColor, givenShape) {
                this.yPos = givenY
                this.xPos = givenX
                this.color = givenColor
                this.shape = givenShape
                this.moves = 0
                this.genes = []
                this.eaten = 0
                this.metabolism = 1 + parseFloat(((Math.floor(Math.random()*21)-20)/100).toFixed(2))
                this.stomachCapacity = 1 + Math.floor(Math.random()*3)
                this.speed = speeds[Math.floor(Math.random()*speeds.length)]
            }
            createGenes() {
                for (var x = 0; x < genesPerOrganism; x++) {
                    this.genes.push([])
                    this.genes[x].push(Math.floor(Math.random()*receptors.length))
                    this.genes[x].push(Math.floor(Math.random()*actions.length))
                    if (this.genes[x][1] === 4 && !allowKilling) {
                        while (this.genes[x][1] === 4) {
                            this.genes[x][1] = Math.floor(Math.random()*actions.length)
                        }
                    }
                    this.genes[x].push(1 + (Math.floor(Math.random()*7)-3)/10)
                }
            }
            receptorCheck() {
                if (this.moves >= movesPerOrganism || this.finishedActions) {
                    return
                }
                let chosen = []
                for (var x = 0; x < movesPerOrganism; x++) {
                    let random = Math.floor(Math.random()*this.genes.length)
                    if (chosen.includes(random)) {
                        while (chosen.includes(random)) {
                            random = Math.floor(Math.random()*this.genes.length)
                        }
                    } else {
                        chosen.push(random)
                    }
                    let currGene = this.genes[random][0]
                    receptors[currGene].check(this, random)
                }
                this.finishedActions = true
            }
            actionCheck(x) {
                let currGene = this.genes[x][1]
                actions[currGene].check(this)
            }
        }
        function changeLocation(el, newLocation) {
            map[el.yPos][el.xPos] = 0
            ctx.fillStyle = "black"
            ctx.fillRect(el.xPos * size, el.yPos * size, size, size)
            el.yPos = newLocation[0]
            el.xPos = newLocation[1]
            map[el.yPos][el.xPos] = el
            shapeDrawings[el.shape](el.yPos, el.xPos, el.color)
        }
        function start() {
            if (started) {
                return
            } else {
                started = true
            }
            canvas.addEventListener('click', clicked)
            let height = canvas.height / size
            let currentOrganisms = 0
            for (var y = 0; y < height; y++) {
                let width = canvas.width / size
                map.push([])
                for (var x = 0; x < width; x++) {
                    let el = 0
                    let random = Math.floor(Math.random()*concentration)
                    if (random === 0 && currentOrganisms < totalOrganisms) {
                        el = new Organism(y, x, "white", "circle")
                        currentOrganisms += 1
                        el.color = colors[Math.floor(Math.random()*colors.length)]
                        if (el.color === undefined) {
                            while (el.color === undefined) {
                                el.color = colors[Math.floor(Math.random()*colors.length)]
                            }
                        }
                        el.shape = shapes[Math.floor(Math.random()*shapes.length)]
                        if (el.shape === undefined) {
                            while (el.shape === undefined) {
                                el.shape = shapes[Math.floor(Math.radom()*shapes.length)]
                            }
                        }
                        el.createGenes()
                    }
                    map[y].push(el)
                }
            }
            if (currentOrganisms < totalOrganisms) {
                while (currentOrganisms < totalOrganisms) {
                    for (var y = 0; y < height; y++) {
                        let width = canvas.width / size
                        for (var x = 0; x < width; x++) {
                            let random = Math.floor(Math.random()*concentration)
                            if (random === 0 && currentOrganisms < totalOrganisms) {
                                el = new Organism(y, x, "white", "circle")
                                currentOrganisms += 1
                                el.color = colors[Math.floor(Math.random()*colors.length)]
                                if (el.color === undefined) {
                                    while (el.color === undefined) {
                                        el.color = colors[Math.floor(Math.random()*colors.length)]
                                    }
                                }
                                el.shape = shapes[Math.floor(Math.random()*shapes.length)]
                                if (el.shape === undefined) {
                                    while (el.shape === undefined) {
                                        el.shape = shapes[Math.floor(Math.radom()*shapes.length)]
                                    }
                                }
                                el.createGenes()
                                map[y][x] = el
                            }
                        }
                    }
                }
            }
            simulate(false)
        }
        function simulate(checkReceptors) {
            if (!started) {
                return
            }
            if (turns >= turnsUntilDeath) {
                turnsUntilDeath += turnsUntilDeath
            }
            if (checkReceptors) {
                turns += 1
                document.getElementById("currTurn").innerHTML = "Turn: " + turns
            }
            document.getElementById('numberOfGuys').innerHTML = "# of Guys: " + totalOrganisms
            let height = map.length
            for (var y = 0; y < height; y++) {
                let width = map[0].length
                for (var x = 0; x < width; x++) {
                    let el = map[y][x]
                    if (el === 0) {
                        ctx.fillStyle = "black"
                        ctx.fillRect(x * size, y * size, size, size)
                    } else {
                        shapeDrawings[el.shape](el.yPos, el.xPos, el.color)
                    }
                    if (checkReceptors && el !== 0) {
                        if (el.eaten < 1 && turns >= turnsUntilDeath * el.metabolism && allowKilling) {
                            map[el.yPos][el.xPos] = 0
                            el = null
                        } else {
                            if (el.eaten > 0 && turns >= turnsUntilDeath && allowKilling) {
                                el.eaten -= 1
                            }
                            el.receptorCheck()
                        }
                    }
                }
            }
            for (var y = 0; y < height; y++) {
                let width = map[0].length
                for (var x = 0; x < width; x++) {
                    if (map[y][x] !== 0) {
                        map[y][x].moves = 0
                        map[y][x].finishedActions = false
                    }
                }
            }
        }
        function newGeneration(x) {
            if (!started || !simulated || (autoRun && x)) {
                return
            }
            turns = 0
            turnsUntilDeath = baseTurnsUntilDeath
            simulated = false
            let remaining = []
            let height = map.length
            for (var y = 0; y < height; y++) {
                let width = map[0].length
                for (var x = 0; x < width; x++) {
                    if (map[y][x] !== 0) {
                        //CHANGE PROBABLY
                        let chosen = map[y][x]
                        let accept = true
                        for (var z = 0; z < currentSelection.length; z++) {
                            let currSelection = selections[z](chosen.yPos, chosen.xPos)
                            if (currSelection){
                                accept = true
                            } else {
                                accept = false
                                break
                            }
                        }
                        if (accept) {
                            remaining.push({color: chosen.color, shape: chosen.shape, genes: chosen.genes, metabolism: chosen.metabolism, stomachCapacity: chosen.stomachCapacity, speed: chosen.speed,})
                        }
                            //This is where you handle the conditions. If you want to change the survival conditions, just edit the first if statement.
                        //CHANGE IN A SECOND
                    }
                }
            }
            if (remaining.length === 0) {
                alert("it all died smh")
            }
            height = canvas.height / size
            let currentOrganisms = 0
            map = []
            for (var y = 0; y < height; y++) {
                let width = canvas.width / size
                map.push([])
                for (var x = 0; x < width; x++) {
                    let el = 0
                    let random = Math.floor(Math.random()*concentration)
                    if (random === 0 && currentOrganisms < totalOrganisms) {
                        let chosenParent = remaining[Math.floor(Math.random()*remaining.length)]
                        el = new Organism(y, x, "white", "square")
                        currentOrganisms += 1
                        el.color = chosenParent.color
                        el.shape = chosenParent.shape
                        el.genes = chosenParent.genes
                        el.metabolism = chosenParent.metabolism
                        el.stomachCapacity = chosenParent.stomachCapacity
                        el.speed = chosenParent.speed
                        if (allowMutations) {
                            let random1 = Math.floor(Math.random*(mutationChance/totalOrganisms))
                            if (random1 === 0) {
                                el.genes[Math.floor(Math.random()*el.genes.length)][0] = Math.floor(Math.random()*receptors.length)
                            }
                            let random2 = Math.floor(Math.random*(mutationChance/totalOrganisms))
                            if (random2 === 0) {
                                el.genes[Math.floor(Math.random()*el.genes.length)][1] = Math.floor(Math.random()*actions.length)
                            }
                        }
                    }
                    map[y].push(el)
                }
            }
            simulate(false)
            if (autoRun) {
                setTimeout(function() {
                    massSimulate()
                },250)
            }
        }
        function clicked(e) {
            let clicked = map[Math.floor(e.offsetY / size)][Math.floor(e.offsetX / size)]
            if (clicked === 0) {
                return
            }
            let box = document.getElementById('displayDiv')
            box.style.height = "50vh;"
            box.innerHTML = ""
            let para1 = document.createElement('p')
            para1.innerHTML = "Color: " + clicked.color
            box.appendChild(para1)
            let para2 = document.createElement('p')
            para2.innerHTML = "Shape: " + clicked.shape
            box.appendChild(para2)
            let para3 = document.createElement('p')
            para3.innerHTML = "Metabolism: " + clicked.metabolism.toFixed(2)
            box.appendChild(para3)
            let para4 = document.createElement('p')
            para4.innerHTML = "Stomach Capacity: " + clicked.stomachCapacity
            box.appendChild(para4)
            let para5 = document.createElement('p')
            para5.innerHTML = "Speed: " + clicked.speed
            box.appendChild(para5)
            for (var x = 0; x < genesPerOrganism; x++) {
                let para = document.createElement('p')
                para.innerHTML = clicked.genes[x][0] + ": " + receptors[clicked.genes[x][0]].name + ", " + clicked.genes[x][1] + ": " + actions[clicked.genes[x][1]].name + ", " + clicked.genes[x][2]
                box.appendChild(para)
            }
        }
        function massSimulate() {
            if (!simulated && runFullDuration) {
                let currTick = 0
                let interval = setInterval(
                    function() {
                        if (currTick >= totalTurns) {
                            if (autoRun) {
                                setTimeout(function() {
                                    simulated = true
                                    newGeneration(false)
                                    clearInterval(interval)
                                }, 250)
                            }
                            simulated = true
                            clearInterval(interval)
                        } else {
                            currTick ++
                            simulate(true)
                        }
                    }, 50
                )
            }
            else if (!simulated && !runFullDuration) {
                simulate(true)
            }
        }
        function guys(x) {
            if (totalOrganisms + x > 0) {
                totalOrganisms += x
            }
            document.getElementById("numberOfGuys").innerHTML = "# of Guys: " + totalOrganisms
        }
        function changeCriteria(x) {
            let keys = Object.keys(selections)
            currentSelection = keys[x]
            document.getElementById("selectionCritia").innerHTML = "Selection Criteria: " + currentSelection
        }
        function genes(x) {
            if (genesPerOrganism + x > 0) {
                genesPerOrganism += x
            } 
            document.getElementById("genesPerOrganism").innerHTML = "Genes Per Organism: " + genesPerOrganism
        }
        function moves(x) {
            if (movesPerOrganism + x > 0 && movesPerOrganism + x <= genesPerOrganism) {
                movesPerOrganism += x
            }
            document.getElementById("movesPerOrganism").innerHTML = "Moves Per Oerganism: " + movesPerOrganism
        }
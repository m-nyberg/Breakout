let interval = 0

const canvas = document.getElementById("Canvas")
const ctx = canvas.getContext("2d")
const ballRadius = 10

let x = canvas.width / 2
let y = canvas.height - 30
let dx = 3
let dy = -3

const paddleHeight = 18
const paddleWidth = 160
let paddleX = (canvas.width - paddleWidth) / 2

let høyreTrykk = false
let venstreTrykk = false

const brickRowCount = 9
const brickColumnCount = 9
const brickWidth = 80
const brickHeight = 23
const brickPadding = 12
const brickOffsetTop = 70
const brickOffsetLeft = 46

let score = 0
let hemmeligPoeng = 0

const bodyID = document.body.id

function poengscore() {
    ctx.font = "27px Rubik Glitch"
    ctx.fillStyle = "#0095DD"
    ctx.fillText("Poeng: " + score, 30, 40)
}

const spørsmålstegnEl = document.getElementById("spørsmålstegn")
const containerHjelpEL = document.getElementById("containerHjelp")
spørsmålstegnEl.addEventListener("mouseover", minBruksanvisning)
spørsmålstegnEl.addEventListener("mouseleave", minBruksanvisningbort)

function minBruksanvisning() {
    containerHjelpEL.style.display = "flex"
}

function minBruksanvisningbort() {
    containerHjelpEL.style.display = "none"
}


document.addEventListener("keydown", keyDownHandler, false)
document.addEventListener("keyup", keyUpHandler, false)

//definerer antall bricks
let bricks = []
for (let i = 0; i < brickColumnCount; i++) {
    bricks[i] = []
    for (let r = 0; r < brickRowCount; r++) {
        bricks[i][r] = { x: 0, y: 0, status: 1 }
    }
}

if (bodyID == "test2"){
    //fjerner noen bricks
    for (let i = 8; i > 3; i--) {
        for (let r = i - 5; r >= 0; r--) {
            bricks[i][r].status = 0
        }
    }
    
    for (let i = 0; i < 5; i++) {
        for (let r = 3 - i; r >= 0; r--) {
            bricks[i][r].status = 0;
        }
    }
    
    bricks[4][5].status = 2
    bricks[6][3].status = 2
    bricks[2][3].status = 2
    bricks[5][5].status = 3

}



//sier at hvis man trykker ned/opp pilene skal konstant som gjør at paddle bevege seg være sann
function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        høyreTrykk = true
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        venstreTrykk = true
    }
}
function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        høyreTrykk = false;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        venstreTrykk = false;
    }
}


//tegn ball
function tegnBall() {
    ctx.beginPath()
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2)
    ctx.fillStyle = "#0095DD"
    ctx.fill()
    ctx.closePath()
}

//tegner paddle
function tegnPaddle() {
    ctx.beginPath()
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight)
    ctx.fillStyle = "#0095DD"
    ctx.fill()
    ctx.closePath()
}


//tegner inn brikkene hvis status sier at det ikke har vært kollisjon
function tegnBricks() {
    for (let i = 0; i < brickColumnCount; i++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[i][r].status == 1 || bricks[i][r].status == 2 || bricks[i][r].status == 3) {
                let brickX = i * (brickWidth + brickPadding) + brickOffsetLeft
                let brickY = r * (brickHeight + brickPadding) + brickOffsetTop
                bricks[i][r].x = brickX
                bricks[i][r].y = brickY

                if (bricks[i][r].status == 1) {
                    ctx.beginPath()
                    ctx.rect(brickX, brickY, brickWidth, brickHeight)
                    ctx.fillStyle = "#0095DD"
                    ctx.fill()
                    ctx.closePath()
                }

                if (bricks[i][r].status == 2) {
                    ctx.beginPath()
                    ctx.rect(brickX, brickY, brickWidth, brickHeight)
                    ctx.strokeStyle = "#e62727"
                    ctx.lineWidth = "4"
                    ctx.stroke()
                    ctx.font = "14px Rubik Glitch"
                    ctx.fillStyle = "#0095DD"
                    ctx.fillText("2x speed", brickX + 7, brickY + 16)
                    ctx.closePath()

                }

                if (bricks[i][r].status == 3) {
                    ctx.beginPath()
                    ctx.rect(brickX, brickY, brickWidth, brickHeight)
                    ctx.strokeStyle = "#e62727"
                    ctx.lineWidth = "4"
                    ctx.stroke()
                    ctx.font = "14px Rubik Glitch"
                    ctx.fillStyle = "#0095DD"
                    ctx.fillText("1000 p", brickX + 7, brickY + 16)
                    ctx.closePath()

                }

            }
        }
    }
}


//sjekker om ballen treffer en brick, og endrer isåfall status, og legger til poeng
function kollisjonDetektering() {
    for (let i = 0; i < brickColumnCount; i++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[i][r]
            if (b.status == 1 || b.status == 2 || b.status == 3) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    if (b.status == 2) {
                        dy = dy * 1.2
                        dx = dx * 1.2
                    }
                    if (b.status == 3) {
                       score += 1000
                    }
                    
                    dy = -dy

                    b.status = 0
                    score += 100
                    hemmeligPoeng += 100
                    if (hemmeligPoeng == (brickRowCount * brickColumnCount) * 100) {
                        clearInterval(interval)
                        document.getElementById("containerGC").style.display = "flex"

                    }
                }
            }
        }
    }
}

//Flytter paddle hvis man trykker på høyre eller ventre pil 
function flyttPaddle() {
    if (høyreTrykk) {
        paddleX += 8;
        if (paddleX + paddleWidth > canvas.width) {
            paddleX = canvas.width - paddleWidth;
        }
    } else if (venstreTrykk) {
        paddleX -= 8;
        if (paddleX < 0) {
            paddleX = 0;
        }
    }
}

//Sjekke om ball kolliderer med kantene, og endrer retning hvis den treffer kantene eller paddle. avslutter om ballen treffer bakken  
function sjekkKollisjonVegg() {
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        dy = -dy

    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy
        } else {
            clearInterval(interval)
            document.getElementById("containerGO").style.display = "flex";
            const poengboksEl = document.getElementById("poengboks")
            const divEl2 = document.createElement("div")
            divEl2.innerHTML = "Din poengscore er " + score + " poeng"
            divEl2.style.fontSize = "30px"
            divEl2.style.margin = "10px"
            poengboksEl.appendChild(divEl2)

        }
    }
}

function oppdater() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    tegnBricks()
    tegnBall()
    tegnPaddle()
    flyttPaddle()
    poengscore()
    sjekkKollisjonVegg()
    kollisjonDetektering()

    x += dx
    y += dy
}


interval = setInterval(oppdater, 10);

<template>
    <div
        class="overflow-x-hidden pt-16 px-8"
    >
        <div class="hidden">
            <img :src="'/images/beer-pong/pointer.png'" id="horizontal-cursor" />
            <img :src="'/images/beer-pong/cursor.png'" id="power-cursor" />
            <img :src="'/images/beer-pong/empty-glass.png'" id="empty-glass" />
            <img :src="'/images/beer-pong/base.png'" id="base" />
            <img :src="'/images/beer-pong/ball.png'" id="ball" />
            <img :src="'/images/beer-pong/dynamometer.png'" id="dynamometer" />
        </div>

        <div id="game-container">
            <canvas id="pong" class="mx-auto"></canvas>
        </div>
    </div>
</template>

<script setup> 
import { onMounted, ref, computed, onBeforeUnmount } from 'vue';

const time = ref(30)
const score = ref(0)
const timer = ref(null)
const canvas = ref(null)
const canvasRatio = ref(0.5)
const ctx = ref(null)
const ball = ref({
    radius : 10,
    speed : .2,
    marginBottom: 60,
    color : "WHITE",
})
const horizontalCursor = ref({
    id: 'horizontal-cursor',
    startingX: null,
    x: null,
    y: null,
    leftLimit: null,
    rightLimit: null,
    width : 30,
    height : 30,
    marginBottom: 60 ,
    marginX: 20,
    direction: 'right',
    speed: 4,
})
const powerCursor = ref({
    id: 'power-cursor',
    x: null,
    y: null,
    startingY: null,
    bottomLimit: null,
    topLimit: null,
    width : 20,
    height : 20,
    marginBottom: 140,
    marginRight: 20,
    direction: 'top',
    speed: 6,
})
const glasses = ref({
    id: 'empty-glass',
    width: null,
    height: null,
    margin: 20,
    matrix: [
        // [ 0,  0,  0,  0,  0],
        [ 0,  0,  0,  0,  0],
        [ 5,  5,  5,  5,  5],
        [ 0, 10, 10, 10,  0],
        [ 0,  0, 15,  0,  0],
    ],
    coordinates: [],
})
const framesPerSecond = ref(50)
const loop = ref(null)
const states = ref([
    'waiting_for_x',
    'waiting_for_power',
    'throwing',
    'thrown',
    'game_over',
])
const state = ref(0)
const ball_throw = ref({
    x: null,
    power: null,
})
const audio = ref({
    //splash: new Audio('/assets/audio/splash.mp3'),
})

onMounted(() => {

    let dl = window.dataLayer;

    canvas.value = document.getElementById('pong')

    if(! canvas.value) {
        return false
    }

    window.scrollTo(0, 0)

    const container = document.getElementById('game-container')

    canvas.value.width = window.innerWidth < 464 ? window.innerWidth - 64 : 400
    canvas.value.height = window.innerHeight < 1000 ? window.innerHeight - 200 : 800

    if(canvas.value.height < 540  ) {
        canvas.value.height = 540  
    }
    ctx.value = canvas.value.getContext('2d')

    let ballStartingX = canvas.value.width / 2
    let ballStartingY = canvas.value.height - ball.value.marginBottom

    ball.value = {
        ...ball.value,
        x: ballStartingX,
        y: ballStartingY,
        startingX: ballStartingX,
        startingY: ballStartingY,
    }

    let horizontalCursorStartingX = canvas.value.width / 2 - (horizontalCursor.value.width / 2)

    horizontalCursor.value = {
        ...horizontalCursor.value,
        startingX: horizontalCursorStartingX,
        x: horizontalCursorStartingX,
        y: canvas.value.height - horizontalCursor.value.marginBottom - horizontalCursor.value.height,
        leftLimit: horizontalCursor.value.marginX,
        rightLimit: canvas.value.width - horizontalCursor.value.marginX - horizontalCursor.value.width,
    }

    let powerCursorStartingY = parseInt(canvas.value.height - powerCursor.value.marginBottom - powerCursor.value.height)

    powerCursor.value = {
        ...powerCursor.value,
        x: parseInt(canvas.value.width - powerCursor.value.marginRight - (powerCursor.value.width / 2)),
        y: powerCursorStartingY,
        startingY: powerCursorStartingY,
        bottomLimit: parseInt(canvas.value.height - powerCursor.value.marginBottom - powerCursor.value.height),
        topLimit: powerCursorStartingY - 240,
    }

    const glassSize = (canvas.value.width - (glasses.value.margin * 2)) / glasses.value.matrix[0].length
    glasses.value.width = glassSize
    glasses.value.height = glassSize

    loop.value = setInterval(game, 1000 / framesPerSecond.value)

    canvas.value.addEventListener('click', onClick)
    window.addEventListener('keydown', onKeyDown)

    manageTimer()
})

onBeforeUnmount(() => {
    // Cleanup interval
    clearInterval(loop.value)
    clearInterval(timer.value)

    // Cleanup any event listeners outside the root of the element
    if(canvas.value) {
        canvas.value.removeEventListener('click', onClick)
        window.removeEventListener('keydown', onKeyDown)
    }

    document.getElementsByClassName('header')[0].classList.remove('hidden')
    // document.getElementsByClassName('header-bg')[0].classList.remove('hidden')
})

const drawRect = (x, y, w, h, color) => {
    ctx.value.fillStyle = color;
    ctx.value.fillRect(x, y, w, h);
}

const drawCircle = (x, y, r, color) => {
    ctx.value.fillStyle = color;
    ctx.value.beginPath();
    ctx.value.arc(x,y,r,0,Math.PI*2,true);
    ctx.value.closePath();
    ctx.value.fill();
}

const drawLine = (startX, startY, endX, endY, color) => {
    if(! color) {
        color = "#F1E6B2"
    }

    ctx.value.strokeStyle = color;
    ctx.value.beginPath();
    ctx.value.moveTo(startX, startY);
    ctx.value.lineTo(endX, endY);
    ctx.value.stroke();
}

const update = () => {
    if(state.value === 0) {
        manageHorizontalCursor()
    }
    if(state.value === 1) {
        managePowerCursor()
    }
    if(state.value === 2) {
        moveBall()
    }
        if(state.value === 3) {
        clearInterval(loop.value)
    }
}

const render = () => {
    // clear the canvas
    ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height);

    ctx.value.drawImage(
        document.getElementById(horizontalCursor.value.id),
        horizontalCursor.value.x,
        horizontalCursor.value.y,
        horizontalCursor.value.width,
        horizontalCursor.value.height
    );

    ctx.value.drawImage(
        document.getElementById('base'),
        horizontalCursor.value.leftLimit,
        canvas.value.height - 60,
        canvas.value.width - (horizontalCursor.value.marginX * 2),
        60,
    );

    // draw the power cursor
    let dynamometerHeight = powerCursor.value.startingY - powerCursor.value.topLimit + powerCursor.value.height / 2
    let dynamometerWidth = dynamometerHeight * 0.1

    ctx.value.drawImage(
        document.getElementById('dynamometer'),
        powerCursor.value.x + powerCursor.value.width / 2 - dynamometerWidth / 2 + 9 ,
        powerCursor.value.topLimit,
        dynamometerWidth,
        dynamometerHeight,
    );

    ctx.value.drawImage(
        document.getElementById(powerCursor.value.id),
        powerCursor.value.x,
        powerCursor.value.y,
        powerCursor.value.width,
        powerCursor.value.height,
    )

    // draw the glasses
    glasses.value.coordinates = []

    glasses.value.matrix.forEach((row, rowKey) => {
        row.forEach((cell, cellKey) => {
            if(cell) {
                let x = cellKey * glasses.value.width + glasses.value.margin + (glasses.value.width / 2)
                let y = rowKey * glasses.value.height + (glasses.value.width / 2)

                glasses.value.coordinates.push({
                    id: rowKey + '-' + cellKey,
                    row: rowKey,
                    cell: cellKey,
                    x: x,
                    y: y,
                    left: x - (glasses.value.width / 2),
                    right: x + (glasses.value.width / 2),
                    top: y - (glasses.value.height / 2),
                    bottom: y + (glasses.value.height / 2),
                })

                ctx.value.drawImage(
                    document.getElementById(glasses.value.id),
                    cellKey * glasses.value.width + glasses.value.margin,
                    rowKey * glasses.value.height,
                    glasses.value.width,
                    glasses.value.height,
                );
            }
        })
    })

    // draw the ball
    ctx.value.drawImage(
        document.getElementById('ball'),
        ball.value.x,
        ball.value.y,
        ball.value.radius * 2,
        ball.value.radius * 2,
    );
}

const normalizeX = (x, min, max) => {
    // (value – min) / (max – min) => from 0 to 1
    let normalized = (((x - min) / (max - min)) - 0.5) * 100

    // console.log('Normalized X: ' + normalized)

    return normalized
}

const normalizePower = (y, top, bottom) => {
    // (value – min) / (max – min) => from 0 to 1
    let normalized = 100 - ((y - top) / (bottom - top) * 100)

    // console.log('Normalized power: ' + normalized)

    return normalized
}

const game = () => {
    // console.log('GAME!!');
    update();
    render();
}

const onClick = () => {
    // console.log('click')
    if(state.value === 0) {
        ball_throw.value.x = normalizeX(horizontalCursor.value.x, horizontalCursor.value.leftLimit, horizontalCursor.value.rightLimit)
    }

    if(state.value === 1) {
        ball_throw.value.power = normalizePower(powerCursor.value.y, powerCursor.value.topLimit, powerCursor.value.bottomLimit)
    }

    if(state.value < 2) {
        state.value++
    }
}

const onKeyDown = (e) => {
    if (e.key === ' ') {
        e.preventDefault()

        onClick()
    }
}

const manageTimer = () => {
    timer.value = setInterval(() => {
        if(time.value) {
            time.value--
        }
        else {
            state.value = 4

            canvas.value.removeEventListener('click', onClick)
            window.removeEventListener('keydown', onKeyDown)

            saveRound()

            clearInterval(timer.value)
        }
    }, 1000)
}

const manageHorizontalCursor = () => {
    if(horizontalCursor.value.x >= horizontalCursor.value.rightLimit) {
        horizontalCursor.value.direction = 'left'
    }
    if(horizontalCursor.value.x <= horizontalCursor.value.leftLimit) {
        horizontalCursor.value.direction = 'right'
    }

    horizontalCursor.value.x += (horizontalCursor.value.direction === 'right' ? horizontalCursor.value.speed : -horizontalCursor.value.speed)
}

const managePowerCursor = () => {
    if(powerCursor.value.y >= powerCursor.value.bottomLimit) {
        powerCursor.value.direction = 'top'
    }
    if(powerCursor.value.y <= powerCursor.value.topLimit) {
        powerCursor.value.direction = 'bottom'
    }

    powerCursor.value.y += (powerCursor.value.direction === 'bottom' ? powerCursor.value.speed : -powerCursor.value.speed)
}

const moveBall = () => {
    ball.value.x += ball_throw.value.x * ball.value.speed * canvasRatio.value
    ball.value.y -= ball_throw.value.power * ball.value.speed

    if(ballStops()) {
        calculateScore()

        state.value++

        setTimeout(() => {
            // console.log(horizontalCursor.value.startingX);
            ball.value.x = ball.value.startingX
            ball.value.y = ball.value.startingY

            horizontalCursor.value.x = horizontalCursor.value.startingX
            powerCursor.value.y = powerCursor.value.startingY

            if(state.value < 4) {
                state.value = 0

                loop.value = setInterval(game, 1000 / framesPerSecond.value)
                // console.log('reset');
            }
        }, 1000)
    }
}

const ballStops = () => {
    return ball.value.y <= (ball.value.startingY - (ball_throw.value.power * (ball.value.startingY / 100)))
            || ball.value.x <= (ball.value.radius * 2)
            || ball.value.x >= (canvas.value.width - (ball.value.radius * 2))
}

const calculateScore = () => {
    glasses.value.coordinates.forEach(glass => {
        if(
            ball.value.x > glass.left
            && ball.value.x < glass.right
            && ball.value.y > glass.top
            && ball.value.y < glass.bottom
        ) {
            // console.log('collisione!', glass, glasses.value.matrix[glass.row][glass.cell]);
            ball.value.x = glass.x - ball.value.radius
            ball.value.y = glass.y - ball.value.radius

            //audio.value.splash.play()

            score.value += glasses.value.matrix[glass.row][glass.cell]
        }
    })
}

const saveRound = () => {
    axios.post(
            '/api/rounds',
            { user_id: player.value.id, score: score.value }
        )
        .then(response => {
            store.commit('updatePlayer', {
                total_score: response.data.data.total_score,
                chart_position: response.data.data.chart_position,
                coins: player.value.coins - 1,
            })

            store.dispatch('openModal', { name: 'game_completed_modal' })
        })
}

const leadingZero = (number) => {
    return number >= 10 ? number : '0' + number
}
</script>
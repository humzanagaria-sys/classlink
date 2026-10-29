let snList, snDir, snNextDir, food;
let bPaddle, bBall, bBlocks;
let pPaddle1, pPaddle2, pBall;
let frameThrottle = 0;

function buildGameCore(gameKey) {
    cancelAnimationFrame(animationFrameId);
    activeGame = gameKey;
    setScore(0);

    if (gameKey === "snake") {
        snList = [{x: 10, y: 10}];
        snDir = "RIGHT"; snNextDir = "RIGHT";
        food = {x: 18, y: 10};
        animationFrameId = requestAnimationFrame(runSnake);
    } else if (gameKey === "breakout") {
        bPaddle = {x: 210, w: 80, h: 10};
        bBall = {x: 250, y: 250, dx: 3, dy: -3, r: 6};
        bBlocks = [];
        for(let r=0; r<4; r++) {
            for(let c=0; c<7; c++) {
                bBlocks.push({x: c * 65 + 25, y: r * 22 + 40, w: 55, h: 14, alive: true});
            }
        }
        animationFrameId = requestAnimationFrame(runBreakout);
    } else if (gameKey === "pong") {
        pPaddle1 = 160; pPaddle2 = 160;
        pBall = {x: 250, y: 200, dx: 4, dy: 2, r: 6};
        animationFrameId = requestAnimationFrame(runPong);
    }
}

function runSnake() {
    if (++frameThrottle & 3) {
        animationFrameId = requestAnimationFrame(runSnake);
        return;
    }
    snDir = snNextDir;
    if (inputState.ArrowLeft && snDir !== "RIGHT") snNextDir = "LEFT";
    if (inputState.ArrowRight && snDir !== "LEFT") snNextDir = "RIGHT";
    if (inputState.ArrowUp && snDir !== "DOWN") snNextDir = "UP";
    if (inputState.ArrowDown && snDir !== "UP") snNextDir = "DOWN";

    let head = {...snList[0]};
    if (snNextDir === "LEFT") head.x--;
    if (snNextDir === "RIGHT") head.x++;
    if (snNextDir === "UP") head.y--;
    if (snNextDir === "DOWN") head.y++;

    if (head.x < 0 || head.x >= 25 || head.y < 0 || head.y >= 20) { triggerGameOver(); return; }
    for (let p of snList) { if (p.x === head.x && p.y === head.y) { triggerGameOver(); return; } }

    snList.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        setScore(currentScore + 10);
        food = { x: Math.floor(Math.random()*25), y: Math.floor(Math.random()*20) };
    } else {
        snList.pop();
    }

    ctx.clearRect(0,0,500,400);
    ctx.fillStyle = "rgba(56, 189, 248, 0.8)";
    snList.forEach(p => ctx.fillRect(p.x*20, p.y*20, 18, 18));
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(food.x*20, food.y*20, 18, 18);

    animationFrameId = requestAnimationFrame(runSnake);
}

function runBreakout() {
    if (inputState.ArrowLeft && bPaddle.x > 0) bPaddle.x -= 5;
    if (inputState.ArrowRight && bPaddle.x < canvas.width - bPaddle.w) bPaddle.x += 5;

    bBall.x += bBall.dx; bBall.y += bBall.dy;
    if (bBall.x - bBall.r < 0 || bBall.x + bBall.r > canvas.width) bBall.dx = -bBall.dx;
    if (bBall.y - bBall.r < 0) bBall.dy = -bBall.dy;
    if (bBall.y + bBall.r > canvas.height) { triggerGameOver(); return; }

    if (bBall.y + bBall.r >= bPaddle.y && bBall.x >= bPaddle.x && bBall.x <= bPaddle.x + bPaddle.w) {
        bBall.dy = -Math.abs(bBall.dy);
    }

    bBlocks.forEach(b => {
        if (b.alive && bBall.x > b.x && bBall.x < b.x + b.w && bBall.y > b.y && bBall.y < b.y + b.h) {
            b.alive = false; bBall.dy = -bBall.dy;
            setScore(currentScore + 20);
        }
    });

    ctx.clearRect(0,0,500,400);
    ctx.fillStyle = "var(--accent)";
    ctx.fillRect(bPaddle.x, bPaddle.y, bPaddle.w, bPaddle.h);
    ctx.fillStyle = "#ffffff";
    ctx.beginPath(); ctx.arc(bBall.x, bBall.y, bBall.r, 0, Math.PI*2); ctx.fill();
    
    bBlocks.forEach(b => {
        if (b.alive) { ctx.fillStyle = "#f59e0b"; ctx.fillRect(b.x, b.y, b.w, b.h); }
    });

    animationFrameId = requestAnimationFrame(runBreakout);
}

function runPong() {
    if (inputState.ArrowUp && pPaddle2 > 0) pPaddle2 -= 4;
    if (inputState.ArrowDown && pPaddle2 < canvas.height - 80) pPaddle2 += 4;
    
    if (pBall.y < pPaddle1 + 40 && pPaddle1 > 0) pPaddle1 -= 3.5;
    if (pBall.y > pPaddle1 + 40 && pPaddle1 < canvas.height - 80) pPaddle1 += 3.5;

    pBall.x += pBall.dx; pBall.y += pBall.dy;
    if (pBall.y - pBall.r < 0 || pBall.y + pBall.r > canvas.height) pBall.dy = -pBall.dy;

    if (pBall.x <= 20) {
        if (pBall.y >= pPaddle1 && pBall.y <= pPaddle1 + 80) { pBall.dx = Math.abs(pBall.dx); }
        else { setScore(currentScore + 1); pBall = {x: 250, y: 200, dx: 4, dy: 2, r: 6}; }
    }
    if (pBall.x >= canvas.width - 20) {
        if (pBall.y >= pPaddle2 && pBall.y <= pPaddle2 + 80) { pBall.dx = -Math.abs(pBall.dx); }
        else { triggerGameOver(); return; }
    }

    ctx.clearRect(0,0,500,400);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(10, pPaddle1, 10, 80);
    ctx.fillRect(canvas.width - 20, pPaddle2, 10, 80);
    boxCircleDraw(pBall.x, pBall.y, pBall.r);

    animationFrameId = requestAnimationFrame(runPong);
}

function boxCircleDraw(x,y,r) {
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2); ctx.fill();
}

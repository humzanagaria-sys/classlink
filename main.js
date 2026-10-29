let animationFrameId, activeGame = "", currentScore = 0;
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const inputState = {};

window.addEventListener("keydown", e => {
    inputState[e.key] = true;
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) e.preventDefault();
});
window.addEventListener("keyup", e => inputState[e.key] = false);

function verifySecureHandshake() {
    if (document.getElementById("accessPasscode").value === "0000") {
        document.getElementById("authGate").style.display = "none";
        document.getElementById("appDashboard").style.display = "grid";
        document.body.style.display = "block";
    } else {
        alert("Cryptographic verification failed.");
    }
}

function setScore(val) {
    currentScore = val;
    document.getElementById("hudScore").innerText = currentScore;
}

function triggerGameOver() {
    cancelAnimationFrame(animationFrameId);
    document.getElementById("failScreen").style.display = "flex";
}

function restartSimulation() {
    document.getElementById("failScreen").style.display = "none";
    buildGameCore(activeGame);
}

function launchSimulation(gameKey, btnElement) {
    document.querySelectorAll(".menu-item").forEach(b => b.classList.remove("active"));
    btnElement.classList.add("active");
    document.getElementById("idleNotice").style.display = "none";
    document.getElementById("failScreen").style.display = "none";
    document.getElementById("viewportArea").style.display = "flex";
    
    document.getElementById("hudTitle").innerText = gameKey.toUpperCase() + " INTERFACE";
    buildGameCore(gameKey);
}

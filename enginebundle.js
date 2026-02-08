import { SensitivityEngine } from "./engine.js";

// Configurações base
const configNormal = { smoothing: 0.35, maxDelta: 14 };
const configPrecisao = { smoothing: 0.4, maxDelta: 12, curve: "bezier" };

// Engine inicial
let engine = new SensitivityEngine(configPrecisao);

// ===== Seletores da UI (CORRIGIDOS) =====
const aimbotToggle = document.getElementById("aimbotToggle");
const precisionToggle = document.getElementById("precisionToggle");
const fovSlider = document.getElementById("fovSlider");
const fovValue = document.getElementById("fovValue");
const sensiDisplay = document.getElementById("sensiDisplay");

// ===== Variáveis de toque =====
let lastTouch = null;
let frameDX = 0;
let frameDY = 0;

// ===== Sincroniza engine com slider =====
function syncEngine() {
    const baseConfig = precisionToggle.checked
        ? configPrecisao
        : configNormal;

    const sensi = parseFloat(fovSlider.value) / 10;

    engine = new SensitivityEngine({
        ...baseConfig,
        sensitivity: sensi
    });

    // Número acompanha o slider
    sensiDisplay.innerText = aimbotToggle.checked
        ? sensi.toFixed(2)
        : "0";
}

// ===== Eventos da interface =====
fovSlider.addEventListener("input", (e) => {
    fovValue.innerText = e.target.value;
    syncEngine();
});

precisionToggle.addEventListener("change", syncEngine);
aimbotToggle.addEventListener("change", syncEngine);

// ===== Toque =====
function onTouchMove(e) {
    if (!aimbotToggle.checked) return;

    const touch = e.touches[0];

    if (!lastTouch) {
        lastTouch = touch;
        return;
    }

    frameDX += touch.clientX - lastTouch.clientX;
    frameDY += touch.clientY - lastTouch.clientY;

    lastTouch = touch;
}

// ===== Loop =====
function loop() {
    if (aimbotToggle.checked && (frameDX !== 0 || frameDY !== 0)) {
        engine.process(frameDX, frameDY);
        frameDX = 0;
        frameDY = 0;
    }
    requestAnimationFrame(loop);
}

// ===== Listeners globais =====
document.addEventListener("touchstart", e => {
    lastTouch = e.touches[0];
}, { passive: true });

document.addEventListener("touchmove", onTouchMove, { passive: true });

document.addEventListener("touchend", () => {
    lastTouch = null;
});

// ===== Iniciar =====
syncEngine();
loop();

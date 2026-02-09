import { SensitivityEngine } from "./engine.js";

// ===== Configurações =====
const configNormal = {
  smoothing: 0.3,
  maxDelta: 16,
  curve: "linear"
};

const configPrecisao = {
  smoothing: 0.45,
  maxDelta: 10,
  curve: "bezier"
};

// ===== Engine =====
let engine = new SensitivityEngine(configNormal);

// ===== UI =====
const aimbotToggle = document.getElementById("aimbotToggle");
const precisionToggle = document.getElementById("precisionToggle");
const fovSlider = document.getElementById("fovSlider");
const fovValue = document.getElementById("fovValue");
const sensiDisplay = document.getElementById("sensiDisplay");

// ===== Toque =====
let lastTouch = null;
let frameDX = 0;
let frameDY = 0;

// ===== Sincroniza engine =====
function syncEngine() {
  const sensi = Number(fovSlider.value) / 10;

  const baseConfig = precisionToggle.checked
    ? configPrecisao
    : configNormal;

  engine = new SensitivityEngine({
    ...baseConfig,
    sensitivity: sensi
  });

  fovValue.innerText = fovSlider.value;

  sensiDisplay.innerText = aimbotToggle.checked
    ? sensi.toFixed(2)
    : "0";
}

// ===== Eventos UI =====
fovSlider.addEventListener("input", syncEngine);
precisionToggle.addEventListener("change", syncEngine);
aimbotToggle.addEventListener("change", syncEngine);

// ===== Touch =====
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
  if (aimbotToggle.checked && (frameDX || frameDY)) {
    engine.process(frameDX, frameDY);
    frameDX = 0;
    frameDY = 0;
  }
  requestAnimationFrame(loop);
}

// ===== Listeners =====
document.addEventListener("touchstart", e => {
  lastTouch = e.touches[0];
}, { passive: true });

document.addEventListener("touchmove", onTouchMove, { passive: true });

document.addEventListener("touchend", () => {
  lastTouch = null;
});

// ===== Start =====
syncEngine();
loop();

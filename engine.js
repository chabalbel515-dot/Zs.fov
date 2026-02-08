export class SensitivityEngine {
  constructor(config = {}) {
    this.lastX = 0;
    this.lastY = 0;
    this.smoothing = config.smoothing ?? 0.35;
    this.maxDelta = config.maxDelta ?? 14;
    this.sensitivity = config.sensitivity ?? 1;
    this.curve = config.curve ?? "bezier";
    this.bezier = config.bezier ?? [0.2, 0.8, 0.3, 1];
  }

  clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  bezierCurve(t) {
    const [p0, p1, p2, p3] = this.bezier;
    return (
      Math.pow(1 - t, 3) * p0 +
      3 * Math.pow(1 - t, 2) * t * p1 +
      3 * (1 - t) * Math.pow(t, 2) * p2 +
      Math.pow(t, 3) * p3
    );
  }

  process(dx, dy) {
    const speed = Math.sqrt(dx * dx + dy * dy);
    const t = this.clamp(speed / 30, 0, 1);

    let curveFactor = this.curve === "bezier" ? this.bezierCurve(t) : t;

    const adjustedDX = dx * curveFactor * this.sensitivity;
    const adjustedDY = dy * curveFactor * this.sensitivity;

    const smoothX = this.lastX + (adjustedDX - this.lastX) * this.smoothing;
    const smoothY = this.lastY + (adjustedDY - this.lastY) * this.smoothing;

    const finalX = this.clamp(smoothX, -this.maxDelta, this.maxDelta);
    const finalY = this.clamp(smoothY, -this.maxDelta, this.maxDelta);

    this.lastX = finalX;
    this.lastY = finalY;

    return { x: finalX, y: finalY };
  }
}

/**
 * Core Engine - Painel Sielzada V3
 * Gerencia a física de movimento baseada nos toggles do usuário.
 */
const Engine = {
    // Valores de referência para os cálculos
    cache: {
        lastX: 0,
        lastY: 0,
        isStale: true
    },

    // Configurações que mudam conforme os botões do painel
    params: {
        lockPixels: 50,      // Trava de X pixels (Aumentar Desempenho)
        smoothFactor: 0.2,   // Suavização (Reduzir Lags/Ruído)
        boost: 1.0           // Multiplicador (Melhorar 2x)
    },

    /**
     * Função principal acionada pelo TouchMove
     * @param {number} dx - Delta X bruto do sensor
     * @param {number} dy - Delta Y bruto do sensor
     * @param {Object} activeFlags - Quais botões estão ligados
     */
    calculate(dx, dy, activeFlags) {
        let finalX = dx;
        let finalY = dy;

        // 1. Lógica "MELHORAR 2X" (Ajuste de Pressão)
        // Se ativo, aumenta a sensibilidade linear em 10%
        if (activeFlags.improve2x) {
            finalX *= 1.1;
            finalY *= 1.1;
        }

        // 2. Lógica "AIMBOT LEGIT" (Suavização de Trajetória)
        // Usa uma média móvel simples para evitar que a mira treme (jitter)
        if (activeFlags.aimbot) {
            finalX = (finalX * (1 - this.params.smoothFactor)) + (this.cache.lastX * this.params.smoothFactor);
            finalY = (finalY * (1 - this.params.smoothFactor)) + (this.cache.lastY * this.params.smoothFactor);
        }

        // 3. Lógica "AUMENTAR DESEMPENHO" (Pixel Lock / Clipping)
        // Se o movimento for brusco demais, o motor trava a velocidade para manter a "pressão"
        if (activeFlags.maxFPS) {
            const magnitude = Math.sqrt(finalX ** 2 + finalY ** 2);
            if (magnitude > this.params.lockPixels) {
                const ratio = this.params.lockPixels / magnitude;
                finalX *= ratio;
                finalY *= ratio;
            }
        }

        // Salva o estado para o próximo frame (Memória Muscular)
        this.cache.lastX = finalX;
        this.cache.lastY = finalY;

        return {
            x: Number(finalX.toFixed(3)),
            y: Number(finalY.toFixed(3))
        };
    },

    // Reseta o motor quando o usuário tira o dedo da tela
    reset() {
        this.cache.lastX = 0;
        this.cache.lastY = 0;
    }
};

export default Engine;

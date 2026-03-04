import Engine from './engine.js';

// Estado das funções
const AppState = {
    isAimbotActive: false,
    isPerformanceActive: false,
};

// Monitorar os Switches
document.getElementById('aimbot').addEventListener('change', (e) => {
    AppState.isAimbotActive = e.target.checked;
    console.log("Motor de Precisão:", AppState.isAimbotActive ? "Ligado" : "Desligado");
});

document.getElementById('fps').addEventListener('change', (e) => {
    AppState.isPerformanceActive = e.target.checked;
    if(AppState.isPerformanceActive) {
        // Ativa modo de alta prioridade no Chrome
        document.body.style.textRendering = "optimizeSpeed";
    }
});

// Lógica de Toque conectada ao Motor
document.addEventListener('touchmove', (e) => {
    if (!AppState.isAimbotActive) return;

    const t = e.touches[0];
    // Aqui simulamos o movimento usando o delta que o motor processa
    // Supondo que você use os deltas do touch original:
    const movement = Engine.calculate(t.clientX, t.clientY);
    
    // Se o switch 'melhorar 2x' estiver ativo, aplicamos um boost extra
    if(document.getElementById('improve2x').checked) {
        movement.x *= 1.1; 
        movement.y *= 1.1;
    }
    
}, { passive: false });

window.openGame = () => {
    alert("Iniciando otimizações e abrindo o jogo...");
    // Em um PWA, você não consegue abrir outro app direto por segurança, 
    // mas pode redirecionar para uma URL de treino ou instrução.
};

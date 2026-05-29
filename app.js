const mira = document.getElementById('mira');

mira.addEventListener('touchstart', function(e) {
    let touch = e.touches[0];
    mira.startX = touch.clientX;
    mira.startY = touch.clientY;
});

mira.addEventListener('touchmove',
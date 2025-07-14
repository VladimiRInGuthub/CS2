function createParticle(x, y) {
  const particle = document.createElement('span');
  particle.classList.add('particle');
  const size = Math.random() * 20 + 10;
  particle.style.width = size + 'px';
  particle.style.height = size + 'px';
  particle.style.left = x - size / 2 + 'px';
  particle.style.top = y - size / 2 + 'px';
  particle.style.background =
    'hsla(' + Math.floor(Math.random()*360) + ", 70%, 60%, 0.8)';
  document.body.appendChild(particle);
  setTimeout(() => particle.remove(), 5000);
}

document.getElementById('animateBtn').addEventListener('click', function(e) {
  const hero = document.querySelector('.hero');
  hero.classList.add('explode');
  for (let i = 0; i < 30; i++) {
    const x = e.clientX + (Math.random() - 0.5) * 200;
    const y = e.clientY + (Math.random() - 0.5) * 200;
    createParticle(x, y);
  }
  setTimeout(() => hero.classList.remove('explode'), 2000);
});

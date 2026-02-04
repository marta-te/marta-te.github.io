const canvas = document.getElementById('rain-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const raindrops = [];
  const numDrops = 150;

  // Create colorful raindrops
  for (let i = 0; i < numDrops; i++) {
    const colors = [
      'rgba(255, 20, 147, 0.6)',   // Hot pink
      'rgba(107, 92, 231, 0.6)',   // Purple
      'rgba(0, 212, 255, 0.6)',    // Cyan
      'rgba(255, 255, 255, 0.4)'   // White
    ];
    
    raindrops.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      length: Math.random() * 30 + 15,
      speed: Math.random() * 4 + 3,
      opacity: Math.random() * 0.3 + 0.4,
      color: colors[Math.floor(Math.random() * colors.length)],
      width: Math.random() * 2 + 1
    });
  }

  // Add floating particles
  const particles = [];
  const numParticles = 30;

  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      color: `rgba(${Math.random() * 100 + 155}, ${Math.random() * 100 + 155}, 255, ${Math.random() * 0.3 + 0.2})`,
      pulseSpeed: Math.random() * 0.02 + 0.01,
      pulsePhase: Math.random() * Math.PI * 2
    });
  }

  function draw() {
    // Slight fade effect
    ctx.fillStyle = 'rgba(26, 15, 61, 0.08)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw raindrops
    for (let i = 0; i < raindrops.length; i++) {
      const drop = raindrops[i];
      ctx.strokeStyle = drop.color;
      ctx.lineWidth = drop.width;
      ctx.globalAlpha = drop.opacity;
      
      ctx.beginPath();
      ctx.moveTo(drop.x, drop.y);
      ctx.lineTo(drop.x, drop.y + drop.length);
      ctx.stroke();

      drop.y += drop.speed;

      if (drop.y > canvas.height) {
        drop.y = -drop.length;
        drop.x = Math.random() * canvas.width;
      }
    }

    // Draw floating particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      
      // Pulsing effect
      p.pulsePhase += p.pulseSpeed;
      const pulse = Math.sin(p.pulsePhase) * 0.5 + 0.5;
      const size = p.size * (0.5 + pulse * 0.5);
      
      ctx.fillStyle = p.color;
      ctx.globalAlpha = 0.6 + pulse * 0.4;
      
      // Draw glowing particle
      ctx.shadowBlur = 10;
      ctx.shadowColor = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Move particle
      p.x += p.speedX;
      p.y += p.speedY;

      // Wrap around edges
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  draw();

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// Cat button functionality (if it exists)
const catButton = document.getElementById('cat-button');
if (catButton) {
  catButton.addEventListener('click', async () => {
    try {
      const response = await fetch('https://api.thecatapi.com/v1/images/search');
      const data = await response.json();
      const catImageUrl = data[0].url;

      const catImageContainer = document.getElementById('cat-image-container');
      catImageContainer.innerHTML = `<img src="${catImageUrl}" alt="Random Cat" />`;
    } catch (error) {
      console.error('Error fetching cat image:', error);
    }
  });
}

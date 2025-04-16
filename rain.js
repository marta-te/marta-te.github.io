const canvas = document.getElementById('rain-canvas');
const ctx = canvas.getContext('2d');

// Set canvas size to fill the window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const raindrops = [];
const numRaindrops = 100;

class Raindrop {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.length = Math.random() * 20 + 10;
    this.speed = Math.random() * 5 + 2;
  }

  fall() {
    this.y += this.speed;
    if (this.y > canvas.height) {
      this.y = -this.length;
      this.x = Math.random() * canvas.width;
    }
  }

  draw() {
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x, this.y + this.length);
    ctx.strokeStyle = 'rgba(211, 195, 253, 0.7)'; // Purple color
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

// Initialize raindrops
for (let i = 0; i < numRaindrops; i++) {
  raindrops.push(new Raindrop());
}

// Animation loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  raindrops.forEach((raindrop) => {
    raindrop.fall();
    raindrop.draw();
  });
  requestAnimationFrame(animate);
}

animate();

// Adjust canvas size on window resize
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

document.getElementById('cat-button').addEventListener('click', async () => {
    const container = document.getElementById('cat-image-container');
    
    // Clear any existing image
    container.innerHTML = '';
  
    try {
      // Fetch a random cat image from The Cat API
      const response = await fetch('https://api.thecatapi.com/v1/images/search');
      const data = await response.json();
      const catImageUrl = data[0].url;
  
      // Create an image element and set its source
      const img = document.createElement('img');
      img.src = catImageUrl;
      img.alt = 'A cute cat';
      img.style.maxWidth = '100%';
      img.style.borderRadius = '10px';
      img.style.marginTop = '1rem';
  
      // Append the image to the container
      container.appendChild(img);
    } catch (error) {
      console.error('Error fetching cat image:', error);
      container.textContent = 'Failed to load a cat picture. Please try again!';
    }
  });
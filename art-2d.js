// Load and display 2D art from JSON
async function load2DArt() {
  const container = document.getElementById('art-2d-gallery');
  container.innerHTML = '<p class="loading">Loading 2D artwork...</p>';
  
  try {
    const response = await fetch('art-2d.json');
    if (!response.ok) {
      throw new Error('Failed to load 2D art data');
    }
    const data = await response.json();
    render2DArt(data.artworks);
  } catch (error) {
    console.error('Error loading 2D art:', error);
    container.innerHTML = '<p class="error">Failed to load 2D artwork. Please try again later.</p>';
  }
}

function render2DArt(artworks) {
  const container = document.getElementById('art-2d-gallery');
  
  if (artworks.length === 0) {
    container.innerHTML = '<p>No 2D artwork yet. Check back soon!</p>';
    return;
  }
  
  container.innerHTML = `
    <div class="plant-grid">
      ${artworks.map(art => `
        <div class="plant-card art-card">
          <img src="${art.imagePath}" alt="${art.title}" loading="lazy" />
          <h3 class="card-title">${art.title}</h3>
          ${art.medium ? `<p class="art-medium"><strong>Medium:</strong> ${art.medium}</p>` : ''}
          ${art.dateCreated ? `<p class="art-date">📅 ${formatDate(art.dateCreated)}</p>` : ''}
          ${art.description ? `<p class="card-description">${art.description}</p>` : ''}
          ${art.tags && art.tags.length > 0 ? `
            <div class="art-tags">
              ${art.tags.map((tag, index) => {
                const tagColors = ['tag-pink', 'tag-purple', 'tag-blue', 'tag-cyan', 'tag-green'];
                const colorClass = tagColors[index % tagColors.length];
                return `<span class="tag ${colorClass}">${tag}</span>`;
              }).join('')}
            </div>
          ` : ''}
        </div>
      `).join('')}
    </div>
  `;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long'
  });
}

// Initialize when tab is clicked
document.addEventListener('DOMContentLoaded', () => {
  const art2dTab = document.querySelector('[data-tab="2d"]');
  if (art2dTab) {
    art2dTab.addEventListener('click', () => {
      const gallery = document.getElementById('art-2d-gallery');
      // Only load if not already loaded
      if (gallery && gallery.querySelector('.loading')) {
        load2DArt();
      }
    });
  }
});

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
  
  // Program icon SVGs
  const programIcons = {
    procreate: '<svg width="16" height="16" viewBox="1600 150 600 550" fill="currentColor"><path d="m 1760.07,528.68 c 38.27,-33.62 85.84,-55.61 134.52,-63.28 59.53,-9.37 118.57,-12.57 181.86,-51.56 19.74,-12.16 35.41,-26.29 47.81,-41.49 32.29,-46.73 42.47,-93.46 44.25,-129.62 1.02,-38.63 -6.28,-66.95 -6.28,-66.95 0,0 17.33,113.38 -94.69,176.66 -82.55,46.63 -213.73,37.97 -304.2,125.15 -91.74,88.41 -83.93,196.8 -83.93,196.8 0,0 7.14,-65.96 53.87,-117.41 7.82,-9.86 16.71,-19.44 26.79,-28.3 z"/></svg>',
    krita: '<svg width="16" height="16" viewBox="0 0 32 32" fill="currentColor"><path d="M0.869 1.016c-0.26-0.005-0.509 0.12-0.667 0.328-0.468 0.593-0.047 1.192 0.485 1.683 0.271 0.249 2.359 2.389 4.567 4.703 0.699-0.98 1.511-1.865 2.423-2.647-2.787-1.728-5.417-3.395-5.729-3.613-0.349-0.251-0.724-0.453-1.079-0.453zM7.677 5.083c2.463 1.532 5.047 3.111 6.255 3.787 1.959 1.095 5.011 3.579 5.459 5.912 0.713 0.62 2.907 2.557 3.459 3.219 0.932-0.281 2.025 0.177 2.749 1.489 1.151 2.115 0.303 5-2.625 6.651-0.129 0.125-0.26 0.245-0.395 0.36l0.395-0.36c1.521-1.952-0.952-3.249-1.567-5.151-0.115-0.333-0.167-0.687-0.147-1.036-0.713-0.38-2.812-1.937-3.729-2.625-2.4 0.213-5.609-2.359-7.129-4.104-0.932-1.068-3.095-3.355-5.147-5.495-1.771 2.489-2.724 5.464-2.728 8.521 0 5.957 3.593 11.333 9.099 13.613 5.505 2.281 11.844 1.021 16.057-3.192s5.479-10.552 3.197-16.063c-2.281-5.505-7.656-9.093-13.615-9.093-3.52 0.005-6.921 1.271-9.588 3.567zM19.292 15.151c-0.688 0.167-1.292 1.109-1.495 1.745-0.048 0.151-0.052 0.401 0.088 0.453 1.073 0.791 2.079 1.557 3.203 2.265 0.215-0.521 0.995-1.281 1.459-1.599zM3.917 17.339c1.083 2.531 7.728 9.557 16.077 3.593-0.005 0.323 0.047 0.647 0.151 0.953 0.615 1.891 3.152 3.235 1.652 5.188-2.844 1.817-6.667 1.599-9.319 0.703-4.744-1.604-7.885-5.776-8.561-10.437zM22.292 18.271c-0.032 0.021-0.057 0.041-0.089 0.068-0.005 0-0.009 0.011-0.009 0.011 0-0.005 0.004-0.011 0.009-0.011 0.032-0.021 0.057-0.047 0.089-0.068z"/></svg>',
    ibispaint: '<svg width="16" height="16" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M27.875,33.5A14.5,14.5,0,1,1,42.375,19,14.5167,14.5167,0,0,1,27.875,33.5Zm0-21a6.5,6.5,0,1,0,6.5,6.5A6.5075,6.5075,0,0,0,27.875,12.5Z"/><path d="M21.375,31.9565V39.5a4,4,0,0,1-8,0V19"/><line x1="6.375" y1="42.5" x2="6.375" y2="22"/><circle fill="currentColor" cx="6.375" cy="19" r="0.75"/><line x1="27.875" y1="25.5" x2="27.875" y2="33.5"/><line x1="23.2788" y1="23.5962" x2="17.622" y2="29.253"/><line x1="21.375" y1="19" x2="13.375" y2="19"/><line x1="23.2788" y1="14.4038" x2="17.622" y2="8.747"/><line x1="27.875" y1="12.5" x2="27.875" y2="4.5"/><line x1="32.4712" y1="14.4038" x2="38.128" y2="8.747"/><line x1="34.375" y1="19" x2="42.375" y2="19"/><line x1="32.4712" y1="23.5962" x2="38.128" y2="29.253"/></svg>',
    ibispaintx: '<svg width="16" height="16" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M27.875,33.5A14.5,14.5,0,1,1,42.375,19,14.5167,14.5167,0,0,1,27.875,33.5Zm0-21a6.5,6.5,0,1,0,6.5,6.5A6.5075,6.5075,0,0,0,27.875,12.5Z"/><path d="M21.375,31.9565V39.5a4,4,0,0,1-8,0V19"/><line x1="6.375" y1="42.5" x2="6.375" y2="22"/><circle fill="currentColor" cx="6.375" cy="19" r="0.75"/><line x1="27.875" y1="25.5" x2="27.875" y2="33.5"/><line x1="23.2788" y1="23.5962" x2="17.622" y2="29.253"/><line x1="21.375" y1="19" x2="13.375" y2="19"/><line x1="23.2788" y1="14.4038" x2="17.622" y2="8.747"/><line x1="27.875" y1="12.5" x2="27.875" y2="4.5"/><line x1="32.4712" y1="14.4038" x2="38.128" y2="8.747"/><line x1="34.375" y1="19" x2="42.375" y2="19"/><line x1="32.4712" y1="23.5962" x2="38.128" y2="29.253"/></svg>'
  };
  
  container.innerHTML = `
    <div class="plant-grid">
      ${artworks.map(art => {
        return `
          <div class="plant-card art-card">
            <img src="${art.imagePath}" alt="${art.title}" loading="lazy" />
            <h3 class="card-title">${art.title}</h3>
            ${art.medium ? `<p class="art-medium"><strong>Medium:</strong> ${art.medium}</p>` : ''}
            ${art.dateCreated ? `<p class="art-date">📅 ${formatDate(art.dateCreated)}</p>` : ''}
            ${art.description ? `<p class="card-description">${art.description}</p>` : ''}
            ${art.tags && art.tags.length > 0 ? `
              <div class="art-tags">
                ${art.tags.map((tag, index) => {
                  const isProgramTag = ['procreate', 'krita', 'ibispaint', 'ibispaintx'].includes(tag.toLowerCase());
                  const tagColors = ['tag-pink', 'tag-purple', 'tag-blue', 'tag-cyan', 'tag-green'];
                  const colorClass = isProgramTag ? 'program-badge' : tagColors[index % tagColors.length];
                  // Check if it's a program tag and add icon
                  const programIcon = programIcons[tag.toLowerCase()] || '';
                  return `<span class="tag ${colorClass}">${programIcon ? `${programIcon} ` : ''}${tag}</span>`;
                }).join('')}
              </div>
            ` : ''}
          </div>
        `;
      }).join('')}
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

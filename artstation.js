// Load ArtStation projects
async function loadArtStation(username) {
  const container = document.getElementById('artstation-gallery');
  container.innerHTML = '<p class="loading">Loading 3D artwork from ArtStation...</p>';
  
  try {
    // Try multiple CORS proxy options
    const apiUrl = `https://www.artstation.com/users/${username}/projects.json`;
    
    // Try proxies in order
    const proxies = [
      `https://api.allorigins.win/raw?url=${encodeURIComponent(apiUrl)}`,
      `https://corsproxy.io/?${encodeURIComponent(apiUrl)}`,
      `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(apiUrl)}`
    ];
    
    let data = null;
    let lastError = null;
    
    for (const proxyUrl of proxies) {
      try {
        const response = await fetch(proxyUrl);
        if (response.ok) {
          data = await response.json();
          break;
        }
      } catch (e) {
        lastError = e;
        continue;
      }
    }
    
    if (!data) {
      throw lastError || new Error('All proxy attempts failed');
    }
    
    renderArtStationProjects(data.data || []);
    
  } catch (error) {
    console.error('Error loading ArtStation:', error);
    container.innerHTML = `
      <div class="error">
        <p>Unable to load ArtStation projects due to browser restrictions.</p>
        <p><a href="https://www.artstation.com/${username}" target="_blank" rel="noopener noreferrer" 
           style="color: var(--accent-pink); text-decoration: none; font-weight: bold;">
          View my ArtStation profile directly →
        </a></p>
      </div>
    `;
  }
}

function renderArtStationProjects(projects) {
  const container = document.getElementById('artstation-gallery');
  
  if (projects.length === 0) {
    container.innerHTML = '<p>No projects found.</p>';
    return;
  }
  
  container.innerHTML = `
    <div class="plant-grid">
      ${projects.map(project => `
        <a href="${project.permalink}" target="_blank" rel="noopener noreferrer" class="plant-card art-card artstation-card">
          <img src="${project.cover.thumb_url || project.cover.small_square_url}" 
               alt="${project.title}" 
               loading="lazy" />
          <h3 class="card-title">${project.title}</h3>
          ${project.description ? `<p class="card-description">${truncateText(project.description, 100)}</p>` : ''}
        </a>
      `).join('')}
    </div>
    <p style="text-align: center; margin-top: 2rem; color: #666;">
      <em>All artwork hosted on <a href="https://www.artstation.com/${getUsername()}" target="_blank" rel="noopener noreferrer">ArtStation</a></em>
    </p>
  `;
}

function truncateText(text, maxLength) {
  // Remove HTML tags
  const plainText = text.replace(/<[^>]*>/g, '');
  if (plainText.length <= maxLength) return plainText;
  return plainText.substring(0, maxLength).trim() + '...';
}

function getUsername() {
  // You'll need to set your ArtStation username here
  return 'marta-teivane';
}

// Initialize when tab is clicked
document.addEventListener('DOMContentLoaded', () => {
  const artstationTab = document.querySelector('[data-tab="3d"]');
  if (artstationTab) {
    artstationTab.addEventListener('click', () => {
      const gallery = document.getElementById('artstation-gallery');
      // Only load if not already loaded
      if (gallery && gallery.querySelector('.loading')) {
        loadArtStation(getUsername());
      }
    });
  }
});

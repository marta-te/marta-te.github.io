// Load ArtStation projects
async function loadArtStation(username) {
  const container = document.getElementById('artstation-gallery');
  container.innerHTML = '<p class="loading">Loading 3D artwork from ArtStation...</p>';
  
  try {
    const apiUrl = `https://www.artstation.com/users/${username}/projects.json`;
    
    // Try different proxy services with longer timeout
    const proxies = [
      { url: `https://api.allorigins.win/get?url=${encodeURIComponent(apiUrl)}`, parseJson: true },
      { url: `https://corsproxy.io/?${encodeURIComponent(apiUrl)}`, parseJson: false },
      { url: `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(apiUrl)}`, parseJson: false },
      { url: `https://proxy.cors.sh/${apiUrl}`, parseJson: false }
    ];
    
    let data = null;
    let lastError = null;
    
    for (const proxy of proxies) {
      try {
        console.log(`Trying proxy: ${proxy.url.split('?')[0]}`);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await fetch(proxy.url, {
          signal: controller.signal,
          headers: proxy.url.includes('cors.sh') ? { 'x-cors-api-key': 'temp_demo' } : {}
        });
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const jsonData = await response.json();
          // allorigins wraps response in .contents
          data = proxy.parseJson && jsonData.contents ? JSON.parse(jsonData.contents) : jsonData;
          console.log('Successfully loaded data');
          break;
        }
      } catch (e) {
        console.error(`Proxy failed:`, e.message);
        lastError = e;
        continue;
      }
    }
    
    if (!data || !data.data) {
      throw lastError || new Error('All proxy attempts failed');
    }
    
    renderArtStationProjects(data.data || []);
    
  } catch (error) {
    console.error('Error loading ArtStation:', error);
    container.innerHTML = `
      <div class="error">
        <p>Unable to load ArtStation projects at the moment.</p>
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

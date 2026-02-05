// Load ArtStation projects
async function loadArtStation(username) {
  const container = document.getElementById('artstation-gallery');
  container.innerHTML = '<p class="loading">Loading 3D artwork from ArtStation...</p>';
  
  try {
    const apiUrl = `https://www.artstation.com/users/${username}/projects.json`;
    
    // Try different proxy services
    const proxies = [
      { 
        url: `https://api.allorigins.win/get?url=${encodeURIComponent(apiUrl)}`, 
        parse: (json) => {
          try {
            // allorigins returns {contents: "stringified json", status: {...}}
            return typeof json.contents === 'string' ? JSON.parse(json.contents) : json.contents;
          } catch (e) {
            console.error('Failed to parse allorigins response:', e);
            return null;
          }
        }
      },
      { 
        url: `https://thingproxy.freeboard.io/fetch/${apiUrl}`, 
        parse: (json) => json 
      },
      { 
        url: `https://corsproxy.io/?${encodeURIComponent(apiUrl)}`, 
        parse: (json) => json 
      }
    ];
    
    let data = null;
    let lastError = null;
    
    for (const proxy of proxies) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        
        const response = await fetch(proxy.url, {
          signal: controller.signal,
          method: 'GET'
        });
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const jsonData = await response.json();
          data = proxy.parse(jsonData);
          
          if (data && data.data) {
            break;
          } else {
            data = null;
          }
        }
      } catch (e) {
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
      <div class="error" style="text-align: center; padding: 2rem;">
        <p style="margin-bottom: 1rem;">3D artwork loading is temporarily unavailable in this browser.</p>
        <a href="https://www.artstation.com/${username}" 
           target="_blank" 
           rel="noopener noreferrer" 
           class="contact-btn"
           style="display: inline-block; margin-top: 1rem;">
          View Full Portfolio on ArtStation →
        </a>
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

// Load ArtStation projects
async function loadArtStation(username) {
  const container = document.getElementById('artstation-gallery');
  container.innerHTML = '<p class="loading">Loading 3D artwork from ArtStation...</p>';
  
  try {
    const apiUrl = `https://www.artstation.com/users/${username}/projects.json`;
    
    // Try different proxy services with longer timeouts
    const proxies = [
      { 
        url: `https://api.allorigins.win/get?url=${encodeURIComponent(apiUrl)}`, 
        parse: (json) => {
          try {
            return typeof json.contents === 'string' ? JSON.parse(json.contents) : json.contents;
          } catch (e) {
            console.error('Failed to parse allorigins response:', e);
            return null;
          }
        }
      },
      { 
        url: `https://corsproxy.io/?${encodeURIComponent(apiUrl)}`, 
        parse: (json) => json 
      },
      { 
        url: `https://cors-anywhere.herokuapp.com/${apiUrl}`, 
        parse: (json) => json 
      },
      { 
        url: `https://thingproxy.freeboard.io/fetch/${apiUrl}`, 
        parse: (json) => json 
      }
    ];
    
    let data = null;
    let lastError = null;
    
    for (const proxy of proxies) {
      try {
        console.log(`Trying proxy: ${proxy.url}`);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000); // Increased timeout
        
        const response = await fetch(proxy.url, {
          signal: controller.signal,
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const jsonData = await response.json();
          data = proxy.parse(jsonData);
          
          if (data && (data.data || Array.isArray(data))) {
            console.log('Successfully loaded ArtStation data');
            break;
          }
        }
      } catch (error) {
        lastError = error;
        console.warn(`Proxy ${proxy.url} failed:`, error.message);
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
        <p style="margin-bottom: 1rem; color: rgba(255, 255, 255, 0.9);">Unable to load 3D artwork at the moment. Please try refreshing the page.</p>
        <button onclick="loadArtStation('${username}')" 
                style="padding: 0.8rem 1.5rem; background: linear-gradient(135deg, var(--accent-purple), var(--accent-light-purple)); color: white; border: none; border-radius: 25px; cursor: pointer; margin-right: 1rem;">
          Try Again
        </button>
        <a href="https://www.artstation.com/${username}" 
           target="_blank" 
           rel="noopener noreferrer" 
           style="display: inline-block; padding: 0.8rem 1.5rem; background: rgba(10, 10, 10, 0.9); color: white; text-decoration: none; border-radius: 25px; border: 2px solid var(--accent-purple);">
          View on ArtStation →
        </a>
      </div>
    `;
  }
}

function renderArtStationProjects(projects) {
  const container = document.getElementById('artstation-gallery');
  
  if (!projects || projects.length === 0) {
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
          <div class="artstation-meta">ArtStation</div>
        </a>
      `).join('')}
    </div>
  `;
}

function truncateText(text, maxLength) {
  const plainText = text.replace(/<[^>]*>/g, '');
  if (plainText.length <= maxLength) return plainText;
  return plainText.substring(0, maxLength).trim() + '...';
}

function getUsername() {
  return 'marta-teivane';
}

// Load ArtStation projects
async function loadArtStation(username) {
  const container = document.getElementById('artstation-gallery');
  container.innerHTML = '<p class="loading">Loading 3D artwork from ArtStation...</p>';
  
  try {
    const apiUrl = `https://www.artstation.com/users/${username}/projects.json`;
    
    // Try different proxy services with longer timeouts
    const proxies = [
      { 
        url: `https://cors.bridged.cc/${apiUrl}`, 
        parse: (json) => json 
      },
      { 
        url: `https://api.allorigins.win/get?url=${encodeURIComponent(apiUrl)}`, 
        parse: (json) => {
          try {
            return typeof json.contents === 'string' ? JSON.parse(json.contents) : json.contents;
          } catch (e) {
            return null;
          }
        }
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
        // Silent attempt - no console logs unless successful
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch(proxy.url, {
          signal: controller.signal,
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          }
        });
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const jsonData = await response.json();
          data = proxy.parse(jsonData);
          
          if (data && (data.data || Array.isArray(data))) {
            console.log('✅ Successfully loaded ArtStation data');
            break;
          }
        }
      } catch (error) {
        lastError = error;
        // Silent failure, try next proxy
        continue;
      }
    }
    
    if (!data || !data.data) {
      throw lastError || new Error('All proxy attempts failed');
    }
    
    renderArtStationProjects(data.data || []);
    
  } catch (error) {
    container.innerHTML = `
      <div class="artstation-fallback" style="text-align: center; padding: 2rem;">
        <h3 style="margin: 0 0 1rem 0; color: var(--accent-light-purple); font-size: 1.3rem;">My 3D Portfolio</h3>
        <p style="margin-bottom: 2rem; font-size: 1.1rem; color: rgba(255, 255, 255, 0.9); line-height: 1.6;">
          Due to current proxy limitations, please visit my ArtStation directly to view my latest 3D work.
        </p>
        <a href="https://www.artstation.com/${username}" 
           target="_blank" 
           rel="noopener noreferrer" 
           style="display: inline-block; padding: 1rem 2rem; background: linear-gradient(135deg, rgba(10, 10, 10, 0.9), rgba(26, 19, 46, 0.9)); color: white; text-decoration: none; border-radius: 30px; font-weight: 500; border: 2px solid var(--accent-purple); box-shadow: 0 6px 25px rgba(139, 92, 246, 0.5), inset 0 0 15px rgba(139, 92, 246, 0.1); transition: all 0.3s ease; margin-bottom: 2rem;">
          🎨 Visit ArtStation Portfolio →
        </a>
        <div style="padding: 1.5rem; background: rgba(10, 10, 10, 0.7); border-radius: 20px; border: 2px solid rgba(139, 92, 246, 0.3); box-shadow: 0 8px 25px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(139, 92, 246, 0.15);">
          <p style="margin: 0; font-size: 0.95rem; color: rgba(255, 255, 255, 0.85); line-height: 1.5;">
            <strong>Featured:</strong> Character models • Environment art • Game assets • Blender creations
          </p>
        </div>
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

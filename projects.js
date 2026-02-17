// Load and display projects
async function loadProjects() {
  try {
    // Add cache-busting parameter to avoid GitHub Pages caching issues
    const response = await fetch(`projects.json?v=${Date.now()}`);
    console.log('Response status:', response.status, 'OK:', response.ok);
    if (!response.ok) {
      throw new Error(`Failed to load projects data: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    console.log('Projects data loaded:', data);
    renderProjects(data.projects);
  } catch (error) {
    console.error('Error loading projects:', error);
    document.getElementById('projects-container').innerHTML = 
      `<p class="error" style="color: var(--accent-light-purple); text-align: center; padding: 2rem;">
        Failed to load projects: ${error.message}<br>
        <small style="opacity: 0.7;">Try refreshing the page or check console for details.</small>
      </p>`;
  }
}

function renderProjects(projects) {
  const container = document.getElementById('projects-container');
  
  if (projects.length === 0) {
    container.innerHTML = '<p>No projects yet. Check back soon!</p>';
    return;
  }
  
  container.innerHTML = projects.map(project => {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.dataset.id = String(project.id);
    
    const banner = document.createElement('div');
    banner.className = 'project-banner';
    const img = document.createElement('img');
    img.src = String(project.bannerImage);
    img.alt = String(project.title);
    img.onerror = function() {
      this.src = `https://via.placeholder.com/400x300/6b5ce7/ffffff?text=${encodeURIComponent(project.title)}`;
    };
    banner.appendChild(img);
    card.appendChild(banner);
    
    const content = document.createElement('div');
    content.className = 'project-content';
    
    const title = document.createElement('h2');
    title.className = 'project-title';
    title.textContent = project.title;
    content.appendChild(title);
    
    const year = document.createElement('p');
    year.className = 'project-year';
    year.textContent = project.year;
    content.appendChild(year);
    
    if (project.tags && project.tags.length > 0) {
      const tagsDiv = document.createElement('div');
      tagsDiv.className = 'project-tags';
      project.tags.forEach(tag => {
        const span = document.createElement('span');
        span.className = 'project-tag';
        span.textContent = tag;
        tagsDiv.appendChild(span);
      });
      content.appendChild(tagsDiv);
    }
    
    const desc = document.createElement('p');
    desc.className = 'project-description';
    desc.textContent = project.description;
    content.appendChild(desc);
    
    if (project.technologies && project.technologies.length > 0) {
      const techDiv = document.createElement('div');
      techDiv.className = 'project-tech';
      project.technologies.forEach(tech => {
        const span = document.createElement('span');
        span.className = 'tech-tag';
        span.textContent = tech;
        techDiv.appendChild(span);
      });
      content.appendChild(techDiv);
    }
    
    if (project.link && project.link !== '#' && isValidUrl(project.link)) {
      const link = document.createElement('a');
      link.href = project.link;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.className = 'project-link';
      link.textContent = 'View Project →';
      content.appendChild(link);
    }
    
    card.appendChild(content);
    return card.outerHTML;
  }).join('');
}

function isValidUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

// Load projects when page loads
document.addEventListener('DOMContentLoaded', loadProjects);

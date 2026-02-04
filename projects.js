// Load and display projects
async function loadProjects() {
  try {
    const response = await fetch('projects.json');
    if (!response.ok) {
      throw new Error('Failed to load projects data');
    }
    const data = await response.json();
    renderProjects(data.projects);
  } catch (error) {
    console.error('Error loading projects:', error);
    document.getElementById('projects-container').innerHTML = 
      '<p class="error">Failed to load projects. Please try again later.</p>';
  }
}

function renderProjects(projects) {
  const container = document.getElementById('projects-container');
  
  if (projects.length === 0) {
    container.innerHTML = '<p>No projects yet. Check back soon!</p>';
    return;
  }
  
  container.innerHTML = projects.map(project => `
    <div class="project-card" data-id="${project.id}">
      <div class="project-banner">
        <img src="${project.bannerImage}" alt="${project.title}" onerror="this.src='https://via.placeholder.com/400x300/6b5ce7/ffffff?text=${encodeURIComponent(project.title)}'">
      </div>
      <div class="project-content">
        <h2 class="project-title">${project.title}</h2>
        <p class="project-year">${project.year}</p>
        ${project.tags && project.tags.length > 0 ? `
          <div class="project-tags">
            ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
          </div>
        ` : ''}
        <p class="project-description">${project.description}</p>
        ${project.technologies && project.technologies.length > 0 ? `
          <div class="project-tech">
            ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
          </div>
        ` : ''}
        ${project.link && project.link !== '#' ? `
          <a href="${project.link}" target="_blank" rel="noopener noreferrer" class="project-link">
            View Project →
          </a>
        ` : ''}
      </div>
    </div>
  `).join('');
}

// Load projects when page loads
document.addEventListener('DOMContentLoaded', loadProjects);

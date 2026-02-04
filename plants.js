// Load and display plants from JSON
async function loadPlants() {
  try {
    const response = await fetch('plants.json');
    if (!response.ok) {
      throw new Error('Failed to load plants data');
    }
    const data = await response.json();
    renderPlants(data.plants);
  } catch (error) {
    console.error('Error loading plants:', error);
    document.querySelector('.plant-grid').innerHTML = 
      '<p class="error">Failed to load plants. Please try again later.</p>';
  }
}

function renderPlants(plants) {
  const grid = document.querySelector('.plant-grid');
  
  if (plants.length === 0) {
    grid.innerHTML = '<p>No plants found yet. Check back soon!</p>';
    return;
  }
  
  grid.innerHTML = plants.map(plant => `
    <div class="plant-card" data-id="${plant.id}">
      <img src="${plant.imagePath}" alt="${plant.commonName}" />
      <p class="plant-name"><strong>${plant.commonName}</strong></p>
      <p class="plant-scientific"><em>${plant.scientificName}</em></p>
      ${plant.dateFound ? `<p class="plant-date">📅 ${formatDate(plant.dateFound)}</p>` : ''}
      ${plant.location ? `<p class="plant-location">📍 ${plant.location}</p>` : ''}
    </div>
  `).join('');
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

// Load plants when page loads
document.addEventListener('DOMContentLoaded', loadPlants);

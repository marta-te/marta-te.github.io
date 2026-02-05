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
  
  grid.innerHTML = plants.map(plant => {
    const div = document.createElement('div');
    div.className = 'plant-card';
    div.dataset.id = String(plant.id);
    
    const img = document.createElement('img');
    img.src = String(plant.imagePath);
    img.alt = String(plant.commonName);
    div.appendChild(img);
    
    const namePara = document.createElement('p');
    namePara.className = 'plant-name';
    const strong = document.createElement('strong');
    strong.textContent = plant.commonName;
    namePara.appendChild(strong);
    div.appendChild(namePara);
    
    const scientificPara = document.createElement('p');
    scientificPara.className = 'plant-scientific';
    const em = document.createElement('em');
    em.textContent = plant.scientificName;
    scientificPara.appendChild(em);
    div.appendChild(scientificPara);
    
    if (plant.dateFound) {
      const datePara = document.createElement('p');
      datePara.className = 'plant-date';
      datePara.textContent = `📅 ${formatDate(plant.dateFound)}`;
      div.appendChild(datePara);
    }
    
    if (plant.location) {
      const locPara = document.createElement('p');
      locPara.className = 'plant-location';
      locPara.textContent = `📍 ${plant.location}`;
      div.appendChild(locPara);
    }
    
    return div.outerHTML;
  }).join('');
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

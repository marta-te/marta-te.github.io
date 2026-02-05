// Scrapbook Filter System - Single Selection Per Category
class ScrapbookFilter {
  constructor() {
    this.allPages = [];
    this.filterData = null;
    this.activeFilters = {
      colors: null,
      styles: null,
      elements: null,
      mood: null
    };
    this.currentPageIndex = 0;
  }

  async init() {
    try {
      const response = await fetch('scrapbook.json');
      if (!response.ok) {
        throw new Error('Failed to load scrapbook data');
      }
      const data = await response.json();
      // Sort pages: square first, then by ID
      this.allPages = data.pages.sort((a, b) => {
        if (a.shape === 'square' && b.shape !== 'square') return -1;
        if (a.shape !== 'square' && b.shape === 'square') return 1;
        return a.id - b.id;
      });
      this.filterData = data.filterCategories;
      
      this.renderFilterControls();
      this.showCurrentPage();
      
    } catch (error) {
      console.error('Error loading scrapbook:', error);
      document.querySelector('.page-container').innerHTML = 
        '<p class="error">Failed to load scrapbook. Please try again later.</p>';
    }
  }

  renderFilterControls() {
    const container = document.getElementById('filter-controls');
    container.innerHTML = '';
    
    Object.entries(this.filterData).forEach(([category, values]) => {
      const filterBox = document.createElement('div');
      filterBox.className = 'filter-box';
      
      const heading = document.createElement('h3');
      heading.textContent = this.capitalize(category);
      filterBox.appendChild(heading);
      
      const buttonsDiv = document.createElement('div');
      buttonsDiv.className = 'filter-buttons';
      
      values.forEach(value => {
        const button = document.createElement('button');
        button.className = 'filter-btn';
        button.dataset.category = category;
        button.dataset.value = value;
        button.textContent = this.capitalize(value);
        button.addEventListener('click', () => this.selectFilter(category, value));
        buttonsDiv.appendChild(button);
      });
      
      filterBox.appendChild(buttonsDiv);
      container.appendChild(filterBox);
    });
  }

  selectFilter(category, value) {
    if (this.activeFilters[category] === value) {
      this.activeFilters[category] = null;
    } else {
      this.activeFilters[category] = value;
    }
    
    document.querySelectorAll(`[data-category="${category}"]`).forEach(btn => {
      if (btn.dataset.value === value && this.activeFilters[category] === value) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    
    this.currentPageIndex = 0;
    this.showCurrentPage();
  }

  getFilteredPages() {
    const hasActiveFilters = Object.values(this.activeFilters).some(val => val !== null);
    
    if (!hasActiveFilters) {
      return this.allPages;
    }

    return this.allPages.filter(page => {
      return Object.entries(this.activeFilters).every(([category, value]) => {
        if (value === null) return true;
        return page[category] && page[category].includes(value);
      });
    });
  }

  showCurrentPage() {
    const filteredPages = this.getFilteredPages();
    const viewer = document.getElementById('scrapbook-viewer');
    const count = document.getElementById('result-count');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (filteredPages.length === 0) {
      viewer.innerHTML = '<p style="text-align: center; color: var(--primary-fg); padding: 3rem;">No pages match your filters. Try different combinations!</p>';
      count.textContent = 'No matching pages';
      prevBtn.disabled = true;
      nextBtn.disabled = true;
      return;
    }
    
    if (this.currentPageIndex >= filteredPages.length) {
      this.currentPageIndex = filteredPages.length - 1;
    }
    if (this.currentPageIndex < 0) {
      this.currentPageIndex = 0;
    }
    
    const page = filteredPages[this.currentPageIndex];
    
    count.textContent = `Page ${this.currentPageIndex + 1} of ${filteredPages.length}`;
    
    viewer.innerHTML = '';
    const card = document.createElement('div');
    card.className = 'scrapbook-card';
    card.dataset.pageNum = `#${page.id}`;
    
    const img = document.createElement('img');
    img.src = String(page.imagePath);
    img.alt = `Scrapbook page ${page.id}`;
    card.appendChild(img);
    
    viewer.appendChild(card);
    
    prevBtn.disabled = this.currentPageIndex === 0;
    nextBtn.disabled = this.currentPageIndex === filteredPages.length - 1;
  }

  nextPage() {
    const filteredPages = this.getFilteredPages();
    if (this.currentPageIndex < filteredPages.length - 1) {
      this.currentPageIndex++;
      this.showCurrentPage();
    }
  }

  prevPage() {
    if (this.currentPageIndex > 0) {
      this.currentPageIndex--;
      this.showCurrentPage();
    }
  }

  randomPage() {
    const filteredPages = this.getFilteredPages();
    if (filteredPages.length > 0) {
      this.currentPageIndex = Math.floor(Math.random() * filteredPages.length);
      this.showCurrentPage();
    }
  }

  clearFilters() {
    Object.keys(this.activeFilters).forEach(category => {
      this.activeFilters[category] = null;
    });
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    
    this.currentPageIndex = 0;
    this.showCurrentPage();
  }

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

const scrapbookFilter = new ScrapbookFilter();

// Mobile horizontal scroll selection
function setupMobileScrollSelection() {
  if (window.innerWidth > 768) return;
  
  const filterCategories = document.querySelectorAll('.filter-box');
  
  filterCategories.forEach(filterBox => {
    const container = filterBox.querySelector('.filter-buttons');
    if (!container) return;
    
    const category = container.querySelector('.filter-btn')?.dataset.category;
    if (!category) return;
    
    let scrollTimeout;
    let hasInteracted = false;
    
    const updateCenteredFilter = (shouldSelect = false) => {
      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;
      
      let closestBtn = null;
      let closestDistance = Infinity;
      
      container.querySelectorAll('.filter-btn').forEach(btn => {
        const btnRect = btn.getBoundingClientRect();
        const btnCenter = btnRect.left + btnRect.width / 2;
        const distance = Math.abs(containerCenter - btnCenter);
        
        if (distance < closestDistance) {
          closestDistance = distance;
          closestBtn = btn;
        }
        
        // Update visual centered state
        if (distance < containerRect.width * 0.15) {
          btn.classList.add('centered');
        } else {
          btn.classList.remove('centered');
        }
      });
      
      // Auto-select the centered filter after scrolling stops (only if interacted)
      if (shouldSelect && closestBtn && closestDistance < containerRect.width * 0.15) {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          const value = closestBtn.dataset.value;
          scrapbookFilter.selectFilter(category, value);
        }, 150);
      }
    };
    
    // Mark as interacted on first scroll
    container.addEventListener('scroll', () => {
      hasInteracted = true;
      updateCenteredFilter(true);
    }, { passive: true });
    
    // Initial visual update only (no selection)
    setTimeout(() => updateCenteredFilter(false), 100);
    
    // Reset interaction flag when filters are cleared
    const originalClearFilters = scrapbookFilter.clearFilters.bind(scrapbookFilter);
    scrapbookFilter.clearFilters = function() {
      hasInteracted = false;
      originalClearFilters();
      setTimeout(() => updateCenteredFilter(false), 100);
    };
  });
}

// Mobile swipe functionality
function setupMobileSwipe() {
  if (window.innerWidth > 768) return;
  
  const viewer = document.getElementById('scrapbook-viewer');
  let touchStartX = 0;
  let touchEndX = 0;
  
  viewer.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  
  viewer.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });
  
  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swiped left - next page
        scrapbookFilter.nextPage();
      } else {
        // Swiped right - previous page
        scrapbookFilter.prevPage();
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  scrapbookFilter.init().then(() => {
    setupMobileScrollSelection();
    setupMobileSwipe();
  });
  
  // Re-setup on resize
  window.addEventListener('resize', () => {
    setupMobileScrollSelection();
  });
});

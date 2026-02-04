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
      this.allPages = data.pages;
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
    
    const html = Object.entries(this.filterData).map(([category, values]) => `
      <div class="filter-box">
        <h3>${this.capitalize(category)}</h3>
        <div class="filter-buttons">
          ${values.map(value => `
            <button class="filter-btn" 
                    data-category="${category}" 
                    data-value="${value}"
                    onclick="scrapbookFilter.selectFilter('${category}', '${value}')">
              ${this.capitalize(value)}
            </button>
          `).join('')}
        </div>
      </div>
    `).join('');
    
    container.innerHTML = html;
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
    
    viewer.innerHTML = `
      <div class="scrapbook-card">
        <img src="${page.imagePath}" alt="Scrapbook page ${page.id}" />
        <div class="scrapbook-tags">
          ${page.colors.slice(0, 3).map(color => `<span class="tag tag-${color}">${color}</span>`).join('')}
          ${page.styles.slice(0, 2).map(style => `<span class="tag">${style}</span>`).join('')}
        </div>
      </div>
    `;
    
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

document.addEventListener('DOMContentLoaded', () => {
  scrapbookFilter.init();
});

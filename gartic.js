// Load and display Gartic Phone art from Instagram embeds
async function loadGarticArt() {
  const container = document.getElementById('gartic-gallery');
  container.innerHTML = '<p class="loading">Loading Gartic Phone art...</p>';
  
  try {
    const response = await fetch('gartic.json');
    if (!response.ok) {
      throw new Error('Failed to load Gartic art data');
    }
    const data = await response.json();
    renderGarticArt(data.posts);
  } catch (error) {
    console.error('Error loading Gartic art:', error);
    container.innerHTML = '<p class="error">Failed to load Gartic Phone art. Please try again later.</p>';
  }
}

function renderGarticArt(posts) {
  const container = document.getElementById('gartic-gallery');
  
  if (posts.length === 0) {
    container.innerHTML = '<p>No Gartic Phone artwork yet. Check back soon!</p>';
    return;
  }
  
  container.innerHTML = `
    <div class="gartic-grid">
      ${posts.map(post => {
        if (post.type === 'instagram') {
          return `
            <div class="gartic-card">
              <div class="instagram-wrapper">
                <blockquote class="instagram-media" 
                  data-instgrm-permalink="${post.url}?utm_source=ig_embed&amp;utm_campaign=loading" 
                  data-instgrm-version="14"
                  style="background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);">
                </blockquote>
              </div>
              ${post.description ? `<p class="gartic-description">${post.description}</p>` : ''}
            </div>
          `;
        } else if (post.type === 'image') {
          return `
            <div class="gartic-card">
              <img src="${post.url}" alt="Gartic Phone art" loading="lazy" style="width: 100%; border-radius: 8px;" />
              ${post.description ? `<p class="gartic-description">${post.description}</p>` : ''}
            </div>
          `;
        }
      }).join('')}
    </div>
  `;
  
  // Load Instagram embed script
  if (!window.instgrm) {
    const script = document.createElement('script');
    script.src = '//www.instagram.com/embed.js';
    script.async = true;
    script.onload = () => {
      if (window.instgrm) {
        window.instgrm.Embeds.process();
        // Show embeds after they load
        setTimeout(() => {
          document.querySelectorAll('.instagram-wrapper').forEach(wrapper => {
            wrapper.classList.add('loaded');
          });
        }, 1000);
      }
    };
    document.body.appendChild(script);
  } else {
    window.instgrm.Embeds.process();
    // Show embeds after they load
    setTimeout(() => {
      document.querySelectorAll('.instagram-wrapper').forEach(wrapper => {
        wrapper.classList.add('loaded');
      });
    }, 1000);
  }
}

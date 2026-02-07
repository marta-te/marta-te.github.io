// Lightbox functionality for images
document.addEventListener('DOMContentLoaded', () => {
  // Create lightbox overlay
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <div class="lightbox-content">
      <img src="" alt="" class="lightbox-image" />
      <div class="lightbox-copyright">© Marta Teivāne</div>
    </div>
  `;
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector('.lightbox-image');

  // Function to open lightbox
  function openLightbox(imgSrc, imgAlt) {
    lightboxImg.src = imgSrc;
    lightboxImg.alt = imgAlt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // Function to close lightbox
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Close on lightbox click
  lightbox.addEventListener('click', closeLightbox);

  // Prevent closing when clicking the image itself
  lightboxImg.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });

  // Add click handlers to images using event delegation
  document.body.addEventListener('click', (e) => {
    // Check if clicked element is an image inside art-card or plant-card
    // but NOT inside artstation-card
    if (e.target.tagName === 'IMG' && 
        (e.target.closest('.art-card') || e.target.closest('.plant-card')) &&
        !e.target.closest('.artstation-card')) {
      openLightbox(e.target.src, e.target.alt);
    }
  });
});

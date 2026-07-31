let isAutoScrolling = true;
let manualScrollTimeout;

function scrollGallery(direction) {
  const container = document.getElementById('galleryScroll');
  if (!container) return;
  
  // Pause auto-scroll when user manually clicks
  isAutoScrolling = false;
  clearTimeout(manualScrollTimeout);
  manualScrollTimeout = setTimeout(() => { 
    isAutoScrolling = true; 
  }, 3000);
  
  // Use smooth scrolling for button clicks
  container.style.scrollBehavior = 'smooth';
  const scrollAmount = 300; 
  container.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
}

function autoScrollContinuous() {
  const container = document.getElementById('galleryScroll');
  if (container && isAutoScrolling) {
    // Make sure behavior is auto so frame by frame increments work
    container.style.scrollBehavior = 'auto';
    
    // Increment by exactly 1 pixel (safe against DOM sub-pixel rounding errors)
    container.scrollLeft += 1;
    
    // Loop back when we've passed the halfway point (duplicated content)
    if (container.scrollLeft >= (container.scrollWidth / 2)) {
      container.scrollLeft = 0;
    }
  }
  requestAnimationFrame(autoScrollContinuous);
}

// Start auto-scroll when DOM loads and add hover mechanics
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('galleryScroll');
  
  if (container) {
    // Duplicate children to create a seamless looping effect
    const originalContent = container.innerHTML;
    container.innerHTML += originalContent;

    requestAnimationFrame(autoScrollContinuous);
  }
  
  const galleryWrapper = document.querySelector('.gallery-wrapper');
  if (galleryWrapper) {
    galleryWrapper.addEventListener('mouseenter', () => isAutoScrolling = false);
    galleryWrapper.addEventListener('mouseleave', () => isAutoScrolling = true);
  }

  // --- Scroll Reveal Animation Logic ---
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Once animated, we can stop observing it
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15 // Trigger when 15% of the element is visible
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });
});

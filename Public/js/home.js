  function scrollGallery(direction) {
    const container = document.getElementById('galleryScroll');
    const scrollAmount = 300;
    container.scrollBy({
      left: direction * scrollAmount,
      behavior: 'smooth'
    });
  }


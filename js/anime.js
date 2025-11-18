document.addEventListener('DOMContentLoaded', function () {
  // animate the page title
  if (typeof anime !== 'undefined') {
    anime.timeline({
      easing: 'easeOutExpo',
      duration: 700
    })
    .add({
      targets: '#pageTitle',
      translateY: [-30, 0],
      opacity: [0, 1],
      scale: [0.98, 1],
    })
    .add({
      targets: '#gallery img',
      translateY: [20, 0],
      opacity: [0, 1],
      scale: [0.98, 1],
      delay: anime.stagger(120)
    }, '-=300');

    // removed hover magnify per user preference — images will not change on hover
    
    // chat-like scroll highlighting
    (function setupScrollObserver(){
      var slides = Array.from(document.querySelectorAll('.slide'));
      if (!slides.length) return;

      var current = 0;

      function setActive(index){
        slides.forEach(function(slide, i){
          if (i === index) slide.classList.add('is-active'); else slide.classList.remove('is-active');
        });
      }

      var observer = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if (entry.isIntersecting){
            var idx = slides.indexOf(entry.target);
            if (idx !== -1 && idx !== current){
              current = idx;
              setActive(current);
            }
          }
        });
      }, {
        root: null,
        threshold: 0.55
      });

      slides.forEach(function(slide){ observer.observe(slide); });
      setActive(current);

      function scrollToIndex(index){
        index = Math.max(0, Math.min(slides.length - 1, index));
        current = index;
        setActive(current);
        slides[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      window.addEventListener('keydown', function(e){
        if (e.key === 'ArrowDown'){ e.preventDefault(); scrollToIndex(current + 1); }
        if (e.key === 'ArrowUp'){ e.preventDefault(); scrollToIndex(current - 1); }
      });
    })();
  } else {
    console.warn('anime.js not found — please check the CDN script is loaded.');
  }
});

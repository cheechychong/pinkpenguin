document.addEventListener("DOMContentLoaded", () => {
  const revealables = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => entry.target.classList.add("visible"), delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealables.forEach(el => observer.observe(el));

  const ctas = document.querySelectorAll("[data-cta]");
  ctas.forEach(button => {
    button.addEventListener("pointermove", event => {
      const rect = button.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      button.style.setProperty("--cta-x", `${x}%`);
      button.style.setProperty("--cta-y", `${y}%`);
    });
  });

  const verticalAccent = document.querySelector(".hero__vertical");
  if (verticalAccent) {
    window.addEventListener("scroll", () => {
      const offset = window.scrollY * -0.05;
      verticalAccent.style.transform = `rotate(180deg) translateY(${offset}px)`;
    });
  }
});

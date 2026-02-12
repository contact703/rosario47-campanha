// Mobile menu toggle
function toggleMobileMenu() {
  const nav = document.getElementById('mobileNav');
  nav.classList.toggle('show');
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Close mobile menu when clicking outside
document.addEventListener('click', function(e) {
  const nav = document.getElementById('mobileNav');
  const btn = document.querySelector('.mobile-menu-btn');
  if (nav && nav.classList.contains('show') && !nav.contains(e.target) && !btn.contains(e.target)) {
    nav.classList.remove('show');
  }
});

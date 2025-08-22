document.addEventListener('DOMContentLoaded', function() {
  // FAQ Toggle functionality
  const faqItems = document.querySelectorAll('.faq-item');
  const dividers = document.querySelectorAll('.faq-divider');
  
  const setDividersAround = (item, collapsed) => {
    const prev = item.previousElementSibling;
    const next = item.nextElementSibling;
    [prev, next].forEach(el => {
      if (el && el.classList.contains('faq-divider')) {
        el.classList.toggle('is-collapsed', collapsed);
      }
    });
  };

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const toggle = item.querySelector('.faq-toggle');
    
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq-toggle').textContent = '+';
      });
       dividers.forEach(d => d.classList.remove('is-collapsed'));

      if (!isActive) {
        item.classList.add('active');
        toggle.textContent = '−';
        setDividersAround(item, true)
      } else {
        toggle.textContent = '+';
      }
    });
  });
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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
  
  // Demo button click handlers
  const demoButtons = document.querySelectorAll('.btn-demo, .btn-primary');
  demoButtons.forEach(button => {
    button.addEventListener('click', () => {
      alert('Demo booking functionality would be implemented here. For now, please contact us directly.');
    });
  });
});
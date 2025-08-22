// FAQ Toggle functionality
document.addEventListener('DOMContentLoaded', function() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const toggle = item.querySelector('.faq-toggle');
    
    // Initially hide all answers
    answer.style.display = 'none';
    
    question.addEventListener('click', () => {
      const isOpen = answer.style.display !== 'none';
      
      // Close all other FAQ items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.querySelector('.faq-answer').style.display = 'none';
          otherItem.querySelector('.faq-toggle').textContent = '+';
        }
      });
      
      // Toggle current item
      if (isOpen) {
        answer.style.display = 'none';
        toggle.textContent = '+';
      } else {
        answer.style.display = 'block';
        toggle.textContent = '−';
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
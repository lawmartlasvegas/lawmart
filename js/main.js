document.getElementById('contact-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const feedback = document.getElementById('form-feedback');
    feedback.style.color = 'green';
    feedback.textContent = 'Thank you! Your message has been sent successfully. A LawMart specialist will contact you shortly.';
    this.reset();
});

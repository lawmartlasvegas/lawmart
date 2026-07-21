const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');

toggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.main-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
  });
});

document.getElementById('year').textContent = new Date().getFullYear();

const intakeForm = document.getElementById('client-intake-form');
const formStatus = document.getElementById('form-status');

intakeForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!intakeForm.checkValidity()) {
    intakeForm.reportValidity();
    formStatus.textContent = 'Please complete the required fields above.';
    formStatus.classList.add('error');
    return;
  }

  const data = new FormData(intakeForm);
  const service = data.get('service');
  const firstName = String(data.get('firstName') || '').trim();
  const lastName = String(data.get('lastName') || '').trim();
  const email = String(data.get('email') || '').trim();
  const phone = String(data.get('phone') || '').trim();
  const contactMethod = data.get('contactMethod');
  const contactTime = data.get('contactTime');
  const details = String(data.get('details') || '').trim();

  const subject = `LawMart consultation request: ${service} - ${firstName} ${lastName}`;
  const body = [
    'LAW MART CONSULTATION REQUEST',
    '',
    `Service requested: ${service}`,
    `Prospective client: ${firstName} ${lastName}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    `Preferred contact method: ${contactMethod}`,
    `Best time to reach client: ${contactTime}`,
    '',
    'How LawMart can help:',
    details,
    '',
    'Acknowledgment: The prospective client confirmed that LawMart is not a law firm, does not provide legal advice, and prepares documents only at the client’s direction.'
  ].join('\n');

  formStatus.classList.remove('error');
  formStatus.textContent = 'Your email application should open now. Review the request, then press Send.';
  window.location.href = `mailto:brenden@lawmartlasvegas.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

(() => {
  const config = window.LAWMART_CONFIG || {};
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.primary-nav');
  menuButton?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
  document.querySelectorAll('.primary-nav a').forEach(link => link.addEventListener('click', () => {
    nav?.classList.remove('open'); menuButton?.setAttribute('aria-expanded','false');
  }));
  document.querySelectorAll('#year').forEach(el => el.textContent = new Date().getFullYear());

  const header = document.querySelector('.site-header');
  const progress = document.querySelector('.scroll-progress');
  const onScroll = () => {
    header?.classList.toggle('scrolled', window.scrollY > 18);
    if (progress) {
      const max = document.documentElement.scrollHeight - innerHeight;
      progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    }
    document.querySelectorAll('[data-parallax]').forEach(el => {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      el.style.transform = `translate3d(0, ${Math.min(window.scrollY * .07, 48)}px, 0)`;
    });
  };
  addEventListener('scroll', onScroll, {passive:true}); onScroll();

  const revealObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
  }), {threshold:.11}) : null;
  document.querySelectorAll('.reveal').forEach(el => revealObserver ? revealObserver.observe(el) : el.classList.add('visible'));

  document.querySelectorAll('details').forEach(detail => detail.addEventListener('toggle', () => {
    if (!detail.open) return;
    detail.parentElement?.querySelectorAll('details[open]').forEach(other => { if (other !== detail) other.open = false; });
  }));

  const track = (name, params={}) => {
    if (typeof window.gtag === 'function') window.gtag('event', name, params);
  };
  document.addEventListener('click', e => {
    const target = e.target.closest('[data-track]');
    if (target) track(target.dataset.track, {link_text:(target.textContent||'').trim().slice(0,80), link_url:target.href||''});
  });

  if (config.GA4_MEASUREMENT_ID && /^G-[A-Z0-9]+$/.test(config.GA4_MEASUREMENT_ID)) {
    const s=document.createElement('script'); s.async=true; s.src=`https://www.googletagmanager.com/gtag/js?id=${config.GA4_MEASUREMENT_ID}`; document.head.appendChild(s);
    window.dataLayer=window.dataLayer||[]; window.gtag=function(){dataLayer.push(arguments)};
    gtag('js',new Date()); gtag('config',config.GA4_MEASUREMENT_ID,{anonymize_ip:true});
  }

  document.querySelectorAll('[data-google-business]').forEach(link => {
    link.href = config.GOOGLE_BUSINESS_URL || 'https://www.google.com/search?q=LawMart+Las+Vegas';
  });
  document.querySelectorAll('[data-booking]').forEach(link => link.addEventListener('click', e => {
    if (config.BOOKING_URL) { e.preventDefault(); track('booking_click'); location.href=config.BOOKING_URL; }
  }));

  document.querySelectorAll('[data-service]').forEach(link => link.addEventListener('click', () => {
    const value=link.dataset.service;
    try { sessionStorage.setItem('lawmartService', value); } catch(e) {}
    const target=document.querySelector(`input[name="service"][value="${CSS.escape(value)}"]`); if(target) target.checked=true;
  }));
  try {
    const saved=sessionStorage.getItem('lawmartService');
    if(saved){ const target=document.querySelector(`input[name="service"][value="${CSS.escape(saved)}"]`); if(target) target.checked=true; sessionStorage.removeItem('lawmartService'); }
  } catch(e) {}

  const intakeForm=document.getElementById('intake-form'); const status=document.getElementById('form-status');
  intakeForm?.addEventListener('submit', async event => {
    event.preventDefault();
    if(!intakeForm.checkValidity()){ intakeForm.reportValidity(); if(status){status.textContent='Please complete the required fields.';status.classList.add('error')} return; }
    const data=new FormData(intakeForm); const service=data.get('service'); const first=String(data.get('firstName')||'').trim(); const last=String(data.get('lastName')||'').trim();
    if(status){status.classList.remove('error');status.textContent='Preparing your request…'}
    track('generate_lead',{service_name:service});
    if(config.FORM_ENDPOINT){
      try{
        const response=await fetch(config.FORM_ENDPOINT,{method:'POST',body:data,headers:{Accept:'application/json'}});
        if(!response.ok) throw new Error('Submission failed');
        location.href='/thank-you/'; return;
      }catch(err){ if(status){status.textContent='Online submission was unavailable. Opening your email application instead.';status.classList.add('error')} }
    }
    const subject=`LawMart consultation request: ${service} - ${first} ${last}`;
    const body=['LAWMART CONSULTATION REQUEST','',`Service: ${service}`,`Name: ${first} ${last}`,`Email: ${data.get('email')}`,`Phone: ${data.get('phone')}`,`Preferred contact: ${data.get('contactMethod')}`,`Best time: ${data.get('contactTime')}`,'','How LawMart can help:',String(data.get('details')||'').trim(),'','Acknowledgment: I understand LawMart is not a law firm, does not provide legal advice, and prepares documents only at my direction.'].join('\n');
    if(status) status.textContent='Opening your email application…';
    location.href=`mailto:brenden@lawmartlasvegas.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
})();
